// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderDatePicker,
  useDatePicker,
  type DatePickerButtonProps as HeadlessDatePickerButtonProps,
  type DatePickerInputProps as HeadlessDatePickerInputProps,
  type DatePickerCalendarProps as HeadlessDatePickerCalendarProps,
} from '@fluentui/react-headless-components-preview/date-picker';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import { CalendarMonthRegular } from '@fluentui/react-icons/headless/svg/calendar-month';
import { slot, type ForwardRefComponent, type Slot } from '@fluentui/react-utilities';
import { Calendar, type CalendarProps } from './Calendar.js';
import styles from './DatePicker.module.css';

export { defaultFormatDate, defaultParseDate } from '@fluentui/react-headless-components-preview/date-picker';
export type {
  DatePickerDateChangeData,
  DatePickerErrorMessageData,
  DatePickerErrorType,
  DatePickerOpenChangeData,
  DatePickerSlots,
  DatePickerState,
  DatePickerValidationResultData,
} from '@fluentui/react-headless-components-preview/date-picker';

export const datePickerClassNames = {
  root: 'fui-DatePicker',
  input: 'fui-DatePicker__input',
  trigger: 'fui-DatePicker__trigger',
  displayValue: 'fui-DatePicker__displayValue',
  icon: 'fui-DatePicker__icon',
  errorMessage: 'fui-DatePicker__errorMessage',
  popupSurface: 'fui-DatePicker__popupSurface',
  calendar: 'fui-DatePicker__calendar',
} as const;

type DatePickerVisualProps = {
  /** Field chrome, matching Input. @default 'outline' */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  /** Inherits Field size when omitted. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export type DatePickerCalendarProps = Omit<HeadlessDatePickerCalendarProps, 'monthPicker'> &
  Pick<CalendarProps, 'monthPicker' | 'highlightCurrentMonth' | 'highlightSelectedMonth'>;

type DatePickerStyledCalendar = { calendar?: NonNullable<Slot<DatePickerCalendarProps>> };
export type DatePickerButtonProps = Omit<HeadlessDatePickerButtonProps, 'calendar'> &
  DatePickerStyledCalendar &
  DatePickerVisualProps;
export type DatePickerInputProps = Omit<HeadlessDatePickerInputProps, 'calendar'> &
  DatePickerStyledCalendar &
  DatePickerVisualProps;
export type DatePickerProps = DatePickerButtonProps | DatePickerInputProps;

/** The ref targets the field control: a button by default, or the input with `allowTextInput`. */
export type DatePickerComponent = React.NamedExoticComponent<
  | React.ComponentProps<ForwardRefComponent<DatePickerButtonProps>>
  | React.ComponentProps<ForwardRefComponent<DatePickerInputProps>>
>;

export const DatePicker: DatePickerComponent = React.forwardRef<HTMLButtonElement | HTMLInputElement, DatePickerProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const field = useFieldContext();
    const size = sizeProp ?? field?.size ?? 'medium';
    const state = useDatePicker(props, ref);
    const invalid = (state.input ?? state.trigger)?.['aria-invalid'];

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-visual-invalid': invalid === true || invalid === 'true' ? '' : undefined,
    });
    state.root.className = [datePickerClassNames.root, styles.DatePicker, state.root.className]
      .filter(Boolean)
      .join(' ');
    if (state.input) {
      state.input.className = [datePickerClassNames.input, styles.DatePicker__input, state.input.className]
        .filter(Boolean)
        .join(' ');
    }
    if (state.trigger) {
      state.trigger.className = [datePickerClassNames.trigger, styles.DatePicker__trigger, state.trigger.className]
        .filter(Boolean)
        .join(' ');
    }
    state.displayValue.className = [
      datePickerClassNames.displayValue,
      styles.DatePicker__displayValue,
      state.displayValue.className,
    ]
      .filter(Boolean)
      .join(' ');
    if (state.icon) {
      state.icon.className = [datePickerClassNames.icon, styles.DatePicker__icon, state.icon.className]
        .filter(Boolean)
        .join(' ');
      if (state.icon.children === undefined) {
        state.icon.children = <CalendarMonthRegular />;
      }
    }
    if (state.errorMessage) {
      state.errorMessage.className = [
        datePickerClassNames.errorMessage,
        styles.DatePicker__errorMessage,
        state.errorMessage.className,
      ]
        .filter(Boolean)
        .join(' ');
    }
    state.popupSurface.className = [
      datePickerClassNames.popupSurface,
      styles.DatePicker__popupSurface,
      state.popupSurface.className,
    ]
      .filter(Boolean)
      .join(' ');
    state.calendar.className = [datePickerClassNames.calendar, state.calendar.className].filter(Boolean).join(' ');
    state.calendar = slot.always(state.calendar, { elementType: Calendar });
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Current public assertSlots requires matching component metadata.
    state.components.calendar = Calendar;

    return renderDatePicker(state);
  },
);

DatePicker.displayName = 'DatePicker';
