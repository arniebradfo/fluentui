import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Combobox } from './Combobox.js';
import { Dropdown, type DropdownSlots } from './Dropdown.js';
import { Field } from './Field.js';
import { Listbox, type ListboxProps } from './Listbox.js';
import { Option } from './Option.js';
import { OptionGroup } from './OptionGroup.js';

describe('Fluent option pickers', () => {
  it('keeps the outline default, native input ref and an absent placeholder', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { getByRole } = render(<Combobox ref={ref} aria-label="Choice" defaultValue="Initial" />);
    const input = getByRole('combobox');

    expect(ref.current).toBe(input);
    expect(input).toHaveValue('Initial');
    expect(input).not.toHaveAttribute('placeholder');
    expect(input.parentElement).toHaveAttribute('data-appearance', 'outline');
    expect(input.parentElement).not.toHaveAttribute('data-inline-label-layout');
  });

  it('styles the public Listbox while preserving its renderer, native popup, refs and selection data', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const listboxRef = React.createRef<HTMLDivElement>();
    const onOptionSelect = jest.fn();
    let styledListboxReceived = false;
    const renderListbox: SlotRenderFunction<ListboxProps> = (Component, props) => {
      styledListboxReceived = Component === Listbox;
      return <Component {...props} className={`${props.className} consumer-listbox`} />;
    };
    const { getByRole } = render(
      <Field label="Choice" size="large">
        <Combobox
          ref={inputRef}
          defaultOpen
          onOptionSelect={onOptionSelect}
          listbox={{
            ref: listboxRef,
            children: renderListbox,
          }}
        >
          <OptionGroup label="Choices">
            <Option value="alpha">Alpha</Option>
            <Option value="beta">Beta</Option>
          </OptionGroup>
        </Combobox>
      </Field>,
    );
    const listbox = getByRole('listbox');
    const input = getByRole('combobox', { name: 'Choice' });

    expect(styledListboxReceived).toBe(true);
    expect(listboxRef.current).toBe(listbox);
    expect(listbox).toHaveClass('fui-Listbox', 'consumer-listbox');
    expect(listbox).toHaveAttribute('popover', 'auto');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(input.parentElement).toHaveAttribute('data-size', 'large');
    expect(getByRole('group', { name: 'Choices' })).toBeInTheDocument();
    fireEvent.click(getByRole('option', { name: 'Beta' }));

    expect(onOptionSelect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ optionValue: 'beta', optionText: 'Beta', selectedOptions: ['beta'] }),
    );
    expect(inputRef.current).toBe(input);
    expect(input).toHaveValue('Beta');
  });

  it('does not replace authored optional Combobox slots', () => {
    const { getByRole, queryByRole, container } = render(
      <Combobox aria-label="Choice" open listbox={null} expandIcon={null} clearIcon={null}>
        <Option>Alpha</Option>
      </Combobox>,
    );

    expect(getByRole('combobox')).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();
    expect(container.querySelector('.fui-Combobox__expandIcon')).toBeNull();
    expect(container.querySelector('.fui-Combobox__clearIcon')).toBeNull();
  });

  it('preserves Dropdown button render functions, Field association and controlled display values', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const renderButton: SlotRenderFunction<ExtractSlotProps<DropdownSlots['button']>> = (Component, props) => (
      <Component {...props} data-testid="trigger" />
    );
    const { getByRole, getByTestId, rerender } = render(
      <Field label="Choice" required validationMessage="Choose one">
        <Dropdown ref={ref} value="Alpha" button={{ children: renderButton }} expandIcon={null}>
          <Option value="alpha">Alpha</Option>
        </Dropdown>
      </Field>,
    );
    const trigger = getByRole('combobox', { name: 'Choice' });

    expect(ref.current).toBe(trigger);
    expect(getByTestId('trigger')).toHaveTextContent('Alpha');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(trigger.parentElement).toHaveAttribute('data-appearance', 'outline');
    expect(trigger.parentElement).toHaveAttribute('data-invalid', '');

    rerender(
      <Dropdown aria-label="Choice" ref={ref} value="Beta">
        <Option value="beta">Beta</Option>
      </Dropdown>,
    );
    expect(ref.current).toHaveTextContent('Beta');
  });

  it('preserves Dropdown clear callbacks and its styled custom Listbox', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onOptionSelect = jest.fn();
    const onClear = jest.fn();
    const renderListbox: SlotRenderFunction<ListboxProps> = (Component, props) => (
      <Component {...props} data-testid="listbox" />
    );
    const { getByRole } = render(
      <Dropdown
        ref={ref}
        aria-label="Choice"
        defaultOpen
        clearable
        defaultSelectedOptions={['alpha']}
        onOptionSelect={onOptionSelect}
        clearButton={{ onClick: onClear }}
        listbox={{ children: renderListbox }}
      >
        <Option value="alpha">Alpha</Option>
        <Option value="beta">Beta</Option>
      </Dropdown>,
    );
    const trigger = getByRole('combobox');

    expect(getByRole('listbox')).toHaveClass('fui-Listbox');
    expect(getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onOptionSelect).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ selectedOptions: [] }));
    expect(ref.current).toBe(trigger);
    expect(trigger).not.toHaveTextContent('Alpha');
  });
});
