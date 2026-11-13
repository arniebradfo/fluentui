import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Card, type CardSlots } from './Card';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardPreview } from './CardPreview';

describe('Card visual wrapper', () => {
  it('uses filled visuals while preserving the public floating-action slot and consumer styles', () => {
    const cardRef = React.createRef<HTMLDivElement>();
    const actionRef = React.createRef<HTMLDivElement>();
    const renderAction: SlotRenderFunction<ExtractSlotProps<CardSlots['floatingAction']>> = (Action, props) => (
      <Action {...props} data-consumer="action">
        Pin
      </Action>
    );
    const { getByRole, getByText } = render(
      <Card
        ref={cardRef}
        className="consumer-card"
        style={{ opacity: 0.8 }}
        floatingAction={{
          ref: actionRef,
          className: 'consumer-action',
          children: renderAction,
        }}
      >
        <CardPreview logo={null}>Preview</CardPreview>
        <CardHeader header="Title" description="Description" action={null} />
        <CardFooter action={<button>More</button>}>Footer</CardFooter>
      </Card>,
    );
    const card = getByRole('group');
    expect(cardRef.current).toBe(card);
    expect(card).toHaveAttribute('data-appearance', 'filled');
    expect(card).not.toHaveAttribute('data-floating-action-position');
    expect(card).toHaveClass('consumer-card', 'fui-Card');
    expect(card).toHaveStyle({ opacity: 0.8 });
    expect(actionRef.current).toBe(getByText('Pin'));
    expect(actionRef.current).toHaveClass('consumer-action', 'fui-Card__floatingAction');
    expect(actionRef.current).toHaveAttribute('data-consumer', 'action');
    expect(getByText('Title').parentElement).toHaveAttribute('data-has-description', '');
    expect(card.querySelector('.fui-CardPreview__logo')).toBeNull();
    expect(card.querySelector('.fui-CardHeader__action')).toBeNull();
    expect(getByRole('button', { name: 'More' }).parentElement).toHaveClass('fui-CardFooter__action');
  });

  it('deliberately leaves nested-control selection restrictions to the consumer', () => {
    const onSelectionChange = jest.fn();
    const { getByRole } = render(
      <Card onSelectionChange={onSelectionChange}>
        <button>Nested action</button>
      </Card>,
    );
    fireEvent.click(getByRole('button'));
    expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), { selected: true });
    expect(getByRole('group')).toHaveAttribute('data-selected', '');
  });

  it('preserves the public restriction predicate and native checkbox refs', () => {
    const checkboxRef = React.createRef<HTMLInputElement>();
    const onSelectionChange = jest.fn();
    const shouldRestrictTriggerAction = jest.fn(() => true);
    const { getByRole } = render(
      <Card
        onSelectionChange={onSelectionChange}
        shouldRestrictTriggerAction={shouldRestrictTriggerAction}
        checkbox={{ ref: checkboxRef, 'aria-label': 'Select card', className: 'consumer-checkbox' }}
      >
        <button>Nested action</button>
      </Card>,
    );
    fireEvent.click(getByRole('button'));
    expect(shouldRestrictTriggerAction).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();

    const checkbox = getByRole('checkbox', { name: 'Select card' });
    expect(checkboxRef.current).toBe(checkbox);
    expect(checkbox).toHaveClass('consumer-checkbox', 'fui-Card__checkbox');
    fireEvent.click(checkbox);
    expect(onSelectionChange).toHaveBeenCalledWith(expect.anything(), { selected: true });
    expect(shouldRestrictTriggerAction).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });
});
