// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button as V9Button } from '@fluentui/react-button';
import { Field as V9Field } from '@fluentui/react-field';
import { Input as V9Input } from '@fluentui/react-input';
import { Button as HeadlessButton, type ButtonProps } from '@fluentui/react-headless-components-preview/button';
import { Field as HeadlessField, type FieldProps } from '@fluentui/react-headless-components-preview/field';
import { Input as HeadlessInput, type InputProps } from '@fluentui/react-headless-components-preview/input';
import { Button } from './Button';
import { Field } from './Field';
import { Input } from './Input';

type Implementation = {
  name: string;
  Button: React.ComponentType<ButtonProps>;
  Field: React.ComponentType<FieldProps>;
  Input: React.ComponentType<InputProps>;
};

const implementations: Implementation[] = [
  { name: 'stock v9', Button: V9Button, Field: V9Field, Input: V9Input },
  { name: 'public headless', Button: HeadlessButton, Field: HeadlessField, Input: HeadlessInput },
  { name: 'CSS Modules', Button, Field, Input },
];

// Semantic scenarios shared with the existing Button and Field suites, without
// their implementation-specific Griffel or composeComponent assertions.
describe.each(implementations)('$name native contracts', implementation => {
  const { Button: TestButton, Field: TestField, Input: TestInput } = implementation;

  it('keeps disabledFocusable keyboard reachable without activating it', () => {
    const onClick = jest.fn();
    render(
      <TestButton disabledFocusable onClick={onClick}>
        Action
      </TestButton>,
    );
    const button = screen.getByRole('button', { name: 'Action' });
    userEvent.tab();
    expect(button).toHaveFocus();
    userEvent.click(button);
    userEvent.keyboard('{enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('preserves anchor semantics and explicit native form submission', () => {
    const onSubmit = jest.fn(event => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <TestButton as="a" href="#destination">
          Destination
        </TestButton>
        <TestButton type="submit">Submit</TestButton>
      </form>,
    );
    expect(screen.getByRole('link', { name: 'Destination' })).toHaveAttribute('href', '#destination');
    userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('associates Field labels and errors with the actual input', () => {
    render(
      <TestField label="Name" validationState="error" validationMessage="Enter a name" required>
        <TestInput />
      </TestField>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeRequired();
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toContain(screen.getByText('Enter a name').id);
  });

  it('keeps controlled values and native form data on the input slot', () => {
    const onChange = jest.fn();
    const { rerender } = render(<TestInput aria-label="Name" name="name" value="Ada" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    fireEvent.change(input, { target: { value: 'Grace' } });
    expect(onChange).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ value: 'Grace' }));
    rerender(<TestInput aria-label="Name" name="name" value="Grace" onChange={onChange} />);
    expect(input).toHaveValue('Grace');
    expect(input).toHaveAttribute('name', 'name');
  });
});
