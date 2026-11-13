const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

async function main() {
  const root = path.resolve(__dirname, '..');
  const consumer = path.join(root, 'dist/consumer');
  const source = path.join(root, 'dist/source');
  const manifest = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8'));
  for (const file of manifest.files) {
    assert(fs.existsSync(path.join(source, file)), `Source artifact is missing ${file}`);
  }
  fs.mkdirSync(consumer, { recursive: true });
  fs.rmSync(path.join(consumer, 'components'), { recursive: true, force: true });
  fs.cpSync(path.join(source, 'src'), path.join(consumer, 'components'), { recursive: true });
  fs.cpSync(path.join(__dirname, 'consumer'), consumer, { recursive: true });
  fs.writeFileSync(
    path.join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'head-components-source-consumer',
        version: '0.0.0',
        private: true,
        type: 'module',
        dependencies: {
          ...manifest.dependencies,
          '@microsoft/focusgroup-polyfill': '1.5.0',
          react: '19.2.0',
          'react-dom': '19.2.0',
        },
        devDependencies: { '@types/react': '19.2.2', '@types/react-dom': '19.2.2' },
      },
      null,
      2,
    ),
  );
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
      '--registry=https://registry.npmjs.org',
    ],
    { cwd: consumer, stdio: 'inherit' },
  );
  const installed = path.join(consumer, 'node_modules/@fluentui/react-headless-components-preview/package.json');
  assert(
    fs.realpathSync(installed).startsWith(`${consumer}${path.sep}`),
    'Headless must resolve outside workspace links',
  );
  assert.equal(JSON.parse(fs.readFileSync(installed, 'utf8')).version, '0.4.1');

  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--project', 'tsconfig.json'], {
    cwd: consumer,
    stdio: 'inherit',
  });

  const publicDir = path.join(consumer, 'public');
  const browserOptions = {
    absWorkingDir: consumer,
    outdir: publicDir,
    bundle: true,
    splitting: false,
    format: 'esm',
    platform: 'browser',
    target: ['chrome129', 'firefox147', 'safari26'],
    loader: { '.module.css': 'local-css' },
    define: { 'process.env.NODE_ENV': '"production"' },
    // Keep CSS Module names stable across the separate server/client builds.
    minifySyntax: true,
    minifyWhitespace: true,
    metafile: true,
    logLevel: 'warning',
  };
  const result = await esbuild.build({ ...browserOptions, entryPoints: ['App.tsx', 'reverse.tsx'] });
  // Multiple entries get distinct CSS names. Match the server's single-entry graph.
  const hydration = await esbuild.build({ ...browserOptions, entryPoints: ['Hydrate.tsx'] });
  const metafile = {
    inputs: { ...result.metafile.inputs, ...hydration.metafile.inputs },
    outputs: { ...result.metafile.outputs, ...hydration.metafile.outputs },
  };
  const retained = new Set(
    Object.entries(metafile.outputs)
      .filter(([name]) => name.endsWith('.js'))
      .flatMap(([, output]) =>
        Object.entries(output.inputs)
          .filter(([, input]) => input.bytesInOutput > 0)
          .map(([name]) => name),
      ),
  );
  const engines = [...retained].filter(name => /node_modules\/(?:@griffel\/(?:core|react)|tabster)\//.test(name));
  assert.deepEqual(engines, [], 'Production source consumer retained a legacy styling/focus engine');
  const outsideInputs = [...retained].filter(
    name => !path.resolve(consumer, name).startsWith(`${consumer}${path.sep}`),
  );
  assert.deepEqual(outsideInputs, [], 'The source consumer must not resolve workspace modules');
  fs.writeFileSync(path.join(consumer, 'metafile.json'), JSON.stringify(metafile, null, 2));
  for (const [file, entry] of [
    ['index.html', 'App'],
    ['reverse.html', 'reverse'],
  ]) {
    fs.writeFileSync(
      path.join(publicDir, file),
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>Fluent CSS Modules consumer</title>` +
        `<link rel="stylesheet" href="./${entry}.css"><link rel="stylesheet" href="./consumer.css">` +
        `<div id="root"></div><script type="module" src="./${entry}.js"></script></html>`,
    );
  }
  fs.cpSync(path.join(consumer, 'consumer.css'), path.join(publicDir, 'consumer.css'));
  await esbuild.build({
    absWorkingDir: consumer,
    entryPoints: ['Server.tsx'],
    outfile: path.join(consumer, 'server.cjs'),
    bundle: true,
    format: 'cjs',
    platform: 'node',
    packages: 'external',
    loader: { '.module.css': 'local-css' },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  });
  const { renderFixture } = require(path.join(consumer, 'server.cjs'));
  fs.writeFileSync(
    path.join(publicDir, 'hydrate.html'),
    '<!doctype html><html lang="en"><meta charset="utf-8"><title>Fluent source hydration</title>' +
      `<link rel="stylesheet" href="./Hydrate.css"><div id="root">${renderFixture()}</div>` +
      '<script type="module" src="./Hydrate.js"></script></html>',
  );
  console.log(`Public npm source consumer built: ${retained.size} retained modules; no Griffel/Tabster engines.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
