import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { List } from './List';
import { ListItem } from './ListItem';

describe('ListItem native checkmark bridge', () => {
  it('skins the native input without replacing its props, ref or change event', () => {
    const rootRef = React.createRef<HTMLLIElement>();
    const inputRef = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const onSelectionChange = jest.fn();
    const { getByRole } = render(
      <List selectionMode="multiselect" onSelectionChange={onSelectionChange}>
        <ListItem
          ref={rootRef}
          value="one"
          className="consumer-item"
          checkmark={{
            ref: inputRef,
            className: 'consumer-checkmark',
            style: { opacity: 0.8 },
            'aria-label': 'Select one',
            name: 'selection',
            value: 'one',
            onChange,
          }}
        >
          One
        </ListItem>
      </List>,
    );
    const input = getByRole('checkbox', { name: 'Select one' });
    expect(inputRef.current).toBe(input);
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveClass('fui-ListItem__checkmark', 'ListItem__checkmark', 'consumer-checkmark');
    expect(input).toHaveStyle({ opacity: 0.8 });
    expect(input).toHaveAttribute('name', 'selection');
    expect(input).toHaveAttribute('value', 'one');
    expect(input.closest('.fui-Checkbox')).toBeNull();
    expect(rootRef.current).toBe(getByRole('option'));

    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(input).toBeChecked();
    expect(rootRef.current).toHaveAttribute('data-selected', '');
  });

  it('keeps disabled checkmarks native even when the row still has an action', () => {
    const onAction = jest.fn();
    const onSelectionChange = jest.fn();
    const { getByRole } = render(
      <List selectionMode="multiselect" onSelectionChange={onSelectionChange}>
        <ListItem value="one" disabledSelection onAction={onAction} checkmark={{ 'aria-label': 'Select one' }}>
          One
        </ListItem>
      </List>,
    );
    expect(getByRole('checkbox')).toBeDisabled();
    expect(getByRole('option')).not.toHaveAttribute('data-disabled');
    fireEvent.click(getByRole('option'));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('preserves null checkmarks and the headless composite navigation contract', () => {
    const { getByRole, queryByRole } = render(
      <List navigationMode="composite" selectionMode="multiselect">
        <ListItem value="one" checkmark={null}>
          <span role="gridcell">
            <button>Edit</button>
          </span>
        </ListItem>
      </List>,
    );
    const row = getByRole('row');
    expect(queryByRole('checkbox')).toBeNull();
    expect(row).not.toHaveAttribute('focusgroup');
    row.focus();
    fireEvent.keyDown(row, { key: 'ArrowRight' });
    expect(getByRole('button', { name: 'Edit' })).toHaveFocus();
  });
});
