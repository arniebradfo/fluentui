const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const mainPath = path.join(__dirname, 'main.js');
const configText = fs.readFileSync(mainPath, 'utf8');
const configured = new Set(
  [...configText.matchAll(/'(react-[^']+\.stories\.tsx)'/g)].map(match => path.resolve(root, '../..', match[1])),
);
const readSource = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);

const facadeRuntime = new Set();
for (const node of readSource(path.join(root, 'src/reuse.ts')).statements) {
  if (ts.isExportDeclaration(node) && !node.isTypeOnly) {
    assert(
      node.exportClause && ts.isNamedExports(node.exportClause),
      'The test facade must use explicit named exports, not a fallback barrel',
    );
    assert(
      ['../../library/src', '@griffel/react', '@fluentui/react-utilities'].includes(node.moduleSpecifier?.text),
      'The test facade must use styled candidate components or approved demo helpers',
    );
  }
  if (ts.isExportDeclaration(node) && !node.isTypeOnly && node.exportClause && ts.isNamedExports(node.exportClause)) {
    for (const item of node.exportClause.elements) {
      if (!item.isTypeOnly) {
        facadeRuntime.add(item.name.text);
      }
    }
  }
}

const imported = new Set();
let scenarioCount = 0;
for (const name of fs.readdirSync(path.join(root, 'src')).filter(name => name.endsWith('.stories.tsx'))) {
  const file = path.join(root, 'src', name);
  for (const node of readSource(file).statements) {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      scenarioCount += node.declarationList.declarations.length;
    }
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text.endsWith('.stories')) {
      imported.add(path.resolve(path.dirname(file), node.moduleSpecifier.text + '.tsx'));
    }
  }
}
assert.deepEqual(
  [...configured].sort(),
  [...imported].sort(),
  'Allowlist must match the imported stock stories exactly',
);

for (const file of imported) {
  for (const node of readSource(file).statements) {
    if (
      ts.isImportDeclaration(node) &&
      !node.importClause?.isTypeOnly &&
      node.moduleSpecifier.text.startsWith('@fluentui/react-')
    ) {
      assert(
        ['@fluentui/react-components', '@fluentui/react-icons'].includes(node.moduleSpecifier.text),
        `${file}: review direct stock-package imports before reuse`,
      );
    }
    if (
      !ts.isImportDeclaration(node) ||
      node.moduleSpecifier.text !== '@fluentui/react-components' ||
      node.importClause?.isTypeOnly
    ) {
      continue;
    }
    const bindings = node.importClause?.namedBindings;
    assert(bindings && ts.isNamedImports(bindings), 'Reused stories must use explicit named imports');
    for (const item of bindings.elements) {
      if (!item.isTypeOnly) {
        assert(
          facadeRuntime.has((item.propertyName ?? item.name).text),
          `${file}: facade is missing ${item.name.text}`,
        );
      }
    }
  }
}

// Keep this check independent of the shared SWC/CSS loader setup and a full Storybook build.
const sandbox = {
  __dirname,
  module: { exports: {} },
  require(request) {
    if (request === '../../../../../.storybook/main') {
      return { addons: [], webpackFinal: config => config };
    }
    if (request.endsWith('/css-modules-webpack')) {
      return { registerCssModuleRules() {} };
    }
    return require(request);
  },
};
vm.runInNewContext(configText, sandbox, { filename: mainPath });
const plugin = sandbox.module.exports.webpackFinal({ plugins: [] }, {}).plugins[0];
assert(plugin.resourceRegExp.test('@fluentui/react-components'));
assert(!plugin.resourceRegExp.test('@fluentui/react-components/other'));

for (const issuer of imported) {
  const resource = { request: '@fluentui/react-components', contextInfo: { issuer } };
  plugin.newResource(resource);
  assert.equal(resource.request, path.join(root, 'src/reuse.ts'));
}
assert.throws(
  () =>
    plugin.newResource({
      request: '@fluentui/react-components',
      contextInfo: {
        issuer: path.resolve(root, '../../react-button/stories/src/Unreviewed.stories.tsx'),
      },
    }),
  /reviewed and allowlisted/,
);
for (const issuer of [
  path.join(root, 'src/VisualParity.stories.tsx'),
  path.resolve(root, '../library/src/components/Button/Button.tsx'),
]) {
  const resource = { request: '@fluentui/react-components', contextInfo: { issuer } };
  plugin.newResource(resource);
  assert.equal(resource.request, '@fluentui/react-components');
}
console.log(
  `Verified ${imported.size} stock-story mappings and their facade imports; ${scenarioCount} scenarios. Unreviewed stock stories fail closed; comparison and runtime imports stay untouched.`,
);

const visualDir = path.join(__dirname, 'visual');
const loadVisualConfig = implementation => {
  const context = {
    __dirname: visualDir,
    module: { exports: {} },
    process: { env: { STORYBOOK_HEAD_IMPLEMENTATION: implementation } },
    require(request) {
      return request === '../main' ? { webpackFinal: config => config } : require(request);
    },
  };
  vm.runInNewContext(fs.readFileSync(path.join(visualDir, 'main.js'), 'utf8'), context);
  return context.module.exports;
};
assert.throws(() => loadVisualConfig('unknown'), /build-visual-reference/);
const referenceConfig = loadVisualConfig('reference');
const candidateConfig = loadVisualConfig('candidate');
assert.deepEqual([...referenceConfig.stories], [...candidateConfig.stories]);
for (const file of candidateConfig.stories) {
  assert(fs.existsSync(file), `Missing upstream visual story: ${file}`);
}
for (const [implementation, config] of [
  ['reference', referenceConfig],
  ['candidate', candidateConfig],
]) {
  const replacement = config
    .webpackFinal({ plugins: [] }, {})
    .plugins.find(item => item instanceof require('webpack').NormalModuleReplacementPlugin);
  const issuer = config.stories.find(file => file.endsWith('/Button/Button.stories.tsx'));
  const resource = { request: '@fluentui/react-button', contextInfo: { issuer } };
  replacement.newResource(resource);
  assert.equal(
    resource.request,
    implementation === 'reference' ? '@fluentui/react-button' : path.resolve(root, '../library/src/button.ts'),
  );
  assert.throws(
    () => replacement.newResource({ request: '@fluentui/react-spinner', contextInfo: { issuer } }),
    /unmapped Fluent import/,
  );
  assert.throws(
    () =>
      replacement.newResource({
        request: '@fluentui/react-button',
        contextInfo: { issuer: path.join(path.dirname(issuer), 'UnreviewedHelper.tsx') },
      }),
    /unapproved helper import/,
  );
  const runtime = {
    request: '@fluentui/react-button',
    contextInfo: { issuer: path.resolve(root, '../../react-headless-components-preview/library/src/button.ts') },
  };
  replacement.newResource(runtime);
  assert.equal(runtime.request, '@fluentui/react-button');
}
console.log(
  `Verified ${candidateConfig.stories.length} paired visual source modules; reference imports, candidate redirection and runtime isolation.`,
);
