import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Accordion } from './Accordion';
import { AccordionHeader, type AccordionHeaderSlots } from './AccordionHeader';
import { AccordionItem } from './AccordionItem';
import { AccordionPanel } from './AccordionPanel';

describe('Accordion visual wrapper', () => {
  it('keeps panels mounted and preserves header button render functions and refs across toggles', () => {
    const headerRef = React.createRef<HTMLDivElement>();
    const buttonRef = React.createRef<HTMLButtonElement>();
    const panelRef = React.createRef<HTMLDivElement>();
    const onToggle = jest.fn();
    const renderButton: SlotRenderFunction<
      Extract<ExtractSlotProps<AccordionHeaderSlots['button']>, { as?: 'button' }>
    > = (_Button, props) => <button {...props} data-consumer="button" />;
    const { getByRole } = render(
      <Accordion collapsible onToggle={onToggle}>
        <AccordionItem value="item">
          <AccordionHeader
            ref={headerRef}
            size="large"
            inline
            expandIconPosition="end"
            button={{
              as: 'button',
              ref: buttonRef,
              className: 'consumer-button',
              style: { opacity: 0.8 },
              children: renderButton,
            }}
          >
            Details
          </AccordionHeader>
          <AccordionPanel ref={panelRef}>
            <input aria-label="Persistent value" defaultValue="Keep me" />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );
    const panel = panelRef.current;
    const input = getByRole('textbox');
    const button = getByRole('button', { name: 'Details' });
    expect(buttonRef.current).toBe(button);
    expect(headerRef.current).toHaveAttribute('data-size', 'large');
    expect(headerRef.current).toHaveAttribute('data-inline', '');
    expect(button).toHaveClass('fui-AccordionHeader__button', 'consumer-button');
    expect(button).toHaveAttribute('data-consumer', 'button');
    expect(button).toHaveStyle({ opacity: 0.8 });
    expect(panel).not.toHaveAttribute('data-open');

    fireEvent.click(button);
    expect(panel).toHaveAttribute('data-open', '');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.change(input, { target: { value: 'Still here' } });
    fireEvent.click(button);

    expect(onToggle).toHaveBeenCalledTimes(2);
    expect(panelRef.current).toBe(panel);
    expect(panel).not.toHaveAttribute('data-open');
    expect(input).toHaveValue('Still here');
  });

  it('keeps null icon slots absent and respects cancellation from the button slot', () => {
    const onToggle = jest.fn();
    const preventToggle: React.MouseEventHandler<HTMLButtonElement> = event => event.preventDefault();
    const { getByRole, container } = render(
      <Accordion collapsible onToggle={onToggle}>
        <AccordionItem value="item">
          <AccordionHeader icon={null} expandIcon={null} button={{ onClick: preventToggle }}>
            Details
          </AccordionHeader>
          <AccordionPanel>Panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(getByRole('button'));
    expect(onToggle).not.toHaveBeenCalled();
    expect(container.querySelector('.fui-AccordionHeader__expandIcon')).toBeNull();
    expect(container.querySelector('.fui-AccordionHeader__icon')).toBeNull();
  });
});
