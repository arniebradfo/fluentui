const { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist/source');
mkdirSync(output, { recursive: true });

// Remove only previous build entries, never the source or a caller-provided path.
for (const entry of readdirSync(output)) {
  rmSync(path.join(output, entry), { recursive: true, force: true });
}

cpSync(path.join(root, 'src'), path.join(output, 'src'), {
  recursive: true,
  filter: source => !/\.(test|cy)\.[jt]sx?$/.test(source) && path.basename(source) !== 'testing',
});
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
writeFileSync(path.join(output, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
cpSync(path.join(root, 'README.md'), path.join(output, 'README.md'));
cpSync(path.resolve(root, '../../../../LICENSE'), path.join(output, 'LICENSE'));
console.log(`Source recipes and CSS Modules copied to ${path.relative(root, output)}`);
