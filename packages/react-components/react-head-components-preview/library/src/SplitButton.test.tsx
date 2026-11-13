import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ButtonContextProvider } from '@fluentui/react-headless-components-preview/button';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import type { ButtonProps } from './Button.js';
import type { MenuButtonProps } from './MenuButton.js';
import { SplitButton } from './SplitButton.js';

describe('SplitButton', () => {
  it('styles both actions with stock defaults, preserves labels, and does not inherit Button size', () => {
    const { getAllByRole } = render(
      <ButtonContextProvider value={{ size: 'small' }}>
        <SplitButton>Action</SplitButton>
      </ButtonContextProvider>,
    );
    const [primary, menu] = getAllByRole('button');

    for (const button of [primary, menu]) {
      expect(button).toHaveAttribute('data-shape', 'rounded');
      expect(button).toHaveAttribute('data-size', 'medium');
      expect(button).toHaveClass('fui-Button');
    }
    expect(menu).toHaveAttribute('aria-labelledby', primary.id);
    expect(menu.querySelector('svg')).not.toBeNull();
  });

  it('preserves typed anchor and menu renderers, refs, and per-slot visual overrides', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const actionRef = React.createRef<HTMLAnchorElement>();
    const menuRef = React.createRef<HTMLButtonElement>();
    const onMenuClick = jest.fn();
    const renderPrimary: SlotRenderFunction<Extract<ButtonProps, { as: 'a' }>> = (Component, props) => (
      <Component {...props} as="a">
        Custom action
      </Component>
    );
    const renderMenu: SlotRenderFunction<Extract<MenuButtonProps, { as?: 'button' }>> = (Component, props) => (
      <Component {...props} data-custom-menu="" />
    );
    const { getByRole } = render(
      <SplitButton
        ref={rootRef}
        appearance="primary"
        size="large"
        primaryActionButton={{
          as: 'a',
          href: '/action',
          ref: actionRef,
          className: 'consumer-action',
          style: { opacity: 0.5 },
          appearance: 'outline',
          children: renderPrimary,
        }}
        menuButton={{
          ref: menuRef,
          'aria-label': 'More actions',
          onClick: onMenuClick,
          menuIcon: null,
          children: renderMenu,
        }}
      />,
    );
    const primary = getByRole('link', { name: 'Custom action' });
    const menu = getByRole('button', { name: 'More actions' });

    expect(rootRef.current).toContainElement(primary);
    expect(actionRef.current).toBe(primary);
    expect(menuRef.current).toBe(menu);
    expect(primary).toHaveAttribute('href', '/action');
    expect(primary).toHaveClass('consumer-action', 'fui-Button', 'fui-SplitButton__primaryActionButton');
    expect(primary).toHaveStyle({ opacity: '0.5' });
    expect(primary).toHaveAttribute('data-appearance', 'outline');
    expect(primary).toHaveAttribute('data-size', 'large');
    expect(menu).toHaveAttribute('data-custom-menu');
    expect(menu.querySelector('svg')).toBeNull();
    fireEvent.click(menu);
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('retains null actions and independent disabled overrides', () => {
    const { getAllByRole, getByRole, rerender } = render(
      <SplitButton disabled primaryActionButton={{ disabled: false }}>
        Action
      </SplitButton>,
    );
    const [primary, menu] = getAllByRole('button');
    expect(primary).not.toBeDisabled();
    expect(menu).toBeDisabled();

    rerender(<SplitButton primaryActionButton={null} menuButton={{ 'aria-label': 'Menu only' }} />);
    expect(getAllByRole('button')).toHaveLength(1);
    expect(getByRole('button', { name: 'Menu only' })).toHaveClass('fui-MenuButton');

    rerender(<SplitButton menuButton={null}>Action only</SplitButton>);
    expect(getAllByRole('button')).toHaveLength(1);
    expect(getByRole('button', { name: 'Action only' })).toHaveClass('fui-Button');
  });
});
