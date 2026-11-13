// @ts-check

const preset = require('../../../../jest.preset');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  displayName: 'react-head-components-preview',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        swcrc: false,
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'classic' } },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: {
    '\\.module\\.css$': '<rootDir>/config/css-modules.cjs',
    '\\.css$': '<rootDir>/config/style.cjs',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    ...preset.moduleNameMapper,
  },
  setupFilesAfterEnv: ['../../react-headless-components-preview/library/config/tests.cjs'],
  coverageDirectory: './coverage',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
