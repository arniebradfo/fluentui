import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ButtonContextProvider, type ButtonSlots } from '@fluentui/react-headless-components-preview/button';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Button } from './Button.js';
import { CompoundButton } from './CompoundButton.js';
import { MenuButton } from './MenuButton.js';
import { ToggleButton } from './ToggleButton.js';

describe('Button visuals', () => {
  it('uses rounded defaults across variants while preserving the public size context', () => {
    const { getAllByRole, getByRole } = render(
      <ButtonContextProvider value={{ size: 'small' }}>
        <Button>Action</Button>
        <CompoundButton secondaryContent="Details">Compound</CompoundButton>
        <MenuButton>Menu</MenuButton>
        <ToggleButton>Toggle</ToggleButton>
        <Button size="large" shape="square">
          Explicit
        </Button>
      </ButtonContextProvider>,
    );

    for (const button of getAllByRole('button').slice(0, 4)) {
      expect(button).toHaveAttribute('data-shape', 'rounded');
      expect(button).toHaveAttribute('data-size', 'small');
      expect(button).toHaveAttribute('type', 'button');
    }
    expect(getByRole('button', { name: 'Compound Details' })).toHaveTextContent('Details');
    expect(getByRole('button', { name: 'Explicit' })).toHaveAttribute('data-size', 'large');
    expect(getByRole('button', { name: 'Explicit' })).toHaveAttribute('data-shape', 'square');
  });

  it('preserves anchor refs, root renderers, caller styles, and an explicitly absent icon', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const renderRoot: SlotRenderFunction<Extract<ExtractSlotProps<ButtonSlots['root']>, { as: 'a' }>> = (
      _Component,
      props,
    ) => <a {...props}>Custom action</a>;
    const { getByRole } = render(
      <Button as="a" href="/action" ref={ref} icon={null} className="consumer" style={{ opacity: 0.5 }}>
        {renderRoot}
      </Button>,
    );
    const anchor = getByRole('link', { name: 'Custom action' });

    expect(ref.current).toBe(anchor);
    expect(anchor).toHaveAttribute('href', '/action');
    expect(anchor).toHaveClass('consumer');
    expect(anchor).toHaveStyle({ opacity: '0.5' });
    expect(anchor).not.toHaveAttribute('data-has-icon');
  });

  it('retains the headless toggle state and disabled-focusable click behavior', () => {
    const onClick = jest.fn();
    const { getByRole, rerender } = render(<ToggleButton>Toggle</ToggleButton>);
    const button = getByRole('button', { name: 'Toggle' });

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-checked');

    rerender(
      <ToggleButton disabledFocusable onClick={onClick}>
        Toggle
      </ToggleButton>,
    );
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('data-disabled-focusable');
  });
});
