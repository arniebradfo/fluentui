import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Field } from './Field.js';
import { Input } from './Input.js';
import { Checkbox, type CheckboxSlots } from './Checkbox.js';
import { Switch } from './Switch.js';
import { Radio } from './Radio.js';
import { RadioGroup } from './RadioGroup.js';
import { Label, type LabelProps } from './Label.js';

describe('Fluent Field and styled labels', () => {
  it('preserves required, disabled, invalid and description associations', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { getByRole, getByText } = render(
      <Field label="Name" size="large" required validationMessage="Enter a name" hint="Use your full name">
        <Input disabled ref={ref} />
      </Field>,
    );
    const input = getByRole('textbox', { name: /Name/ });
    const label = getByText('Name');
    const message = getByText('Enter a name');
    const hint = getByText('Use your full name');

    expect(ref.current).toBe(input);
    expect(label).toHaveClass('fui-Label');
    expect(label).toHaveAttribute('for', input.id);
    expect(label).toHaveAttribute('data-size', 'large');
    expect(label).toHaveAttribute('data-required');
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', `${message.id} ${hint.id}`);
    expect(input.parentElement).toHaveAttribute('data-size', 'large');
    expect(input.parentElement).toHaveAttribute('data-disabled');
    expect(input.parentElement).toHaveAttribute('data-invalid', '');
  });

  it('preserves custom label rendering, refs and explicit control overrides', () => {
    const labelRef = React.createRef<HTMLLabelElement>();
    let styledLabelReceived = false;
    const renderLabel: SlotRenderFunction<LabelProps> = (Component, props) => {
      styledLabelReceived = Component === Label;
      return (
        <Component {...props} data-testid="label">
          Custom label
        </Component>
      );
    };
    const { getByRole, getByTestId } = render(
      <Field
        size="large"
        required
        validationMessage="Invalid"
        label={{
          ref: labelRef,
          children: renderLabel,
        }}
      >
        <Input size="small" aria-invalid="spelling" />
      </Field>,
    );
    const input = getByRole('textbox', { name: /Custom label/ });

    expect(styledLabelReceived).toBe(true);
    expect(labelRef.current).toBe(getByTestId('label'));
    expect(labelRef.current).toHaveAttribute('for', input.id);
    expect(input.parentElement).toHaveAttribute('data-size', 'small');
    expect(input).toHaveAttribute('aria-invalid', 'spelling');
    expect(input.parentElement).toHaveAttribute('data-invalid', 'spelling');
  });

  it('keeps Checkbox mixed state, custom indicator/label slots and change data', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const renderIndicator: SlotRenderFunction<Extract<ExtractSlotProps<CheckboxSlots['indicator']>, { as: 'span' }>> = (
      Component,
      props,
    ) => (
      <Component {...props} as="span">
        <svg data-testid="custom-indicator" />
      </Component>
    );
    const renderLabel: SlotRenderFunction<LabelProps> = (Component, props) => <Component {...props}>Consent</Component>;
    const { getByRole, getByTestId, getByText } = render(
      <Checkbox
        ref={ref}
        defaultChecked="mixed"
        onChange={onChange}
        indicator={{
          as: 'span',
          children: renderIndicator,
        }}
        label={{
          size: 'small',
          children: renderLabel,
        }}
      />,
    );
    const input = getByRole('checkbox', { name: 'Consent' });

    expect(ref.current).toBe(input);
    expect(ref.current?.indeterminate).toBe(true);
    expect(getByTestId('custom-indicator')).toBeInTheDocument();
    expect(getByText('Consent')).toHaveClass('fui-Label');
    expect(getByText('Consent')).toHaveAttribute('data-size', 'small');
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), { checked: true });
    expect(input).toBeChecked();
  });

  it('preserves optional Checkbox slots and disabled label state', () => {
    const { getByRole, getByText, rerender, container } = render(<Checkbox disabled label="Disabled" />);
    expect(getByRole('checkbox')).toBeDisabled();
    expect(getByText('Disabled')).toHaveAttribute('data-disabled');

    rerender(<Checkbox aria-label="No label" indicator={null} label={null} />);
    expect(getByRole('checkbox', { name: 'No label' })).toBeInTheDocument();
    expect(container.querySelector('.fui-Checkbox__indicator')).toBeNull();
    expect(container.querySelector('label')).toBeNull();
  });

  it('preserves Switch disabledFocusable behavior and styled label placement', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <Switch
        ref={ref}
        label="Available"
        labelPosition="before"
        disabled
        disabledFocusable
        defaultChecked
        onChange={onChange}
      />,
    );
    const input = getByRole('switch', { name: 'Available' });

    expect(ref.current).toBe(input);
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
    expect(input).toBeChecked();
    expect(input.parentElement).toHaveAttribute('data-label-position', 'before');
    expect(getByText('Available')).toHaveClass('fui-Label');
    expect(fireEvent.keyDown(input, { key: ' ' })).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toBeChecked();
  });

  it('passes horizontal-stacked layout through RadioGroup and keeps value callbacks', () => {
    const groupRef = React.createRef<HTMLDivElement>();
    const radioRef = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <Field label="Choice" required>
        <RadioGroup ref={groupRef} layout="horizontal-stacked" defaultValue="second" onChange={onChange}>
          <Radio ref={radioRef} value="first" label="First" />
          <Radio value="second" label="Second" />
        </RadioGroup>
      </Field>,
    );
    const first = getByRole('radio', { name: /First/ });
    expect(groupRef.current).toBe(getByRole('radiogroup', { name: /Choice/ }));
    expect(radioRef.current).toBe(first);
    expect(first.parentElement).toHaveAttribute('data-label-position', 'below');
    expect(getByText('First')).toHaveClass('fui-Label');
    expect(getByRole('radio', { name: /Second/ })).toBeChecked();

    fireEvent.click(first);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), { value: 'first' });
    expect(first).toBeChecked();
  });
});
