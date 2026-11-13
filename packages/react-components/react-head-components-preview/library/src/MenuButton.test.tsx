import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { MenuButton, type MenuButtonSlots } from './MenuButton.js';

describe('MenuButton', () => {
  it('provides the stock chevron without replacing a caller menu-icon renderer or null slot', () => {
    const renderMenuIcon: SlotRenderFunction<ExtractSlotProps<MenuButtonSlots['menuIcon']>> = (Component, props) => (
      <Component {...props} data-testid="menu-icon" />
    );
    const { getByRole, getByTestId, rerender } = render(<MenuButton>Menu</MenuButton>);
    expect(getByRole('button').querySelector('svg')).not.toBeNull();

    rerender(<MenuButton menuIcon={{ children: renderMenuIcon }}>Menu</MenuButton>);
    expect(getByTestId('menu-icon')).toHaveClass('fui-MenuButton__menuIcon');

    rerender(<MenuButton menuIcon={null}>Menu</MenuButton>);
    expect(getByRole('button').querySelector('svg')).toBeNull();
    expect(getByRole('button').querySelector('.fui-MenuButton__menuIcon')).toBeNull();
  });

  it('keeps expanded and disabled state together without enabling an expanded action', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = jest.fn();
    const { getByRole } = render(
      <MenuButton ref={ref} aria-expanded="true" appearance="primary" disabledFocusable onClick={onClick}>
        Expanded
      </MenuButton>,
    );
    const button = getByRole('button', { name: 'Expanded' });

    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('data-open');
    expect(button).toHaveAttribute('data-disabled-focusable');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
