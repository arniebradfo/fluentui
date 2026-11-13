import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Listbox, type ListboxProps } from './Listbox.js';
import { TagPicker } from './TagPicker.js';
import { TagPickerButton } from './TagPickerButton.js';
import { TagPickerControl } from './TagPickerControl.js';
import { TagPickerGroup } from './TagPickerGroup.js';
import { TagPickerInput } from './TagPickerInput.js';
import { TagPickerList } from './TagPickerList.js';
import { TagPickerOption } from './TagPickerOption.js';
import { TagPickerOptionGroup } from './TagPickerOptionGroup.js';

describe('Fluent TagPicker', () => {
  it('uses outline and parent-owned sizes while preserving native group and input contracts', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { getByRole, getByTestId, container } = render(
      <TagPicker noPopover size="extra-large" defaultSelectedOptions={['selected']}>
        <TagPickerControl data-testid="control">
          <TagPickerGroup aria-label="Selected values">
            <button type="button">Selected tag</button>
          </TagPickerGroup>
          <TagPickerInput ref={ref} aria-label="Add value" value="Typed text" />
        </TagPickerControl>
      </TagPicker>,
    );
    const input = getByRole('combobox', { name: 'Add value' });

    expect(ref.current).toBe(input);
    expect(input).toHaveValue('Typed text');
    expect(input).toHaveAttribute('data-size', 'extra-large');
    expect(getByTestId('control')).toHaveAttribute('data-appearance', 'outline');
    expect(getByTestId('control')).toHaveAttribute('data-size', 'extra-large');
    expect(getByRole('toolbar')).toHaveAttribute('focusgroup', 'toolbar inline wrap');
    expect(getByRole('toolbar')).toHaveAttribute('data-size', 'medium');
    expect(container.querySelector('.fui-TagPickerControl__expandIcon')).toBeNull();
  });

  it('keeps a styled native Listbox, the public OptionGroup alias and option callback payload', () => {
    const listboxRef = React.createRef<HTMLDivElement>();
    const onOptionSelect = jest.fn();
    let styledListboxReceived = false;
    const renderOptions: SlotRenderFunction<ListboxProps> = (Component, props) => {
      styledListboxReceived = Component === Listbox;
      return (
        <Component {...props}>
          <TagPickerOptionGroup label="Choices">
            <TagPickerOption value="alpha" media={<span data-testid="media">A</span>} secondaryContent="First choice">
              Alpha
            </TagPickerOption>
          </TagPickerOptionGroup>
        </Component>
      );
    };
    const { getByRole, getByTestId } = render(
      <TagPicker defaultOpen onOptionSelect={onOptionSelect}>
        <TagPickerControl>
          <TagPickerInput aria-label="Add value" />
        </TagPickerControl>
        <TagPickerList ref={listboxRef} children={renderOptions} />
      </TagPicker>,
    );
    const listbox = getByRole('listbox');
    const option = getByRole('option');

    expect(styledListboxReceived).toBe(true);
    expect(listboxRef.current).toBe(listbox);
    expect(listbox).toHaveClass('fui-Listbox', 'fui-TagPickerList');
    expect(listbox).toHaveAttribute('popover', 'auto');
    expect(getByRole('group', { name: 'Choices' })).toBeInTheDocument();
    expect(getByTestId('media')).toBeInTheDocument();
    expect(option).toHaveTextContent('First choice');
    fireEvent.click(option);
    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ value: 'alpha', selectedOptions: ['alpha'] }),
    );
  });

  it('keeps parent-owned TagPickerButton sizing and its explicit native disabled state', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { getByRole } = render(
      <TagPicker noPopover disabled size="large">
        <TagPickerControl>
          <TagPickerButton disabled aria-label="Select values" ref={ref}>
            Choose
          </TagPickerButton>
        </TagPickerControl>
      </TagPicker>,
    );
    const button = getByRole('combobox', { name: 'Select values' });

    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveAttribute('data-disabled');
    expect(button.parentElement).toHaveAttribute('data-appearance', 'outline');
  });
});
