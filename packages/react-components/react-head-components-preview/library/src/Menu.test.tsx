import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import { ChevronLeftRegular } from '@fluentui/react-icons/headless/svg/chevron-left';
import { ChevronRightRegular } from '@fluentui/react-icons/headless/svg/chevron-right';
import { CheckmarkFilled } from '@fluentui/react-icons/headless/fonts/checkmark';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';
import { MenuPopover } from './MenuPopover';
import { MenuList } from './MenuList';
import { MenuItem, type MenuItemSlots } from './MenuItem';
import { MenuItemCheckbox } from './MenuItemCheckbox';
import { MenuItemRadio } from './MenuItemRadio';
import { MenuItemSwitch } from './MenuItemSwitch';
import { MenuItemLink } from './MenuItemLink';

describe('styled headless menus', () => {
  it('preserves checked-value callbacks and default checkmarks for selectable items', () => {
    const onCheckedValueChange = jest.fn();
    const checkboxRef = React.createRef<HTMLDivElement>();
    const { getByRole } = render(
      <MenuList
        defaultCheckedValues={{ preferences: ['alerts'], size: ['large'] }}
        onCheckedValueChange={onCheckedValueChange}
      >
        <MenuItemCheckbox ref={checkboxRef} name="preferences" value="alerts">
          Alerts
        </MenuItemCheckbox>
        <MenuItemRadio name="size" value="small">
          Small
        </MenuItemRadio>
        <MenuItemRadio name="size" value="large">
          Large
        </MenuItemRadio>
        <MenuItemSwitch name="preferences" value="sound">
          Sound
        </MenuItemSwitch>
      </MenuList>,
    );

    const checkbox = getByRole('menuitemcheckbox', { name: 'Alerts' });
    const radio = getByRole('menuitemradio', { name: 'Small' });
    const menuSwitch = getByRole('menuitemcheckbox', { name: 'Sound' });
    expect(checkboxRef.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute('data-checked', '');
    expect(checkbox.querySelector('.fui-MenuItemCheckbox__checkmark svg')).not.toBeNull();
    expect(radio.querySelector('.fui-MenuItemRadio__checkmark svg')).not.toBeNull();
    expect(menuSwitch.querySelector('.fui-MenuItemSwitch__switchIndicator svg')).not.toBeNull();
    expect(getByRole('menu')).toHaveAttribute('focusgroup', 'menu block wrap');

    fireEvent.click(checkbox);
    expect(onCheckedValueChange).toHaveBeenLastCalledWith(expect.anything(), { name: 'preferences', checkedItems: [] });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).not.toHaveAttribute('data-checked');

    fireEvent.click(radio);
    expect(onCheckedValueChange).toHaveBeenLastCalledWith(expect.anything(), { name: 'size', checkedItems: ['small'] });
    expect(getByRole('menuitemradio', { name: 'Large' })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(menuSwitch);
    expect(onCheckedValueChange).toHaveBeenLastCalledWith(expect.anything(), {
      name: 'preferences',
      checkedItems: ['sound'],
    });
    expect(menuSwitch).toHaveAttribute('data-checked', '');
  });

  it('does not toggle disabled checked switches and preserves null indicator slots', () => {
    const onCheckedValueChange = jest.fn();
    const { getByRole } = render(
      <MenuList defaultCheckedValues={{ settings: ['sound'] }} onCheckedValueChange={onCheckedValueChange}>
        <MenuItemSwitch name="settings" value="sound" disabled switchIndicator={null}>
          Sound
        </MenuItemSwitch>
        <MenuItemCheckbox name="settings" value="alerts" checkmark={null}>
          Alerts
        </MenuItemCheckbox>
      </MenuList>,
    );
    const menuSwitch = getByRole('menuitemcheckbox', { name: 'Sound' });
    fireEvent.click(menuSwitch);
    expect(menuSwitch).toHaveAttribute('aria-disabled', 'true');
    expect(menuSwitch).toHaveAttribute('data-checked', '');
    expect(onCheckedValueChange).not.toHaveBeenCalled();
    expect(menuSwitch.querySelector('.fui-MenuItemSwitch__switchIndicator')).toBeNull();
    expect(getByRole('menuitemcheckbox', { name: 'Alerts' }).querySelector('.fui-MenuItem__checkmark')).toBeNull();
  });

  it.each(['ltr', 'rtl'] as const)('restores the %s default submenu glyph', dir => {
    const ExpectedGlyph = dir === 'rtl' ? ChevronLeftRegular : ChevronRightRegular;
    const { getByRole, getByTestId } = render(
      <Provider dir={dir}>
        <MenuList>
          <MenuItem hasSubmenu>More</MenuItem>
          <MenuItem hasSubmenu submenuIndicator={null}>
            No indicator
          </MenuItem>
        </MenuList>
        <ExpectedGlyph data-testid="expected-chevron" />
      </Provider>,
    );
    const item = getByRole('menuitem', { name: 'More' });
    expect(item.querySelector('[data-menu-icon-kind="regular"] path')?.getAttribute('d')).toBe(
      getByTestId('expected-chevron').querySelector('path')?.getAttribute('d'),
    );
    expect(item.querySelectorAll('.fui-MenuItem__submenuIndicator svg')).toHaveLength(2);
    expect(getByRole('menuitem', { name: 'No indicator' }).querySelector('.fui-MenuItem__submenuIndicator')).toBeNull();
  });

  it('keeps caller slot render functions, refs, classes, styles, and font icons', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const iconRef = React.createRef<HTMLSpanElement>();
    const renderIcon: SlotRenderFunction<ExtractSlotProps<MenuItemSlots['icon']>> = (Component, props) => (
      <Component {...props} data-testid="custom-icon">
        <CheckmarkFilled />
      </Component>
    );
    const { getByRole, getByTestId } = render(
      <MenuList>
        <MenuItem
          ref={rootRef}
          className="caller-item"
          style={{ opacity: 0.8 }}
          icon={{
            ref: iconRef,
            className: 'caller-icon',
            children: renderIcon,
          }}
        >
          Font icon
        </MenuItem>
      </MenuList>,
    );
    const item = getByRole('menuitem', { name: 'Font icon' });
    expect(rootRef.current).toBe(item);
    expect(item).toHaveClass('fui-MenuItem', 'caller-item');
    expect(item).toHaveStyle({ opacity: '0.8' });
    expect(iconRef.current).toBe(getByTestId('custom-icon'));
    expect(iconRef.current).toHaveClass('fui-MenuItem__icon', 'caller-icon');
    expect(iconRef.current?.querySelector('[data-fui-icon="font"]')).not.toBeNull();
  });

  it('retains native menu orchestration and anchor semantics', () => {
    const onOpenChange = jest.fn();
    const popoverRef = React.createRef<HTMLDivElement>();
    const anchorRef = React.createRef<HTMLAnchorElement>();
    const { getByRole } = render(
      <Menu onOpenChange={onOpenChange}>
        <MenuTrigger>
          <button>Open menu</button>
        </MenuTrigger>
        <MenuPopover ref={popoverRef} className="caller-popover">
          <MenuList>
            <MenuItemLink ref={anchorRef} href="#destination">
              Destination
            </MenuItemLink>
          </MenuList>
        </MenuPopover>
      </Menu>,
    );
    fireEvent.click(getByRole('button', { name: 'Open menu' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ open: true }));
    expect(popoverRef.current).toHaveAttribute('popover', 'auto');
    expect(popoverRef.current).toHaveClass('fui-MenuPopover', 'caller-popover');
    const item = getByRole('menuitem', { name: 'Destination' });
    expect(anchorRef.current).toBe(item);
    expect(item.tagName).toBe('A');
    expect(item).toHaveAttribute('href', '#destination');
    fireEvent.click(item);
    expect(onOpenChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ open: false, type: 'menuItemClick' }),
    );
  });
});
