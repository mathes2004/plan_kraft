import { afterEach, describe, expect, test } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
// The sync runner is native ESM so Windows startup can run it without a TypeScript loader.
// @ts-expect-error JavaScript script intentionally has no declaration file.
import { createRepository, findGit } from '../scripts/auto-sync.mjs';

const git = findGit();
const fixtures: string[] = [];
function command(cwd: string, ...args: string[]) {
  const result = spawnSync(git, args, {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_CONFIG_NOSYSTEM: '1' },
  });
  if (result.status !== 0) throw new Error(`Fixture git ${args[0]} failed: ${result.stderr}`);
  return result.stdout.trim();
}
function fixture() {
  const temp = mkdtempSync(join(tmpdir(), 'plan-kraft-sync-'));
  fixtures.push(temp);
  const remote = join(temp, 'remote.git');
  const root = join(temp, 'work');
  mkdirSync(remote);
  mkdirSync(root);
  command(remote, 'init', '--bare', '--initial-branch=main');
  command(root, 'init', '--initial-branch=main');
  command(root, 'config', 'user.name', 'Sync Test');
  command(root, 'config', 'user.email', 'sync@example.invalid');
  command(root, 'config', 'commit.gpgsign', 'false');
  command(root, 'config', 'core.autocrlf', 'false');
  writeFileSync(
    join(root, '.gitignore'),
    '.env*\n!.env.example\n.auto-sync/\nnode_modules/\n*.key\n',
  );
  writeFileSync(join(root, 'page.txt'), 'original');
  writeFileSync(join(root, 'remove.txt'), 'obsolete');
  command(root, 'add', '--all');
  command(root, 'commit', '-m', 'Initial');
  command(root, 'remote', 'add', 'origin', remote);
  command(root, 'push', '--set-upstream', 'origin', 'main');
  return { temp, root, remote, sync: createRepository({ root, git, expectedRemote: remote }) };
}
afterEach(() => {
  for (const temp of fixtures.splice(0)) {
    const resolved = resolve(temp);
    if (!resolved.startsWith(resolve(tmpdir()) + sep + 'plan-kraft-sync-'))
      throw new Error('Refusing cleanup outside the test fixture directory.');
    rmSync(resolved, { recursive: true, force: true });
  }
});

describe('automatic GitHub sync with isolated local Git remotes', () => {
  test('pushes additions, edits and deletions while keeping private files local', () => {
    const { root, remote, sync } = fixture();
    writeFileSync(join(root, 'page.txt'), 'updated');
    writeFileSync(join(root, 'new.txt'), 'new content');
    unlinkSync(join(root, 'remove.txt'));
    writeFileSync(join(root, '.env.local'), 'DO_NOT_PUBLISH=private');
    writeFileSync(join(root, 'private.key'), 'private');
    mkdirSync(join(root, 'node_modules'));
    writeFileSync(join(root, 'node_modules', 'generated.js'), 'generated');
    mkdirSync(join(root, '.auto-sync'));
    writeFileSync(join(root, '.auto-sync', 'status.json'), '{}');
    const result = sync.sync();
    expect(result).toMatchObject({ committed: true, pushed: true });
    expect(command(remote, 'show', 'main:page.txt')).toBe('updated');
    expect(command(remote, 'ls-tree', '-r', '--name-only', 'main').split('\n')).toEqual([
      '.gitignore',
      'new.txt',
      'page.txt',
    ]);
    expect(sync.snapshot()).toBe(result.cleanSnapshot);
    expect(sync.sync()).toMatchObject({ committed: false, pushed: false });
    expect(readFileSync(join(root, '.env.local'), 'utf8')).toContain('private');
  });

  test('pauses when GitHub has newer commits and leaves local work intact', () => {
    const { temp, root, remote, sync } = fixture();
    const other = join(temp, 'other');
    command(temp, 'clone', remote, other);
    command(other, 'config', 'user.name', 'Other Test');
    command(other, 'config', 'user.email', 'other@example.invalid');
    command(other, 'config', 'commit.gpgsign', 'false');
    writeFileSync(join(other, 'other.txt'), 'remote edit');
    command(other, 'add', '--all');
    command(other, 'commit', '-m', 'Remote edit');
    command(other, 'push');
    const before = command(root, 'rev-parse', 'HEAD');
    writeFileSync(join(root, 'page.txt'), 'local edit');
    expect(() => sync.sync()).toThrow('GitHub has new commits');
    expect(command(root, 'rev-parse', 'HEAD')).toBe(before);
    expect(readFileSync(join(root, 'page.txt'), 'utf8')).toBe('local edit');
    expect(command(root, 'diff', '--cached', '--name-only')).toBe('');
  });

  test('pauses on another branch, changed destination or in-progress Git operation', () => {
    const { root, sync } = fixture();
    command(root, 'checkout', '-b', 'feature');
    expect(() => sync.sync()).toThrow('switch back to main');
    command(root, 'checkout', 'main');
    command(root, 'remote', 'set-url', '--push', 'origin', 'https://github.com/other/repo');
    expect(() => sync.sync()).toThrow('origin no longer points');
    command(root, 'config', '--unset-all', 'remote.origin.pushurl');
    writeFileSync(join(root, '.git', 'MERGE_HEAD'), 'in progress');
    expect(() => sync.sync()).toThrow('Git operation');
  });

  test('retries an unpublished commit after push failure without creating duplicate commits', () => {
    const { root, remote, sync } = fixture();
    const hook = join(remote, 'hooks', 'pre-receive');
    writeFileSync(hook, '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    writeFileSync(join(root, 'page.txt'), 'pending upload');
    expect(() => sync.sync()).toThrow('Git push failed');
    expect(command(root, 'rev-list', '--count', 'HEAD')).toBe('2');
    unlinkSync(hook);
    expect(sync.sync()).toMatchObject({ committed: false, pushed: true });
    expect(command(remote, 'rev-list', '--count', 'main')).toBe('2');
    expect(command(remote, 'show', 'main:page.txt')).toBe('pending upload');
  });

  test('defers when files changed since the idle snapshot', () => {
    const { root, sync } = fixture();
    const snapshot = sync.snapshot();
    writeFileSync(join(root, 'page.txt'), 'still editing');
    expect(sync.sync(snapshot)).toEqual({ deferred: true });
    expect(command(root, 'rev-list', '--count', 'HEAD')).toBe('1');
    expect(command(root, 'diff', '--cached', '--name-only')).toBe('');
  });

  test('blocks secret files even when they were removed in a later unpublished commit', () => {
    const { root, remote, sync } = fixture();
    writeFileSync(join(root, '.env.local'), 'private');
    command(root, 'add', '-f', '.env.local');
    command(root, 'commit', '-m', 'Accidental secret');
    command(root, 'rm', '--cached', '.env.local');
    command(root, 'commit', '-m', 'Untrack secret');
    expect(() => sync.sync()).toThrow('outgoing commits contain');
    expect(command(remote, 'rev-list', '--count', 'main')).toBe('1');
  });
});
