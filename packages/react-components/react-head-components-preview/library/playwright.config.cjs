const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './scripts/browser',
  testMatch: '**/*.spec.cjs',
  outputDir: './dist/browser-results',
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:8098',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-consumer.cjs',
    url: 'http://127.0.0.1:8098',
    reuseExistingServer: true,
  },
});
