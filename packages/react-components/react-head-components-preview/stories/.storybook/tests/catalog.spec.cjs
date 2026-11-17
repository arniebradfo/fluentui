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

const readTabColors = tab =>
  tab.evaluate(root => {
    for (const animation of root.getAnimations({ subtree: true })) {
      animation.finish();
    }
    const content = root.querySelector('.fui-Tab__content');
    const icon = root.querySelector('.fui-Tab__icon');
    if (!content || !icon) {
      throw new Error('The tab color regression requires both content and icon slots.');
    }
    return {
      background: getComputedStyle(root).backgroundColor,
      content: getComputedStyle(content).color,
      icon: getComputedStyle(icon).color,
    };
  });

for (const variant of ['light', 'dark', 'right-to-left']) {
  for (const forcedColors of ['active', 'none']) {
    test(`matches selected tab hover colors: ${variant}, forced colors ${forcedColors}`, async ({ page }) => {
      await page.emulateMedia({ forcedColors });
      await page.goto(`/iframe.html?id=css-modules-visual-comparison--${variant}&viewMode=story`);
      for (const name of ['Selected tab', 'Disabled selected tab']) {
        const stock = page.getByTestId('stock').getByRole('tab', { name, exact: true });
        const candidate = page.getByTestId('candidate').getByRole('tab', { name, exact: true });
        await expect(candidate).toHaveAttribute('data-selected', '');
        await page.mouse.move(0, 0);
        const resting = await readTabColors(stock);
        expect(await readTabColors(candidate)).toEqual(resting);
        await stock.hover();
        const hovered = await readTabColors(stock);
        await candidate.hover();
        expect(await readTabColors(candidate)).toEqual(hovered);
        if (forcedColors === 'active' && name === 'Selected tab') {
          expect(hovered).not.toEqual(resting);
        } else if (name === 'Disabled selected tab') {
          expect(hovered).toEqual(resting);
        }
        await page.mouse.move(0, 0);
        expect(await readTabColors(candidate)).toEqual(resting);
      }
    });
  }
}

test('matches stock split-menu separators in multiline RTL groups', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=css-modules-native-overlays--split-separator-comparison&viewMode=story');
  for (const group of ['plain-split', 'multiline-split']) {
    const readSeparator = root => {
      const style = getComputedStyle(root);
      return {
        separatorHeight: getComputedStyle(root, '::before').height,
        direction: style.direction,
      };
    };
    const stock = page.getByTestId('stock-split').getByTestId(group).getByRole('menuitem').nth(1);
    const candidate = page.getByTestId('candidate-split').getByTestId(group).getByRole('menuitem').nth(1);
    await expect(candidate).toBeVisible();
    if (group === 'multiline-split') {
      await expect(page.getByTestId('stock-split').getByTestId(group).locator('.fui-MenuItem__subText')).toBeVisible();
      await expect(
        page.getByTestId('candidate-split').getByTestId(group).locator('.fui-MenuItem__subText'),
      ).toBeVisible();
    }
    const expected = await stock.evaluate(readSeparator);
    expect(expected.direction).toBe('rtl');
    expect(await candidate.evaluate(readSeparator), group).toEqual(expected);
  }
  expect(errors).toEqual([]);
});

test('matches stock NavDivider and bundled-icon selection', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=css-modules-navigation--stock-style-regressions&viewMode=story');
  const stock = page.getByTestId('stock-navigation');
  const candidate = page.getByTestId('candidate-navigation');
  await expect(candidate).toBeVisible();
  await expect(stock.locator('.fui-NavDivider')).toHaveCount(2);
  await expect(candidate.locator('.fui-NavDivider')).toHaveCount(2);
  const readDivider = roots =>
    roots.map(root => ({
      color: getComputedStyle(root).color,
      weight: getComputedStyle(root).fontWeight,
      before: getComputedStyle(root, '::before').borderTopColor,
      after: getComputedStyle(root, '::after').borderTopColor,
    }));
  expect(await candidate.locator('.fui-NavDivider').evaluateAll(readDivider)).toEqual(
    await stock.locator('.fui-NavDivider').evaluateAll(readDivider),
  );

  const readIcon = item =>
    item.evaluate(root => {
      const iconSlot = root.querySelector('.fui-NavItem__icon, .fui-NavCategoryItem__icon');
      if (!iconSlot) {
        throw new Error('The Nav icon regression requires an actual icon slot.');
      }
      for (const animation of iconSlot.getAnimations({ subtree: true })) {
        animation.finish();
      }
      return [...iconSlot.querySelectorAll('svg.fui-Icon-filled, svg.fui-Icon-regular')]
        .filter(icon => {
          const style = getComputedStyle(icon);
          return style.display !== 'none' && style.visibility === 'visible' && Number(style.opacity) > 0;
        })
        .map(icon => ({
          kind: icon.classList.contains('fui-Icon-filled') ? 'filled' : 'regular',
          color: getComputedStyle(icon).color,
        }));
    });
  const compareIcon = async (name, kind) => {
    const expected = await readIcon(stock.getByRole('button', { name, exact: true }));
    expect(expected).toHaveLength(1);
    expect(expected[0].kind).toBe(kind);
    expect(await readIcon(candidate.getByRole('button', { name, exact: true }))).toEqual(expected);
  };
  const clickBoth = async name => {
    await stock.getByRole('button', { name, exact: true }).click();
    await candidate.getByRole('button', { name, exact: true }).click();
  };

  await compareIcon('Icon target', 'regular');
  await compareIcon('Icon category', 'regular');
  await clickBoth('Icon target');
  await compareIcon('Icon target', 'filled');
  await clickBoth('Other item');
  await compareIcon('Icon target', 'regular');
  await clickBoth('Icon category');
  await compareIcon('Icon category', 'regular');
  await clickBoth('Nested item');
  await clickBoth('Icon category');
  await expect(candidate.getByRole('button', { name: 'Icon category', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await compareIcon('Icon category', 'filled');
  await clickBoth('Icon category');
  await compareIcon('Icon category', 'regular');
  await clickBoth('Icon category');
  await compareIcon('Icon category', 'filled');
  await clickBoth('Other item');
  await compareIcon('Icon category', 'regular');
  expect(errors).toEqual([]);
});

test('matches stock NavDrawer exposed edges and intrinsic footer controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=css-modules-navigation--stock-style-regressions&viewMode=story');
  const stock = page.getByTestId('stock-navigation');
  const candidate = page.getByTestId('candidate-navigation');
  await expect(candidate).toBeVisible();
  for (const fixture of ['body-only', 'header-body', 'body-footer']) {
    const expected = await stock
      .getByTestId(fixture)
      .locator('.fui-NavDrawerBody')
      .evaluateAll(readStyles, ['paddingTop', 'paddingBottom']);
    const actual = await candidate
      .getByTestId(fixture)
      .locator('.fui-NavDrawerBody')
      .evaluateAll(readStyles, ['paddingTop', 'paddingBottom']);
    expect(expected).toHaveLength(1);
    expect(actual, fixture).toEqual(expected);
  }
  const readFooter = root => {
    for (const animation of root.getAnimations({ subtree: true })) {
      animation.finish();
    }
    const footer = root.querySelector('.fui-NavDrawerFooter');
    const button = footer.querySelector('.fui-Button');
    const item = footer.querySelector('.fui-NavItem');
    const style = getComputedStyle(footer);
    return {
      alignItems: style.alignItems,
      buttonWidth: button.getBoundingClientRect().width,
      itemWidth: item.getBoundingClientRect().width,
      contentWidth: footer.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    };
  };
  const expected = await stock.getByTestId('body-footer').evaluate(readFooter);
  const actual = await candidate.getByTestId('body-footer').evaluate(readFooter);
  expect(actual.alignItems).toBe(expected.alignItems);
  expect(actual.buttonWidth).toBe(expected.buttonWidth);
  for (const footer of [expected, actual]) {
    expect(footer.buttonWidth).toBeLessThan(footer.contentWidth);
    expect(footer.itemWidth).toBe(footer.contentWidth);
  }
  expect(errors).toEqual([]);
});

test('matches stock Toaster offsets and native caller overrides', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=css-modules-visual-comparison--toast-position-offsets&viewMode=story');
  const allPositions = ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'];
  const stockStacks = page.locator('[data-testid="stock-toast-stack"][data-toaster-position]');
  const candidateStacks = page.locator('[data-testid="candidate-toast-stack"][data-toaster-position]');
  const readOffsets = (root, position) => {
    const style = getComputedStyle(root);
    const start = style.direction === 'rtl' ? 'right' : 'left';
    const end = style.direction === 'rtl' ? 'left' : 'right';
    const centered = position === 'top' || position === 'bottom';
    return {
      position: style.position,
      direction: style.direction,
      vertical: style[position.startsWith('top') ? 'top' : 'bottom'],
      horizontal: style[centered ? 'left' : position.endsWith('start') ? start : end],
      transform: centered ? style.transform : undefined,
    };
  };
  for (const direction of ['ltr', 'rtl']) {
    await page.getByRole('checkbox', { name: 'Right-to-left' }).setChecked(direction === 'rtl');
    for (const mode of ['default', 'zero', 'per-position', 'caller']) {
      await page.getByLabel('Toast offset configuration').selectOption(mode);
      const positions = mode === 'caller' ? ['top-start'] : allPositions;
      const expected = {};
      await page.getByRole('button', { name: 'Show stock toasts', exact: true }).click();
      await expect(stockStacks).toHaveCount(positions.length);
      for (const position of positions) {
        const stack = page.locator(`[data-testid="stock-toast-stack"][data-toaster-position="${position}"]`);
        await expect(stack).toBeVisible();
        expected[position] = await stack.evaluate(readOffsets, position);
        expect(expected[position].direction).toBe(direction);
      }
      await page.getByRole('button', { name: 'Dismiss stock toasts', exact: true }).click();
      await expect(stockStacks).toHaveCount(0);

      await page.getByRole('button', { name: 'Show candidate toasts', exact: true }).click();
      await expect(candidateStacks).toHaveCount(positions.length);
      for (const position of positions) {
        const stack = page.locator(`[data-testid="candidate-toast-stack"][data-toaster-position="${position}"]`);
        await expect(stack).toBeVisible();
        await expect(stack).toHaveAttribute('popover', 'manual');
        expect(await stack.evaluate(readOffsets, position), `${direction}: ${mode}: ${position}`).toEqual(
          expected[position],
        );
      }
      await page.getByRole('button', { name: 'Dismiss candidate toasts', exact: true }).click();
      await expect(candidateStacks).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});
