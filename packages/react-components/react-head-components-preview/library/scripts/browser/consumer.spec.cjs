const { test, expect } = require('@playwright/test');

for (const route of ['/', '/reverse.html']) {
  test(`real CSS defaults, overrides and disabled/open precedence: ${route}`, async ({ page }) => {
    await page.goto(route);
    const regular = page.getByTestId('default-button');
    await expect(regular).toHaveAttribute('data-shape', 'rounded');
    await expect(regular).toHaveCSS('border-radius', '4px');
    for (const id of ['disabled-closed', 'disabled-open']) {
      await expect(page.getByTestId(id)).toHaveCSS('background-color', 'rgb(240, 240, 240)');
      await expect(page.getByTestId(id)).toHaveCSS('color', 'rgb(189, 189, 189)');
    }
    await expect(page.getByTestId('override-button')).not.toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.getByTestId('avatar16')).toHaveText('A');
    await expect(page.getByTestId('dark')).toHaveAttribute('dir', 'rtl');
  });
}

test('native form values and mixed checkbox state survive styling', async ({ page }) => {
  await page.goto('/');
  const checkbox = page.getByRole('checkbox', { name: 'Mixed option', exact: true });
  expect(await checkbox.evaluate(node => node.indeterminate)).toBe(true);
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Grace');
  await checkbox.click();
  await page.getByRole('combobox', { name: 'Native select' }).selectOption('first');
  await page.getByRole('button', { name: 'Submit form' }).click();
  await expect(page.getByTestId('submitted')).toHaveText('Grace');
  await expect(checkbox).toBeChecked();
  await expect(page.getByRole('combobox', { name: 'Native select' })).toHaveValue('first');
});

test('native menus retain focusgroup navigation, callbacks and dismissal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open action menu', exact: true }).click();
  const item = page.getByRole('menuitem', { name: 'Run action' });
  await expect(item).toBeVisible();
  expect(await item.evaluate(node => node.closest('[popover]').matches(':popover-open'))).toBe(true);
  await page.keyboard.press('ArrowDown');
  await expect(item).toBeFocused();
  await item.click();
  await expect(page.getByTestId('selected')).toHaveText('Action selected');
  await expect(item).toBeHidden();
});

test('native popovers anchor to their trigger and close on Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open popover', exact: true });
  await trigger.click();
  const surface = page.getByText('Native popover content', { exact: true });
  await expect(surface).toBeVisible();
  expect(await surface.evaluate(node => node.matches(':popover-open'))).toBe(true);
  const anchor = await trigger.boundingBox();
  const box = await surface.boundingBox();
  expect(box.width).toBeGreaterThan(0);
  expect(Math.abs(box.y - anchor.y)).toBeLessThan(200);
  await page.keyboard.press('Escape');
  await expect(surface).toBeHidden();
});

test('native modal dialogs keep focus and restore it after dismissal', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Native dialog', exact: true });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(node => node.open && node.matches(':modal'))).toBe(true);
  await expect(page.getByRole('button', { name: 'Close dialog', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Nav categories expose styled selectable subitems', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('button', { name: 'Work', exact: true }).click();
  const subitem = nav.getByRole('button', { name: 'Projects', exact: true });
  await expect(subitem).toBeVisible();
  await subitem.click();
  await expect(subitem).toHaveAttribute('data-selected', '');
});

test('Field invalidity reaches DatePicker control styling', async ({ page }) => {
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Invalid date Select a date', exact: true });
  await expect(control).toHaveAttribute('aria-invalid', 'true');
  const colors = await control.evaluate(node => {
    const frame = node.closest('.fui-DatePicker');
    if (!frame) {
      throw new Error('DatePicker control has no styled frame.');
    }
    const probe = node.ownerDocument.createElement('span');
    probe.style.color = 'var(--colorPaletteRedBorder2)';
    frame.append(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: getComputedStyle(frame).borderBottomColor, expected };
  });
  expect(colors.actual).toBe(colors.expected);
});

test('native Tree selectors retain a visible keyboard focus indicator', async ({ page }) => {
  await page.goto('/');
  const selector = page.getByRole('checkbox', { name: 'Readme', exact: true });
  await selector.focus();
  await expect(selector).toBeFocused();
  const focus = await selector.evaluate(node => {
    const css = getComputedStyle(node);
    return { visible: node.matches(':focus-visible'), style: css.outlineStyle, width: parseFloat(css.outlineWidth) };
  });
  expect(focus.visible).toBe(true);
  expect(focus.style).not.toBe('none');
  expect(focus.width).toBeGreaterThan(0);
});

test('server-rendered source hydrates with real CSS and working events', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/hydrate.html');
  const button = page.getByRole('button', { name: 'Clicked 0', exact: true });
  await expect(button).toHaveCSS('border-radius', '4px');
  await button.click();
  await expect(page.getByRole('button', { name: 'Clicked 1', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Server name', exact: true })).toHaveValue('Ada');
  expect(errors).toEqual([]);
});
