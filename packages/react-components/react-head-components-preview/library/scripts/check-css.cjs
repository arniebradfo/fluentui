const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const ts = require('typescript');

async function main() {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'src');
  const files = fs.readdirSync(source, { recursive: true });
  const modules = files.filter(name => name.endsWith('.module.css'));
  const output = path.join(root, 'dist/css-maps.cjs');
  fs.mkdirSync(path.dirname(output), { recursive: true });

  await esbuild.build({
    stdin: {
      contents: modules
        .map((name, index) => `export { default as m${index} } from './${name.split(path.sep).join('/')}';`)
        .join('\n'),
      resolveDir: source,
    },
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outfile: output,
    loader: { '.module.css': 'local-css' },
    logLevel: 'warning',
  });
  const maps = require(output);
  const classMaps = new Map(modules.map((name, index) => [path.resolve(source, name), maps[`m${index}`]]));
  let checked = 0;

  for (const name of files.filter(file => /\.tsx?$/.test(file) && !file.includes('.test.'))) {
    const filePath = path.join(source, name);
    const file = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest, true);
    const imports = new Map();
    for (const statement of file.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        statement.moduleSpecifier.text.endsWith('.module.css') &&
        statement.importClause?.name
      ) {
        const css = path.resolve(path.dirname(filePath), statement.moduleSpecifier.text);
        assert(classMaps.has(css), `${name}: missing CSS Module ${css}`);
        imports.set(statement.importClause.name.text, css);
      }
    }

    function check(node) {
      let receiver;
      let key;
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
        receiver = node.expression.text;
        key = node.name.text;
      } else if (
        ts.isElementAccessExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.argumentExpression &&
        ts.isStringLiteral(node.argumentExpression)
      ) {
        receiver = node.expression.text;
        key = node.argumentExpression.text;
      }
      if (imports.has(receiver)) {
        const css = imports.get(receiver);
        assert(Object.hasOwn(classMaps.get(css), key), `${name}: ${css} does not export ${key}`);
        checked++;
      }
      ts.forEachChild(node, check);
    }
    check(file);
  }
  console.log(`Verified ${modules.length} real CSS Modules and ${checked} static class-map accesses.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
