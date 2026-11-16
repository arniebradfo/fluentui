const path = require('node:path');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const catalogMain = require('../main');

const implementation = process.env.STORYBOOK_HEAD_IMPLEMENTATION;
if (!['reference', 'candidate'].includes(implementation)) {
  throw new Error('Build visual stories through the build-visual-reference or build-visual-candidate Nx target.');
}

const vrtRoot = path.resolve(__dirname, '../../../../../../apps/vr-tests-react-components');
const stories = [
  'Button/Button.stories.tsx',
  'Checkbox/Checkbox.stories.tsx',
  'Input/InputInteractions.stories.tsx',
  'Menu/Menu.stories.tsx',
].map(file => path.join(vrtRoot, 'src/stories', file));
const importers = new Set([
  ...stories,
  path.join(vrtRoot, 'src/utilities/getStoryVariant.tsx'),
  path.join(__dirname, 'preview.tsx'),
]);
const replacements = new Map(
  [
    ['button', 'button.ts'],
    ['checkbox', 'checkbox.ts'],
    ['input', 'input.ts'],
    ['menu', 'menu.ts'],
  ].map(([name, entry]) => [`@fluentui/react-${name}`, path.resolve(__dirname, '../../../library/src', entry)]),
);
replacements.set('@fluentui/react-provider', path.join(__dirname, 'provider.tsx'));
const foundations = new Set(['@fluentui/react-icons', '@fluentui/react-theme', '@fluentui/react-utilities']);

module.exports = {
  ...catalogMain,
  stories,
  typescript: { reactDocgen: false },
  webpackFinal(config, options) {
    const result = catalogMain.webpackFinal(config, options);
    result.plugins.push(
      new DefinePlugin({ __HEAD_VISUAL_IMPLEMENTATION__: JSON.stringify(implementation) }),
      new NormalModuleReplacementPlugin(/^@fluentui\/react-/, resource => {
        const issuer = resource.contextInfo.issuer;
        if (!importers.has(issuer)) {
          if (issuer?.startsWith(path.join(vrtRoot, 'src') + path.sep) && !foundations.has(resource.request)) {
            throw new Error(`Review the visual story's unapproved helper import: ${issuer} -> ${resource.request}`);
          }
          return;
        }
        const replacement = replacements.get(resource.request);
        if (!replacement && !foundations.has(resource.request)) {
          throw new Error(`Review the visual story's unmapped Fluent import: ${resource.request}`);
        }
        if (implementation === 'candidate' && replacement) {
          resource.request = replacement;
        }
      }),
    );
    return result;
  },
};
