const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const storybook = process.argv.includes('--storybook');
const root = path.resolve(__dirname, storybook ? '../../stories/dist/storybook' : '../dist/consumer/public');
const port = storybook ? 8099 : 8098;
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404);
    response.end(`Preview file not found. Build the ${storybook ? 'Storybook' : 'consumer'} target first.`);
    return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`${storybook ? 'Storybook' : 'Source consumer'} ready at http://127.0.0.1:${port}`);
});
