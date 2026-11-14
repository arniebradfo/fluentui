// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCalendar,
  useCalendar,
  useCalendarContextValues,
  type CalendarProps as HeadlessCalendarProps,
} from '@fluentui/react-headless-components-preview/calendar';
import { slot, type ForwardRefComponent, type Slot } from '@fluentui/react-utilities';
import { CalendarDay } from './CalendarDay/CalendarDay.js';
import { CalendarMonth } from './CalendarMonth/CalendarMonth.js';
import { CalendarVisualContext, compose, type CalendarMonthVisualProps } from './calendarVisual.js';
import styles from './Calendar.module.css';

export {
  CalendarProvider,
  calendarFormatters,
  createCalendarDateTimeFormatter,
  useCalendarContext,
} from '@fluentui/react-headless-components-preview/calendar';
export type {
  CalendarFormatters,
  CalendarLayout,
  CalendarNavigateData,
  CalendarSelectDateData,
  CalendarSlots,
  CalendarState,
  CalendarView,
  CalendarViewChangeData,
  DateRangeType,
  DayOfWeek,
  FirstWeekOfYear,
} from '@fluentui/react-headless-components-preview/calendar';

export type CalendarProps = Omit<HeadlessCalendarProps, 'monthPicker'> &
  CalendarMonthVisualProps & {
    monthPicker?: Slot<typeof CalendarMonth>;
  };

export const calendarClassNames = {
  root: 'fui-Calendar',
  liveRegion: 'fui-Calendar__liveRegion',
  divider: 'fui-Calendar__divider',
  monthPickerWrapper: 'fui-Calendar__monthPickerWrapper',
  goToTodayButton: 'fui-Calendar__goToTodayButton',
} as const;

export const Calendar: ForwardRefComponent<CalendarProps> = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ highlightCurrentMonth = false, highlightSelectedMonth = false, ...props }, ref) => {
    const state = useCalendar(props, ref);
    const contextValues = useCalendarContextValues(state);

    Object.assign(state.root, {
      'data-side-by-side': state.isDayPickerVisible && state.dayPicker && state.isMonthPickerVisible ? '' : undefined,
    });
    compose(state.root, calendarClassNames.root, styles.Calendar);
    compose(state.liveRegion, calendarClassNames.liveRegion, styles.Calendar__liveRegion);
    compose(state.divider, calendarClassNames.divider, styles.Calendar__divider);
    compose(state.monthPickerWrapper, calendarClassNames.monthPickerWrapper, styles.Calendar__monthPickerWrapper);
    compose(state.goToTodayButton, calendarClassNames.goToTodayButton, styles.Calendar__goToTodayButton);
    if (state.dayPicker) {
      state.dayPicker = slot.always(state.dayPicker, { elementType: CalendarDay });
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- Current public assertSlots requires matching component metadata.
      state.components.dayPicker = CalendarDay;
    }
    if (state.monthPicker) {
      state.monthPicker = slot.always(state.monthPicker, { elementType: CalendarMonth });
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- Current public assertSlots requires matching component metadata.
      state.components.monthPicker = CalendarMonth;
    }

    return (
      <CalendarVisualContext.Provider
        value={{ highlightCurrent: highlightCurrentMonth, highlightSelected: highlightSelectedMonth }}
      >
        {renderCalendar(state, contextValues)}
      </CalendarVisualContext.Provider>
    );
  },
);

Calendar.displayName = 'Calendar';
