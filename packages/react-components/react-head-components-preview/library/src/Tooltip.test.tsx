import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Popover } from './Popover';
import { PopoverSurface } from './PopoverSurface';
import { PopoverTrigger } from './PopoverTrigger';
import { Tooltip, type TooltipProps } from './Tooltip';

describe('styled native Tooltip and Popover', () => {
  it('retains the Tooltip trigger marker for stacked labels, descriptions and refs', () => {
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <Tooltip relationship="description" content={{ id: 'outer-description', children: 'More detail' }}>
        <Tooltip relationship="label" content="Action label">
          <button ref={triggerRef} type="button">
            Action
          </button>
        </Tooltip>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Action label' });
    expect(triggerRef.current).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-describedby', 'outer-description');
    expect(screen.getByRole('tooltip')).toHaveTextContent('More detail');
  });

  it('styles resolved tooltip content without replacing its render function, style or ref', () => {
    const contentRef = React.createRef<HTMLDivElement>();
    const renderContent: SlotRenderFunction<React.ComponentPropsWithRef<'div'>> = (Component, props) => (
      <Component {...props} data-testid="custom-content" />
    );
    const content: TooltipProps['content'] = {
      ref: contentRef,
      className: 'consumer-tooltip',
      style: { maxWidth: 'none' },
      children: renderContent,
    };

    render(
      <Tooltip content={content} appearance="inverted" relationship="inaccessible" visible withArrow>
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId('custom-content');
    expect(contentRef.current).toBe(tooltip);
    expect(tooltip).toHaveAttribute('popover');
    expect(tooltip).toHaveAttribute('data-appearance', 'inverted');
    expect(tooltip).toHaveClass('consumer-tooltip');
    expect(tooltip).toHaveStyle({ maxWidth: 'none' });
    expect(tooltip.querySelector('[data-arrow]')).not.toBeNull();
  });

  it('keeps nested Popover triggers, native surfaces and explicit undefined visual defaults usable', () => {
    const surfaceRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const renderSurface: SlotRenderFunction<React.ComponentPropsWithRef<'div'>> = (Component, props) => (
      <Component {...props} data-testid="custom-surface" />
    );

    render(
      <Popover size={undefined} appearance="brand" withArrow>
        <Tooltip relationship="label" content="Open details">
          <PopoverTrigger>
            <button ref={triggerRef} type="button">
              Open
            </button>
          </PopoverTrigger>
        </Tooltip>
        <PopoverSurface as="div" ref={surfaceRef} className="consumer-popover" style={{ maxWidth: 'none' }}>
          {renderSurface}
        </PopoverSurface>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(triggerRef.current).toBe(trigger);
    fireEvent.click(trigger);

    const surface = screen.getByTestId('custom-surface');
    expect(surfaceRef.current).toBe(surface);
    expect(surface).toHaveAttribute('popover', 'auto');
    expect(surface).toHaveAttribute('data-size', 'medium');
    expect(surface).toHaveAttribute('data-appearance', 'brand');
    expect(surface).toHaveClass('consumer-popover');
    expect(surface).toHaveStyle({ maxWidth: 'none' });
    expect(surface.querySelector('[data-arrow]')).not.toBeNull();
  });
});
