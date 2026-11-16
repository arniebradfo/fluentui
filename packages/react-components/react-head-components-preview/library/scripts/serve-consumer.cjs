const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const mode = process.argv[2]?.replace(/^--/, '') ?? 'consumer';
const previews = {
  consumer: { directory: '../dist/consumer/public', port: 8098 },
  storybook: { directory: '../../stories/dist/storybook', port: 8099 },
  'visual-reference': { directory: '../../stories/dist/visual-reference', port: 8100 },
  'visual-candidate': { directory: '../../stories/dist/visual-candidate', port: 8101 },
};
const preview = previews[mode];
if (!preview) {
  throw new Error(`Unknown preview mode: ${mode}`);
}
const root = path.resolve(__dirname, preview.directory);
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
    response.end(`Preview file not found. Build the ${mode} target first.`);
    return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
server.listen(preview.port, '127.0.0.1', () => {
  console.log(`${mode} ready at http://127.0.0.1:${preview.port}`);
});
