'use strict';

const path = require('node:path');
const { defineConfig } = require('@playwright/test');

const exactPixels = process.env.FLUENTUI_VISUAL_EXACT === '1';
const output = exactPixels ? 'visual-exact' : 'visual';

module.exports = defineConfig({
  testDir: './.storybook/visual',
  testMatch: '**/*.spec.cjs',
  outputDir: `./dist/${output}-results`,
  snapshotPathTemplate: path.join(__dirname, `dist/${output}-reference-images/{testName}/{arg}{ext}`),
  metadata: { exactPixels },
  updateSnapshots: 'none',
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 60000,
  reporter: [
    ['list'],
    ['html', { outputFolder: `./dist/${output}-report`, open: 'never' }],
    ['json', { outputFile: `./dist/${output}-results/report.json` }],
  ],
  expect: {
    toMatchSnapshot: exactPixels
      ? { threshold: 0, maxDiffPixels: 0, maxDiffPixelRatio: 0 }
      : { threshold: 0.2, maxDiffPixels: 50, maxDiffPixelRatio: 0.01 },
  },
  use: {
    browserName: 'chromium',
    viewport: { width: 640, height: 480 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: ['reference', 'candidate'].map(implementation => ({
    command: `node ../library/scripts/serve-consumer.cjs --visual-${implementation}`,
    url: `http://127.0.0.1:${implementation === 'reference' ? 8100 : 8101}/index.json`,
    reuseExistingServer: false,
  })),
});
