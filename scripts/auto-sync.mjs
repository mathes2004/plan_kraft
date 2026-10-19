import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve, delimiter, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const repositoryUrl = 'https://github.com/mathes2004/plan_kraft';

export function findGit() {
  const candidates = [
    'git',
    'C:/Program Files/Git/cmd/git.exe',
    'C:/Program Files (x86)/Git/cmd/git.exe',
    join(process.env.LOCALAPPDATA || '', 'Programs/Git/cmd/git.exe'),
  ];
  for (const candidate of candidates) {
    if (spawnSync(candidate, ['--version'], { windowsHide: true }).status === 0) return candidate;
  }
  throw new Error('Git is unavailable. Install Git for Windows, then restart auto-sync.');
}

function privatePath(path) {
  const parts = path.replaceAll('\\', '/').split('/');
  return (
    parts.some((part) =>
      [
        '.git',
        '.auto-sync',
        '.aws',
        '.codex',
        'node_modules',
        '.next',
        '.pages-preview',
        'dist',
        'dist-ssr',
        'out',
        'test-results',
        'playwright-report',
      ].includes(part),
    ) ||
    (basename(path).startsWith('.env') && basename(path) !== '.env.example') ||
    /\.(?:pem|key|p12|pfx|tsbuildinfo|log|local)$/i.test(path)
  );
}

export function createRepository({
  root = projectRoot,
  git = findGit(),
  expectedRemote = repositoryUrl,
} = {}) {
  root = resolve(root);
  const env = {
    ...process.env,
    PATH: `${dirname(git)}${delimiter}${process.env.PATH || ''}`,
    GIT_TERMINAL_PROMPT: '0',
    GCM_INTERACTIVE: 'Never',
  };
  function run(args, allowed = [0]) {
    const result = spawnSync(git, args, {
      cwd: root,
      env,
      encoding: 'utf8',
      windowsHide: true,
      timeout: 45000,
      maxBuffer: 16 * 1024 * 1024,
    });
    if (!allowed.includes(result.status)) {
      throw new Error(
        `Git ${args[0]} failed. Check connectivity, GitHub sign-in and repository permissions; no history was overwritten.`,
      );
    }
    return { output: result.stdout || '', status: result.status };
  }
  const lines = (args) => run(args).output.split('\0').filter(Boolean);
  function guard() {
    if (resolve(run(['rev-parse', '--show-toplevel']).output.trim()) !== root)
      throw new Error('Auto-sync must run from the application repository root.');
    if (run(['branch', '--show-current']).output.trim() !== 'main')
      throw new Error('Auto-sync is paused: switch back to main when ready.');
    const normalize = (url) =>
      url
        .trim()
        .replace(/\/$/, '')
        .replace(/\.git$/, '');
    for (const args of [
      ['remote', 'get-url', 'origin'],
      ['remote', 'get-url', '--push', '--all', 'origin'],
    ]) {
      const urls = run(args).output.trim().split('\n');
      if (urls.length !== 1 || normalize(urls[0]) !== normalize(expectedRemote))
        throw new Error('Auto-sync is paused: origin no longer points to the configured project.');
    }
    for (const marker of [
      'MERGE_HEAD',
      'CHERRY_PICK_HEAD',
      'REVERT_HEAD',
      'rebase-merge',
      'rebase-apply',
      'BISECT_LOG',
    ]) {
      if (existsSync(resolve(root, run(['rev-parse', '--git-path', marker]).output.trim())))
        throw new Error('Auto-sync is paused while a Git operation is in progress.');
    }
    if (lines(['ls-files', '-z']).some(privatePath))
      throw new Error(
        'Auto-sync is paused: a private or generated file is tracked. Remove it from Git tracking first.',
      );
    for (const variable of ['user.name', 'user.email']) {
      if (!run(['config', '--get', variable], [0, 1]).output.trim())
        throw new Error(`Configure Git ${variable} before starting auto-sync.`);
    }
  }
  function snapshot() {
    const files = [
      ...new Set([
        ...lines(['diff', '--name-only', '-z', 'HEAD', '--']),
        ...lines(['ls-files', '--others', '--exclude-standard', '-z']),
      ]),
    ].sort();
    if (files.some(privatePath))
      throw new Error('Auto-sync is paused: a private or generated file is not ignored.');
    const hash = createHash('sha256').update(run(['rev-parse', 'HEAD']).output);
    for (const file of files) {
      hash.update(file).update('\0');
      try {
        hash.update(readFileSync(join(root, file)));
      } catch (error) {
        if (error.code === 'ENOENT') hash.update('<deleted>');
        else throw error;
      }
      hash.update('\0');
    }
    return hash.digest('hex');
  }
  function sync(expectedSnapshot) {
    guard();
    run(['fetch', '--no-tags', 'origin', 'main']);
    const remoteHead = run(['rev-parse', 'FETCH_HEAD']).output.trim();
    if (run(['merge-base', '--is-ancestor', remoteHead, 'HEAD'], [0, 1]).status !== 0)
      throw new Error(
        'Auto-sync is paused: GitHub has new commits. Integrate them manually before retrying; local files were preserved.',
      );
    const outgoing = run(['rev-list', `${remoteHead}..HEAD`])
      .output.trim()
      .split('\n')
      .filter(Boolean);
    for (const commit of outgoing) {
      if (
        lines(['diff-tree', '--no-commit-id', '--name-only', '-r', '-z', commit, '--']).some(
          privatePath,
        )
      )
        throw new Error(
          'Auto-sync is paused: outgoing commits contain a private or generated file.',
        );
    }
    const before = snapshot();
    if (expectedSnapshot && before !== expectedSnapshot) return { deferred: true };
    run(['add', '--all', '--', '.']);
    if (snapshot() !== before) return { deferred: true };
    let committed = false;
    if (run(['diff', '--cached', '--quiet', '--exit-code'], [0, 1]).status === 1) {
      run(['commit', '-m', `Auto-sync: saved project changes (${new Date().toISOString()})`]);
      committed = true;
    }
    const ahead = Number(run(['rev-list', '--count', `${remoteHead}..HEAD`]).output.trim());
    if (ahead > 0) run(['push', 'origin', 'HEAD:refs/heads/main']);
    return {
      committed,
      pushed: ahead > 0,
      head: run(['rev-parse', '--short', 'HEAD']).output.trim(),
      cleanSnapshot: createHash('sha256')
        .update(run(['rev-parse', 'HEAD']).output)
        .digest('hex'),
    };
  }
  return { root, guard, snapshot, sync };
}

function acquireLock(directory) {
  mkdirSync(directory, { recursive: true });
  const path = join(directory, 'watcher.lock');
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      writeFileSync(path, String(process.pid), { flag: 'wx' });
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const pid = Number(readFileSync(path, 'utf8'));
      if (!Number.isInteger(pid) || pid <= 0)
        throw new Error('Invalid auto-sync lock; inspect .auto-sync/watcher.lock.');
      try {
        process.kill(pid, 0);
        const running = new Error('Auto-sync is already running.');
        running.code = 'SYNC_ALREADY_RUNNING';
        throw running;
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
      unlinkSync(path);
      if (attempt === 1) throw new Error('Could not acquire the auto-sync lock.');
    }
  }
  return () => {
    if (existsSync(path) && readFileSync(path, 'utf8') === String(process.pid)) unlinkSync(path);
  };
}

async function main() {
  const stateDirectory = join(projectRoot, '.auto-sync');
  const paused = join(stateDirectory, 'paused');
  const requested = join(stateDirectory, 'sync-requested');
  mkdirSync(stateDirectory, { recursive: true });
  if (process.argv.includes('--pause')) {
    writeFileSync(paused, 'Paused by user. Run npm.cmd run sync:resume to resume.\n');
    console.log('Auto-sync paused. The watcher will stop within 10 seconds.');
    return;
  }
  const repository = createRepository();
  if (process.argv.includes('--check')) {
    repository.guard();
    console.log('Repository checks passed. No files committed or pushed.');
    return;
  }
  if (process.argv.includes('--resume') && existsSync(paused)) unlinkSync(paused);
  if (existsSync(paused)) {
    console.log('Auto-sync is paused.');
    return;
  }
  let release;
  try {
    release = acquireLock(stateDirectory);
  } catch (error) {
    if (error.code === 'SYNC_ALREADY_RUNNING' && process.argv.includes('--once')) {
      writeFileSync(requested, 'Immediate sync requested by user.\n');
      console.log(
        'Immediate sync requested. The running watcher will process it within 10 seconds.',
      );
      return;
    }
    throw error;
  }
  process.on('exit', release);
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(0));
  function report(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    writeFileSync(
      join(stateDirectory, 'status.json'),
      JSON.stringify({ at: new Date().toISOString(), message }, null, 2),
    );
  }
  if (process.argv.includes('--once')) {
    const result = repository.sync();
    report(
      result.deferred
        ? 'Files changed during sync; retry after saving.'
        : `Up to date with GitHub at ${result.head}.`,
    );
    return;
  }
  report('Watching saved project files. Sync starts after 30 seconds without further changes.');
  let observed = null,
    lastSynced = null,
    changedAt = Date.now(),
    retryAt = 0,
    lastError = '';
  function tick() {
    if (existsSync(paused)) {
      report('Auto-sync paused by user.');
      process.exit(0);
    }
    try {
      repository.guard();
      const force = existsSync(requested);
      if (force) unlinkSync(requested);
      const current = repository.snapshot();
      if (current !== observed) {
        observed = current;
        changedAt = Date.now();
      }
      if (
        !force &&
        (current === lastSynced || Date.now() - changedAt < 30000 || Date.now() < retryAt)
      )
        return;
      const result = repository.sync(current);
      if (result.deferred) {
        observed = null;
        return;
      }
      lastSynced = result.cleanSnapshot;
      lastError = '';
      report(
        `Up to date with GitHub at ${result.head}. ${result.pushed ? 'Changes pushed.' : 'No new changes.'}`,
      );
    } catch (error) {
      retryAt = Date.now() + 60000;
      if (lastError !== error.message) {
        report(error.message);
        lastError = error.message;
      }
    }
  }
  tick();
  setInterval(tick, 10000);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
