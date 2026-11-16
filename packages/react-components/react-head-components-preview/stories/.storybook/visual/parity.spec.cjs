'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');
const { PlayWrightExecutor } = require('storywright/lib/StoryWrightProcessor/PlayWrightExecutor');

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

async function openStory(page, story, implementation) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  const port = implementation === 'reference' ? 8100 : 8101;
  await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
  await expect(page.locator(`[data-visual-implementation="${implementation}"]`)).toBeVisible();
  await expect(page.locator('.sb-errordisplay')).toBeHidden();
  await page.locator('html').evaluate(root => root.ownerDocument.fonts.ready);
  await page.mouse.move(639, 479);
  return errors;
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
            referenceFrames.push({ name, selector });
            writeReference(testInfo, name, image);
          } else {
            expect({ name, selector }).toEqual(referenceFrames[frame - 1]);
            expect.soft(image, `${story.id}: ${label}`).toMatchSnapshot(name);
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

test('image screen tolerates tiny noise but detects a missing component', async ({ page }, testInfo) => {
  const story = stories.find(entry => entry.id === 'button-converged--default');
  assert(story, 'The visual control requires the upstream default Button story.');
  const errors = await openStory(page, story, 'reference');
  const name = 'screen-control.png';
  writeReference(testInfo, name, await page.screenshot(screenshotOptions));
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
  expect(await page.screenshot(screenshotOptions)).toMatchSnapshot(name);
  await page.locator('.fui-Button').evaluate(button => {
    button.style.visibility = 'hidden';
  });
  expect(await page.screenshot(screenshotOptions)).not.toMatchSnapshot(name);
  expect(errors).toEqual([]);
});
