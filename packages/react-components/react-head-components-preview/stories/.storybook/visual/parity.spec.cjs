'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');
const { PlayWrightExecutor } = require('storywright/lib/StoryWrightProcessor/PlayWrightExecutor');
const { compareExactPixels } = require('./exact-pixels.cjs');
const { PNG } = require('pngjs');

const readStories = implementation => {
  const index = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../../dist/visual-${implementation}/index.json`), 'utf8'),
  );
  return Object.values(index.entries).filter(entry => entry.type === 'story');
};
const stories = readStories('reference');
assert(stories.length > 0, 'Visual builds must contain stories.');
assert.deepEqual(
  stories.map(story => story.id).sort(),
  readStories('candidate')
    .map(story => story.id)
    .sort(),
  'Both implementations must expose exactly the same visual stories.',
);

const supportedSteps = new Set([
  'saveScreenshot',
  'cropScreenshot',
  'waitForElementPresent',
  'clickElement',
  'waitForElementNotPresent',
  'moveTo',
  'setElementText',
  'sendKeys',
  'executeScript',
  'clickAndHoldElement',
  'releaseElement',
  'pause',
]);
const screenshotOptions = { animations: 'disabled', caret: 'hide' };

async function openStory(page, story, implementation, args = '') {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  const port = implementation === 'reference' ? 8100 : 8101;
  const storyArgs = args ? `&args=${encodeURIComponent(args)}` : '';
  await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story${storyArgs}`);
  await expect(page.locator(`[data-visual-implementation="${implementation}"]`)).toBeVisible();
  await expect(page.locator('.sb-errordisplay')).toBeHidden();
  await page.locator('html').evaluate(root => root.ownerDocument.fonts.ready);
  await page.mouse.move(639, 479);
  return errors;
}

async function finishAnimations(locator) {
  await locator.evaluate(root => {
    for (const animation of root.getAnimations({ subtree: true })) {
      animation.finish();
    }
  });
}

async function readSteps(page, story) {
  const steps = await page.locator('html').evaluate(async (root, id) => {
    const extracted = await root.ownerDocument.defaultView.__STORYBOOK_PREVIEW__.extract();
    return extracted[id].parameters.storyWright?.steps;
  }, story.id);
  assert(Array.isArray(steps) && steps.length > 0, `${story.id}: missing upstream StoryWright steps.`);
  for (const step of steps) {
    assert(supportedSteps.has(step.type), `${story.id}: unsupported StoryWright step ${step.type}.`);
  }
  return steps;
}

function writeReference(testInfo, name, image) {
  assert.equal(testInfo.config.updateSnapshots, 'none', 'Never update visual references from candidate screenshots.');
  const file = testInfo.snapshotPath(name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, image);
}

for (const story of stories) {
  test(`${story.title}: ${story.name}`, async ({ context }, testInfo) => {
    const referenceFrames = [];
    let referenceSteps;
    for (const implementation of ['reference', 'candidate']) {
      const page = await context.newPage();
      try {
        const errors = await openStory(page, story, implementation);
        const steps = await readSteps(page, story);
        if (implementation === 'reference') {
          referenceSteps = steps;
        } else {
          expect(steps).toEqual(referenceSteps);
        }
        let frame = 0;
        const capture = async (label = 'initial', selector) => {
          const name = `${frame++}-${label.replace(/[^a-zA-Z0-9._-]/g, '-')}.png`;
          const image = selector
            ? await page.locator(selector).screenshot(screenshotOptions)
            : await page.screenshot(screenshotOptions);
          await testInfo.attach(`${implementation}: ${label}`, { body: image, contentType: 'image/png' });
          if (implementation === 'reference') {
            referenceFrames.push({ name, selector, image });
            writeReference(testInfo, name, image);
          } else {
            const reference = referenceFrames[frame - 1];
            expect({ name, selector }).toEqual({ name: reference.name, selector: reference.selector });
            if (testInfo.config.metadata.exactPixels) {
              const { diff, ...comparison } = compareExactPixels(reference.image, image);
              testInfo.annotations.push({
                type: 'exact pixels',
                description: `${name}: ${JSON.stringify(comparison)}`,
              });
              if (diff) {
                await testInfo.attach(`exact diff: ${label}`, { body: diff, contentType: 'image/png' });
              }
              expect.soft(comparison, `${story.id}: ${label}`).toEqual({
                differentPixels: 0,
                expectedSize: comparison.expectedSize,
                actualSize: comparison.expectedSize,
              });
            } else {
              expect.soft(image, `${story.id}: ${label}`).toMatchSnapshot(name);
            }
          }
        };
        // Reuse StoryWright's interaction executor; only route its captures into Playwright's image reports.
        const executor = new PlayWrightExecutor(page, story.id, 'chromium', {}, { ...story, steps });
        executor.makeScreenshot = label => capture(label);
        executor.elementScreenshot = (selector, label) => capture(label, selector);
        await executor.processStory();
        expect(errors, `${implementation} browser errors`).toEqual([]);
        if (implementation === 'candidate') {
          expect(frame).toBe(referenceFrames.length);
        }
      } finally {
        await page.close();
      }
    }
  });
}

test('comparison control checks one-pixel noise and a missing component', async ({ page }, testInfo) => {
  const story = stories.find(entry => entry.id === 'button-converged--default');
  assert(story, 'The visual control requires the upstream default Button story.');
  const errors = await openStory(page, story, 'reference');
  const name = 'screen-control.png';
  const reference = await page.screenshot(screenshotOptions);
  writeReference(testInfo, name, reference);
  expect(compareExactPixels(reference, reference).differentPixels).toBe(0);
  await page.locator('[data-visual-implementation]').evaluate(root => {
    const marker = root.ownerDocument.createElement('span');
    Object.assign(marker.style, {
      position: 'fixed',
      bottom: '0',
      right: '0',
      width: '1px',
      height: '1px',
      backgroundColor: 'var(--colorNeutralForeground1)',
    });
    root.append(marker);
  });
  const tinyChange = await page.screenshot(screenshotOptions);
  expect(compareExactPixels(reference, tinyChange).differentPixels).toBe(1);
  if (!testInfo.config.metadata.exactPixels) {
    expect(tinyChange).toMatchSnapshot(name);
  }
  await page.locator('.fui-Button').evaluate(button => {
    button.style.visibility = 'hidden';
  });
  const missingComponent = await page.screenshot(screenshotOptions);
  expect(compareExactPixels(reference, missingComponent).differentPixels).toBeGreaterThan(1);
  if (!testInfo.config.metadata.exactPixels) {
    expect(missingComponent).not.toMatchSnapshot(name);
  }
  expect(errors).toEqual([]);
});

test('exact comparison counts tiny color, alpha and dimension differences', () => {
  const image = (width, color) => {
    const png = new PNG({ width, height: 1 });
    for (let x = 0; x < width; x++) {
      png.data.set(color, x * 4);
    }
    return PNG.sync.write(png);
  };
  const original = image(1, [200, 200, 200, 255]);
  expect(compareExactPixels(original, image(1, [201, 200, 200, 255])).differentPixels).toBe(1);
  expect(compareExactPixels(original, image(1, [200, 200, 200, 254])).differentPixels).toBe(1);
  expect(compareExactPixels(original, image(2, [200, 200, 200, 255])).differentPixels).toBe(1);
});

test('icon colors and bundled variants match v9 without a pixel tolerance', async ({ context }, testInfo) => {
  const observations = {};
  for (const implementation of ['reference', 'candidate']) {
    observations[implementation] = [];
    for (const variant of ['subtle', 'transparent', 'disabled', 'high-contrast']) {
      const story = stories.find(entry => entry.id === `css-modules-shared-icon-states--${variant}`);
      assert(story, `Missing icon state fixture: ${variant}`);
      const page = await context.newPage();
      try {
        const errors = await openStory(page, story, implementation);
        const groups = page.locator('[data-icon-case]');
        const read = async group => {
          await finishAnimations(group);
          return group.locator('svg[data-visual-bundle]').evaluateAll(icons =>
            icons.map(icon => ({
              kind: icon.classList.contains('fui-Icon-filled') ? 'filled' : 'regular',
              visible: icon.ownerDocument.defaultView.getComputedStyle(icon).display !== 'none',
              color: icon.ownerDocument.defaultView.getComputedStyle(icon).color,
            })),
          );
        };
        for (const group of await groups.all()) {
          const name = await group.getAttribute('data-icon-case');
          const initial = await read(group);
          expect(initial).toHaveLength(2);
          await page.locator(`#icon-${name}`).hover();
          const hover = await read(group);
          observations[implementation].push({ variant, name, initial, hover });
        }
        expect(errors).toEqual([]);
      } finally {
        await page.close();
      }
    }
  }
  await testInfo.attach('icon states', {
    body: Buffer.from(JSON.stringify(observations, null, 2)),
    contentType: 'application/json',
  });
  expect(observations.candidate).toEqual(observations.reference);
  const button = observations.candidate.find(entry => entry.variant === 'subtle' && entry.name === 'button');
  expect(button.hover.find(icon => icon.visible).color).not.toBe(button.initial.find(icon => icon.visible).color);
});

test('expanded primary disabled MenuButton matches the stock selected-state precedence', async ({
  context,
}, testInfo) => {
  const story = stories.find(entry => entry.id === 'css-modules-shared-icon-states--disabled');
  assert(story, 'Missing disabled icon fixture.');
  const observations = {};
  for (const implementation of ['reference', 'candidate']) {
    const page = await context.newPage();
    try {
      const errors = await openStory(page, story, implementation, 'appearance:primary');
      await expect(page.locator('[data-visual-appearance="primary"]')).toBeVisible();
      observations[implementation] = {};
      for (const [state, id] of [
        ['closed', 'icon-menu'],
        ['expanded', 'icon-expanded'],
      ]) {
        const button = page.locator(`#${id}`);
        await expect(button).toBeDisabled();
        await finishAnimations(button);
        observations[implementation][state] = await button.evaluate(node => {
          const css = node.ownerDocument.defaultView.getComputedStyle(node);
          return { background: css.backgroundColor, color: css.color };
        });
      }
      expect(errors).toEqual([]);
    } finally {
      await page.close();
    }
  }
  await testInfo.attach('expanded disabled precedence', {
    body: Buffer.from(JSON.stringify(observations, null, 2)),
    contentType: 'application/json',
  });
  expect(observations.candidate).toEqual(observations.reference);
  expect(observations.reference.expanded.background).not.toBe(observations.reference.closed.background);
});

for (const implementation of ['reference', 'candidate']) {
  test(`${implementation} Menu preserves keyboard focus with its own visibility policy`, async ({ page }, testInfo) => {
    const story = stories.find(entry => entry.id === 'menu-converged-basic--default');
    assert(story, 'Missing upstream Menu fixture.');
    const errors = await openStory(page, story, implementation);
    const first = page.getByRole('menuitem', { name: 'Cut', exact: true });
    await expect(first).toBeFocused();
    const initial = await first.evaluate(item => ({
      nativeFocusVisible: item.matches(':focus-visible'),
      fluentFocusVisible: item.hasAttribute('data-fui-focus-visible'),
      indicator: item.ownerDocument.defaultView.getComputedStyle(item, '::after').content,
    }));
    await testInfo.attach('initial focus policy', {
      body: Buffer.from(JSON.stringify(initial)),
      contentType: 'application/json',
    });
    expect(initial.indicator !== 'none').toBe(
      implementation === 'candidate' ? initial.nativeFocusVisible : initial.fluentFocusVisible,
    );
    await page.keyboard.press('ArrowDown');
    const next = page.getByRole('menuitem', { name: 'Edit', exact: true });
    await expect(next).toBeFocused();
    await expect
      .poll(() => next.evaluate(item => item.ownerDocument.defaultView.getComputedStyle(item, '::after').content))
      .not.toBe('none');
    expect(errors).toEqual([]);
  });
}
