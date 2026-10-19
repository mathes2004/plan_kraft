import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../.pages-preview/out', import.meta.url)));
if (!existsSync(resolve(root, 'index.html'))) throw new Error('Run npm run build:pages first.');
const basePath = process.env.PAGES_BASE_PATH ?? '/plan_kraft';
const port = Number(process.env.PAGES_PREVIEW_PORT || 4173);
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
  }
  if (basePath && pathname === basePath) {
    response.writeHead(308, { Location: `${basePath}/` }).end();
    return;
  }
  if (!pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end();
    return;
  }
  let file = resolve(root, `.${pathname.slice(basePath.length)}`);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  let status = 200;
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) {
      response.writeHead(308, { Location: `${pathname}/` }).end();
      return;
    }
    file = resolve(file, 'index.html');
  }
  if (!existsSync(file) || !statSync(file).isFile()) {
    file = resolve(root, '404.html');
    status = 404;
  }
  response.writeHead(status, {
    'Content-Type': `${mime[extname(file)] || 'application/octet-stream'}; charset=utf-8`,
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () =>
  console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`),
);
