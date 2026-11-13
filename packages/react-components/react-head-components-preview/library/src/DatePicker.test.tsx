import * as React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Calendar } from './Calendar';
import { DatePicker, type DatePickerCalendarProps } from './DatePicker';
import { Field } from './Field';

const today = new Date(2026, 7, 12);

describe('styled DatePicker', () => {
  it('styles resolved Field invalidity without changing the reserved internal-error attribute', () => {
    const { container, getByRole } = render(
      <Field label="Due date" size="large" validationState="error">
        <DatePicker today={today} />
      </Field>,
    );
    const root = container.querySelector('.fui-DatePicker');
    expect(getByRole('button', { name: 'Due date Select a date' })).toHaveAttribute('aria-invalid', 'true');
    expect(root).toHaveAttribute('data-visual-invalid', '');
    expect(root).not.toHaveAttribute('data-invalid');
    expect(root).toHaveAttribute('data-size', 'large');
    expect(root).toHaveAttribute('data-appearance', 'outline');
  });

  it.each([
    [true, true],
    ['true', true],
    [false, false],
    ['false', false],
    ['grammar', false],
    ['spelling', false],
  ] as const)('maps resolved aria-invalid=%s to visual invalidity %s', (invalid, visualInvalid) => {
    const { container, getByRole } = render(
      <DatePicker allowTextInput aria-label="Due date" today={today} input={{ 'aria-invalid': invalid }} />,
    );
    const root = container.querySelector('.fui-DatePicker');
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', String(invalid));
    expect(root?.hasAttribute('data-visual-invalid')).toBe(visualInvalid);
    expect(root).not.toHaveAttribute('data-invalid');
  });

  it('uses the final control override rather than a surrounding Field error', () => {
    const { container, getByRole } = render(
      <Field label="Due date" validationState="error">
        <DatePicker allowTextInput today={today} input={{ 'aria-invalid': 'spelling' }} />
      </Field>,
    );
    expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'spelling');
    expect(container.querySelector('.fui-DatePicker')).not.toHaveAttribute('data-visual-invalid');
  });

  it('preserves editable input refs and internal validation callbacks', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onValidationResult = jest.fn();
    const { container, getByRole } = render(
      <DatePicker
        allowTextInput
        ref={ref}
        aria-label="Due date"
        today={today}
        onValidationResult={onValidationResult}
      />,
    );
    const input = getByRole('textbox');
    expect(ref.current).toBe(input);
    fireEvent.change(input, { target: { value: 'not a date' } });
    fireEvent.blur(input);
    expect(onValidationResult).toHaveBeenCalledTimes(1);
    expect(onValidationResult.mock.calls[0][1]).toMatchObject({ error: 'invalid-input' });
    expect(container.querySelector('.fui-DatePicker')).toHaveAttribute('data-invalid', '');
    expect(container.querySelector('.fui-DatePicker')).toHaveAttribute('data-visual-invalid', '');
  });

  it('keeps styled calendar render functions and native selection/focus behavior', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onDateChange = jest.fn();
    const onOpenChange = jest.fn();
    const renderCalendar: SlotRenderFunction<DatePickerCalendarProps> = (Component, props) => {
      expect(Component).toBe(Calendar);
      return <Component {...props} />;
    };
    const { container, getByRole, queryByRole } = render(
      <DatePicker
        ref={ref}
        today={today}
        aria-label="Due date"
        calendar={{ children: renderCalendar }}
        onDateChange={onDateChange}
        onOpenChange={onOpenChange}
        icon={null}
      />,
    );
    const trigger = getByRole('button', { name: 'Due date Select a date' });
    expect(ref.current).toBe(trigger);
    expect(container.querySelector('.fui-DatePicker__icon')).toBeNull();
    fireEvent.click(trigger);
    const dialog = getByRole('dialog');
    expect(dialog.querySelector('.Calendar')).not.toBeNull();
    const todayCell = within(dialog).getByRole('button', { name: 'August 12, 2026' }).closest('td');
    await waitFor(() => expect(todayCell).toHaveFocus());
    fireEvent.click(within(dialog).getByRole('button', { name: 'August 24, 2026' }));
    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange.mock.calls[0][1]).toMatchObject({ reason: 'calendar', value: new Date(2026, 7, 24) });
    expect(onOpenChange.mock.calls.map(call => call[1].reason)).toEqual(['trigger', 'selection']);
    expect(queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
