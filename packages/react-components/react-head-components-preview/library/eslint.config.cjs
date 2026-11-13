// @ts-check

const fluentPlugin = require('@fluentui/eslint-plugin');

module.exports = [
  ...fluentPlugin.configs['flat/react'],
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // These wrappers deliberately use CSS Modules rather than Griffel.
      '@griffel/styles-file': 'off',
    },
  },
];
