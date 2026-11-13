const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './.storybook/tests',
  testMatch: '**/*.spec.cjs',
  outputDir: './dist/browser-results',
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:8099',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node ../library/scripts/serve-consumer.cjs --storybook',
    url: 'http://127.0.0.1:8099',
    reuseExistingServer: true,
  },
});
