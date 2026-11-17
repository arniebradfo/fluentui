const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 1280, height: 900 } });

const browserErrors = new WeakMap();
test.beforeEach(({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
});
test.afterEach(async ({ page }) => {
  await expect(page.locator('.sb-errordisplay')).toBeHidden();
  expect(browserErrors.get(page), 'browser runtime errors').toEqual([]);
});

async function settle(page) {
  await page.locator('#storybook-root').evaluate(async root => {
    await root.ownerDocument.fonts.ready;
    for (const animation of root.getAnimations({ subtree: true })) {
      if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) {
        animation.finish();
      }
    }
    await new Promise(resolve => root.ownerDocument.defaultView.requestAnimationFrame(resolve));
  });
}

async function openStory(page, id, ready, media = {}) {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'none', colorScheme: 'light', ...media });
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.getByTestId(ready)).toBeVisible();
  await settle(page);
  await page.mouse.move(0, 0);
}

const readStyles = (locator, properties) =>
  locator.evaluate((node, names) => {
    const style = node.ownerDocument.defaultView.getComputedStyle(node);
    return Object.fromEntries(names.map(name => [name, style[name]]));
  }, properties);

async function hoverAndPress(page, target, read) {
  await target.hover();
  const hover = await read();
  await page.mouse.down();
  try {
    return { hover, active: await read() };
  } finally {
    // Drag out before release so navigation/selection does not change the fixture.
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
}

test('outlined pickers match stock focus, hover and active precedence', async ({ page }) => {
  await openStory(page, 'css-modules-forms-and-pickers--picker-state-comparison', 'candidate-pickers');
  const properties = ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'];
  for (const [fixture, selector] of [
    ['outline-combobox', '.fui-Combobox'],
    ['outline-dropdown', '.fui-Dropdown'],
  ]) {
    const observations = {};
    for (const implementation of ['stock', 'candidate']) {
      const wrapper = page.getByTestId(`${implementation}-pickers`).getByTestId(fixture);
      const root = wrapper.locator(selector);
      const control = wrapper.getByRole('combobox');
      await control.focus();
      await expect(control).toBeFocused();
      const focus = await readStyles(root, properties);
      const pointer = await hoverAndPress(page, root, async () => {
        expect(await root.evaluate(node => node.matches(':focus-within'))).toBe(true);
        return readStyles(root, properties);
      });
      observations[implementation] = { focus, ...pointer };
    }
    expect(observations.stock.hover, `${fixture}: stock hover must distinguish the focus border`).not.toEqual(
      observations.stock.focus,
    );
    expect(observations.stock.active).toEqual(observations.stock.focus);
    expect(observations.candidate, fixture).toEqual(observations.stock);
  }
});

test('DatePicker button gap matches stock size with medium and editable controls', async ({ page }) => {
  await openStory(page, 'css-modules-calendar-and-date-picker--date-picker-gap-comparison', 'candidate-date-gaps');
  const gaps = {};
  for (const fixture of ['medium-button', 'large-button', 'large-editable']) {
    const stock = page.getByTestId('stock-date-gaps').getByTestId(fixture).locator('.fui-DatePicker');
    const candidate = page.getByTestId('candidate-date-gaps').getByTestId(fixture);
    const editable = fixture === 'large-editable';
    const row = candidate.locator(editable ? '.fui-DatePicker' : '.fui-DatePicker__trigger');
    const expected = await readStyles(stock, ['columnGap']);
    expect(await readStyles(row, ['columnGap']), fixture).toEqual(expected);
    const measured = await row.evaluate((node, isEditable) => {
      const content = node.querySelector(isEditable ? '.fui-DatePicker__input' : '.fui-DatePicker__displayValue');
      const icon = node.querySelector('.fui-DatePicker__icon');
      if (!content || !icon) {
        throw new Error('DatePicker gap fixture requires both content and icon.');
      }
      const contentBox = content.getBoundingClientRect();
      const iconBox = icon.getBoundingClientRect();
      return node.ownerDocument.defaultView.getComputedStyle(node).direction === 'rtl'
        ? contentBox.left - iconBox.right
        : iconBox.left - contentBox.right;
    }, editable);
    gaps[fixture] = Number.parseFloat(expected.columnGap);
    expect(measured, `${fixture}: actual content/icon separation`).toBe(gaps[fixture]);
  }
  expect(gaps['large-button']).toBeGreaterThan(gaps['medium-button']);
  expect(gaps['large-editable']).toBe(gaps['large-button']);
});

const calendarCell = (root, date) => root.locator(`tr:not([aria-hidden="true"]) > td[data-calendar-date="${date}"]`);
const cellProperties = ['backgroundColor', 'color'];

test('Calendar day, navigation and restricted-range states match stock', async ({ page }) => {
  await openStory(page, 'css-modules-calendar-and-date-picker--calendar-state-comparison', 'candidate-calendar-states');
  const roots = {
    stock: page.getByTestId('stock-calendar-states'),
    candidate: page.getByTestId('candidate-calendar-states'),
  };
  const day = {};
  const navigation = {};
  for (const implementation of ['stock', 'candidate']) {
    const root = roots[implementation];
    const cell = calendarCell(root, '2026-08-07');
    day[implementation] = await hoverAndPress(page, cell.locator('button'), () => readStyles(cell, cellProperties));
    const previous = root
      .locator(implementation === 'stock' ? '.fui-CalendarDay__monthComponents' : '.fui-CalendarDay__navigation')
      .locator('button')
      .first();
    navigation[implementation] = await hoverAndPress(page, previous, () =>
      readStyles(previous, ['backgroundColor', 'color', 'outlineColor', 'outlineStyle', 'outlineWidth']),
    );
  }
  expect(day.candidate).toEqual(day.stock);
  expect(day.stock.active.backgroundColor).not.toBe(day.stock.hover.backgroundColor);
  expect(navigation.candidate).toEqual(navigation.stock);
  expect(navigation.stock.active.color).not.toBe(navigation.stock.hover.color);

  await page.getByRole('checkbox', { name: 'Select a week' }).check();
  await expect(roots.candidate.locator('table')).toHaveAttribute('aria-multiselectable', 'true');
  await settle(page);
  const ranges = {};
  for (const implementation of ['stock', 'candidate']) {
    const root = roots[implementation];
    const readRange = async () => {
      const values = {};
      for (const date of ['2026-07-28', '2026-07-29', '2026-07-26', '2026-08-14']) {
        values[date] = await readStyles(calendarCell(root, date), cellProperties);
      }
      return values;
    };
    ranges[implementation] = await hoverAndPress(page, calendarCell(root, '2026-07-27').locator('button'), readRange);
  }
  expect(ranges.candidate).toEqual(ranges.stock);
  expect(ranges.stock.hover['2026-07-28'].backgroundColor).not.toBe(ranges.stock.hover['2026-07-29'].backgroundColor);
  expect(ranges.candidate.active['2026-08-14']).toEqual(ranges.candidate.hover['2026-08-14']);
});

test('Calendar forced-colors markers, borders and month states match stock', async ({ page }) => {
  await openStory(
    page,
    'css-modules-calendar-and-date-picker--calendar-state-comparison',
    'candidate-calendar-states',
    { forcedColors: 'active', colorScheme: 'dark' },
  );
  expect(
    await page
      .locator('html')
      .evaluate(root => root.ownerDocument.defaultView.matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
  const observations = {};
  for (const implementation of ['stock', 'candidate']) {
    const root = page.getByTestId(`${implementation}-calendar-states`);
    const ordinary = calendarCell(root, '2026-08-07');
    const today = calendarCell(root, '2026-08-12');
    const selected = calendarCell(root, '2026-08-14');
    const marker = ordinary.locator('button > [aria-hidden="true"]');
    const todayLabel = today.locator('button > span').first();
    const circle = await today.evaluate((cell, candidate) => {
      const button = cell.querySelector('button');
      const node = candidate ? button : button.querySelector('span');
      const style = cell.ownerDocument.defaultView.getComputedStyle(node, candidate ? '::before' : null);
      return {
        backgroundColor: style.backgroundColor,
        forcedColorAdjust: style.forcedColorAdjust,
        width: style.width,
        height: style.height,
      };
    }, implementation === 'candidate');
    const monthRoot = root.locator(implementation === 'stock' ? '.fui-CalendarPicker' : '.fui-CalendarMonth');
    const monthButton = name => {
      const cell = monthRoot.getByRole('gridcell', { name, exact: true });
      return implementation === 'stock' ? cell : cell.locator('button');
    };
    const monthProperties = ['backgroundColor', 'color', 'forcedColorAdjust'];
    const july = monthButton('July');
    expect(await monthButton('September').evaluate(node => node.disabled)).toBe(true);
    observations[implementation] = {
      marker: await readStyles(marker, ['backgroundColor', 'forcedColorAdjust', 'width', 'height']),
      circle,
      todayLabel: await readStyles(todayLabel, ['color', 'forcedColorAdjust']),
      selectedBorder: await readStyles(selected.locator('button'), ['borderTopColor', 'borderTopStyle']),
      outsideMonth: await readStyles(calendarCell(root, '2026-07-28'), ['color']),
      selectedMonth: await readStyles(monthButton('August'), monthProperties),
      disabledMonth: await readStyles(monthButton('September'), ['color', 'forcedColorAdjust']),
      monthPointer: await hoverAndPress(page, july, () =>
        readStyles(july, [...monthProperties, 'outlineColor', 'outlineStyle', 'outlineWidth']),
      ),
    };
  }
  expect(observations.candidate).toEqual(observations.stock);

  await page.getByRole('checkbox', { name: 'Allow unavailable date focus' }).check();
  await settle(page);
  const focusableDisabled = {};
  for (const implementation of ['stock', 'candidate']) {
    const root = page.getByTestId(`${implementation}-calendar-states`);
    const month = root.locator(implementation === 'stock' ? '.fui-CalendarPicker' : '.fui-CalendarMonth');
    const cell = month.getByRole('gridcell', { name: 'September', exact: true });
    const button = implementation === 'stock' ? cell : cell.locator('button');
    if (implementation === 'candidate') {
      await expect(cell).toHaveAttribute('aria-disabled', 'true');
    } else {
      // Stock CalendarMonth marks unavailable cells with CSS, not aria-disabled.
      await expect(cell).not.toHaveAttribute('aria-disabled');
    }
    expect(await button.evaluate(node => node.disabled)).toBe(false);
    await cell.focus();
    await expect(cell).toBeFocused();
    focusableDisabled[implementation] = await readStyles(button, ['color', 'forcedColorAdjust']);
  }
  expect(focusableDisabled.candidate).toEqual(focusableDisabled.stock);
  expect(focusableDisabled.stock.color).not.toBe(observations.stock.disabledMonth.color);
});

test('Calendar header, day rows and Today placement match stock', async ({ page }) => {
  await openStory(
    page,
    'css-modules-calendar-and-date-picker--calendar-geometry-comparison',
    'candidate-calendar-geometry',
  );
  const stock = page.getByTestId('stock-calendar-geometry');
  const candidate = page.getByTestId('candidate-calendar-geometry');
  const readGeometry = provider =>
    provider.evaluate(panel => {
      const calendar = panel.querySelector('.fui-Calendar');
      const origin = calendar.getBoundingClientRect();
      const box = node => {
        if (!node) {
          return null;
        }
        const rect = node.getBoundingClientRect();
        return { y: rect.y - origin.y, height: rect.height };
      };
      const weekday = calendar.querySelector('th[scope="col"]');
      const firstWeek = [...calendar.querySelectorAll('tr:not([aria-hidden="true"])')].find(row =>
        row.querySelector('td[role="gridcell"]'),
      );
      return {
        height: origin.height,
        dayPanel: box(calendar.querySelector('.fui-CalendarDay')),
        weekdayHeader: box(weekday?.closest('tr')),
        firstWeek: box(firstWeek),
        footer: box(calendar.querySelector('.fui-Calendar__goTodayButton, .fui-Calendar__goToTodayButton')),
      };
    });
  const compare = async fixture => {
    await settle(page);
    expect(await readGeometry(candidate), fixture).toEqual(await readGeometry(stock));
  };
  for (const fixture of ['five-week-side-by-side', 'six-week-side-by-side', 'five-week-overlay', 'six-week-overlay']) {
    await page.getByLabel('Calendar geometry case').selectOption(fixture);
    await compare(fixture);
    if (fixture.endsWith('overlay')) {
      await stock.locator('.fui-CalendarDay__monthAndYear').click();
      await candidate.locator('.fui-CalendarDay__heading').click();
      await expect(candidate.locator('.fui-CalendarMonth')).toBeVisible();
      await compare(`${fixture}: month`);
    }
  }
});
