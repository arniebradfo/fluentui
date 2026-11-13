import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Input, type InputSlots } from './Input.js';
import { Textarea } from './Textarea.js';
import { Select } from './Select.js';
import { SearchBox } from './SearchBox.js';
import { SpinButton } from './SpinButton.js';

describe('Fluent form controls', () => {
  it('keeps a read-only Input native and does not add a copy action', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { getByRole, queryByRole } = render(<Input ref={ref} aria-label="Value" readOnly defaultValue="Example" />);
    const input = getByRole('textbox');

    expect(ref.current).toBe(input);
    expect(input).toHaveValue('Example');
    expect(input).toHaveAttribute('readonly');
    expect(input.parentElement).toHaveAttribute('data-appearance', 'outline');
    expect(queryByRole('button')).toBeNull();
  });

  it('preserves controlled values and the public Input change payload', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { getByRole, rerender } = render(<Input aria-label="Value" value="Before" ref={ref} onChange={onChange} />);
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'After' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: input }), { value: 'After' });
    expect(input).toHaveValue('Before');

    rerender(<Input aria-label="Value" value="After" ref={ref} onChange={onChange} />);
    expect(input).toHaveValue('After');
    expect(ref.current).toBe(input);
  });

  it('preserves root and content render functions without replacing native input props', () => {
    const ref = React.createRef<HTMLInputElement>();
    const renderRoot: SlotRenderFunction<ExtractSlotProps<InputSlots['root']>> = (Component, props) => (
      <Component {...props} data-testid="root" />
    );
    const renderSuffix: SlotRenderFunction<ExtractSlotProps<InputSlots['contentAfter']>> = (Component, props) => (
      <Component {...props} data-testid="suffix">
        Custom suffix
      </Component>
    );
    const { getByRole, getByTestId, queryByText } = render(
      <Input
        ref={ref}
        aria-label="Value"
        defaultValue="Native value"
        input={{ name: 'value', className: 'consumer-input' }}
        root={{ children: renderRoot }}
        contentBefore={null}
        contentAfter={{
          children: renderSuffix,
        }}
      />,
    );

    expect(getByTestId('root')).toContainElement(getByRole('textbox'));
    expect(getByTestId('suffix')).toHaveTextContent('Custom suffix');
    expect(getByRole('textbox')).toHaveClass('consumer-input');
    expect(ref.current).toHaveValue('Native value');
    expect(ref.current).toHaveAttribute('name', 'value');
    expect(queryByText('Copy')).toBeNull();
  });

  it.each<[string, React.ReactElement]>([
    ['Textarea', <Textarea key="textarea" aria-label="Control" />],
    [
      'Select',
      <Select key="select" aria-label="Control">
        <option>Choice</option>
      </Select>,
    ],
    ['SearchBox', <SearchBox key="searchbox" aria-label="Control" />],
    ['SpinButton', <SpinButton key="spinbutton" aria-label="Control" />],
  ])('uses the outline default for %s', (_name, control) => {
    const { getByLabelText } = render(control);
    expect(getByLabelText('Control').parentElement).toHaveAttribute('data-appearance', 'outline');
  });

  it('preserves Textarea rows, resizing, native ref and uncontrolled changes', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const onChange = jest.fn();
    const { getByRole } = render(
      <Textarea aria-label="Notes" ref={ref} rows={5} resize="vertical" defaultValue="Before" onChange={onChange} />,
    );
    const textarea = getByRole('textbox');

    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea.parentElement).toHaveAttribute('data-resize', 'vertical');
    fireEvent.change(textarea, { target: { value: 'After' } });
    expect(textarea).toHaveValue('After');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: textarea }), { value: 'After' });
  });

  it('keeps Select native form/reset behavior and change data', () => {
    const formRef = React.createRef<HTMLFormElement>();
    const ref = React.createRef<HTMLSelectElement>();
    const onChange = jest.fn();
    const { getByRole } = render(
      <form ref={formRef}>
        <Select name="choice" aria-label="Choice" defaultValue="first" ref={ref} onChange={onChange}>
          <option value="first">First</option>
          <option value="second">Second</option>
        </Select>
      </form>,
    );
    const select = getByRole('combobox');

    expect(ref.current).toBe(select);
    expect(ref.current?.form).toBe(formRef.current);
    fireEvent.change(select, { target: { value: 'second' } });
    expect(select).toHaveValue('second');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: select }), { value: 'second' });
    formRef.current?.reset();
    expect(select).toHaveValue('first');
  });

  it('keeps SearchBox clear callbacks and its native input ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { getByRole } = render(
      <SearchBox
        ref={ref}
        aria-label="Search"
        defaultValue="Find me"
        onChange={onChange}
        dismiss={{ 'aria-label': 'Clear search' }}
      />,
    );
    const input = getByRole('searchbox');
    fireEvent.focus(input);
    fireEvent.click(getByRole('button', { name: 'Clear search' }));

    expect(ref.current).toBe(input);
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith(expect.anything(), { value: '' });
  });
});
