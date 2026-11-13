const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');

const index = JSON.parse(readFileSync(path.resolve(__dirname, '../../dist/storybook/index.json'), 'utf8'));
const stories = Object.values(index.entries).filter(entry => entry.type === 'story');
const readStyles = (nodes, keys) =>
  nodes.map(node => {
    const css = getComputedStyle(node);
    return Object.fromEntries(keys.map(key => [key, css[key]]));
  });

for (const story of stories) {
  test(`renders ${story.id}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') {
        const text = message.text();
        if (text.startsWith('Failed to load resource:')) {
          console.warn(`Demo asset unavailable in ${story.id}: ${text}`);
        } else {
          errors.push(text);
        }
      }
    });
    await page.goto(`/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
    await expect(page.locator('#storybook-root .fui-FluentProvider').first()).toBeVisible();
    await expect(page.locator('.sb-errordisplay')).toBeHidden();
    expect(errors).toEqual([]);
  });
}

for (const variant of ['light', 'dark', 'right-to-left']) {
  test(`matches representative stock visuals: ${variant}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=css-modules-visual-comparison--${variant}&viewMode=story`);
    const stock = page.getByTestId('stock');
    const candidate = page.getByTestId('candidate');
    await expect(candidate).toBeVisible();
    for (const [selector, properties] of [
      ['.fui-Button', ['backgroundColor', 'color', 'borderRadius', 'fontSize', 'fontWeight', 'padding']],
      ['.fui-Input', ['backgroundColor', 'borderBottomColor', 'borderRadius', 'fontSize', 'minHeight']],
      ['.fui-Checkbox__indicator', ['backgroundColor', 'borderColor', 'width', 'height']],
      ['.fui-Avatar', ['backgroundColor', 'color', 'borderRadius', 'width', 'height']],
    ]) {
      const expected = await stock.locator(selector).evaluateAll(readStyles, properties);
      const actual = await candidate.locator(selector).evaluateAll(readStyles, properties);
      expect(actual, `${variant}: ${selector}`).toEqual(expected);
    }
  });
}
