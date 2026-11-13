// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCalendar,
  renderCalendarDay,
  renderCalendarMonth,
  renderCalendarYear,
  useCalendar,
  useCalendarContextValues,
  useCalendarDay,
  useCalendarMonth,
  useCalendarYear,
  type CalendarDayProps,
  type CalendarMonthProps as HeadlessCalendarMonthProps,
  type CalendarProps as HeadlessCalendarProps,
  type CalendarYearProps as HeadlessCalendarYearProps,
} from '@fluentui/react-headless-components-preview/calendar';
import { slot, type ForwardRefComponent, type Slot } from '@fluentui/react-utilities';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { ChevronUpRegular } from '@fluentui/react-icons/headless/svg/chevron-up';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import styles from './Calendar.module.css';

export {
  CalendarProvider,
  calendarFormatters,
  createCalendarDateTimeFormatter,
  useCalendarContext,
} from '@fluentui/react-headless-components-preview/calendar';
export type {
  CalendarDayCellData,
  CalendarDayHandle,
  CalendarDayProps,
  CalendarDaySlots,
  CalendarDayState,
  CalendarFormatters,
  CalendarLayout,
  CalendarMonthHandle,
  CalendarMonthSlots,
  CalendarMonthState,
  CalendarNavigateData,
  CalendarSelectDateData,
  CalendarSlots,
  CalendarState,
  CalendarView,
  CalendarViewChangeData,
  CalendarYearHandle,
  CalendarYearSlots,
  CalendarYearState,
  DateRangeType,
  DayOfWeek,
  FirstWeekOfYear,
} from '@fluentui/react-headless-components-preview/calendar';

type CalendarMonthVisualProps = {
  /** Highlight today's month, and today's year in the nested year picker. @default false */
  highlightCurrentMonth?: boolean;
  /** Highlight the selected month, and selected year in the nested year picker. @default false */
  highlightSelectedMonth?: boolean;
};

export type CalendarYearProps = HeadlessCalendarYearProps & {
  /** Highlight today's year. @default false */
  highlightCurrentYear?: boolean;
  /** Highlight the selected year. @default false */
  highlightSelectedYear?: boolean;
};

export type CalendarMonthProps = Omit<HeadlessCalendarMonthProps, 'yearPicker'> &
  CalendarMonthVisualProps & {
    yearPicker?: NonNullable<Slot<typeof CalendarYear>>;
  };

export type CalendarProps = Omit<HeadlessCalendarProps, 'monthPicker'> &
  CalendarMonthVisualProps & {
    monthPicker?: Slot<typeof CalendarMonth>;
  };

type CalendarVisualContextValue = {
  highlightCurrent: boolean;
  highlightSelected: boolean;
};

const CalendarVisualContext = React.createContext<CalendarVisualContextValue | undefined>(undefined);

export const calendarClassNames = {
  root: 'fui-Calendar',
  liveRegion: 'fui-Calendar__liveRegion',
  divider: 'fui-Calendar__divider',
  monthPickerWrapper: 'fui-Calendar__monthPickerWrapper',
  goToTodayButton: 'fui-Calendar__goToTodayButton',
} as const;

export const calendarDayClassNames = {
  root: 'fui-CalendarDay',
  header: 'fui-CalendarDay__header',
  heading: 'fui-CalendarDay__heading',
  navigation: 'fui-CalendarDay__navigation',
  previousMonthButton: 'fui-CalendarDay__previousMonthButton',
  nextMonthButton: 'fui-CalendarDay__nextMonthButton',
  closeButton: 'fui-CalendarDay__closeButton',
  grid: 'fui-CalendarDay__grid',
  body: 'fui-CalendarDay__body',
} as const;

export const calendarMonthClassNames = {
  root: 'fui-CalendarMonth',
  header: 'fui-CalendarMonth__header',
  heading: 'fui-CalendarMonth__heading',
  navigation: 'fui-CalendarMonth__navigation',
  previousYearButton: 'fui-CalendarMonth__previousYearButton',
  nextYearButton: 'fui-CalendarMonth__nextYearButton',
  grid: 'fui-CalendarMonth__grid',
} as const;

export const calendarYearClassNames = {
  root: 'fui-CalendarYear',
  header: 'fui-CalendarYear__header',
  heading: 'fui-CalendarYear__heading',
  navigation: 'fui-CalendarYear__navigation',
  previousRangeButton: 'fui-CalendarYear__previousRangeButton',
  nextRangeButton: 'fui-CalendarYear__nextRangeButton',
  grid: 'fui-CalendarYear__grid',
} as const;

type ClassNameSlot = { className?: string; children?: React.ReactNode } | null | undefined;

function compose(slotProps: ClassNameSlot, ...classNames: (string | false | undefined)[]) {
  if (slotProps) {
    slotProps.className = [...classNames, slotProps.className].filter(Boolean).join(' ');
  }
}

// Upstream navigation buttons are unlabeled visually; supply the v9 glyph only when consumers did not.
function withDefaultIcon(slotProps: ClassNameSlot, icon: React.ReactNode) {
  if (slotProps && slotProps.children === undefined) {
    slotProps.children = icon;
  }
}

export const CalendarYear: ForwardRefComponent<CalendarYearProps> = React.forwardRef<HTMLDivElement, CalendarYearProps>(
  ({ highlightCurrentYear, highlightSelectedYear, ...props }, ref) => {
    const visual = React.useContext(CalendarVisualContext);
    const state = useCalendarYear(props, ref);

    Object.assign(state.root, {
      'data-highlight-current': highlightCurrentYear ?? visual?.highlightCurrent ?? false ? '' : undefined,
      'data-highlight-selected': highlightSelectedYear ?? visual?.highlightSelected ?? false ? '' : undefined,
    });
    compose(state.root, calendarYearClassNames.root, styles.CalendarPicker, styles.CalendarYear);
    compose(state.header, calendarYearClassNames.header, styles.CalendarPicker__header);
    compose(state.heading, calendarYearClassNames.heading, styles.CalendarPicker__heading);
    compose(state.navigation, calendarYearClassNames.navigation, styles.CalendarPicker__navigation);
    compose(
      state.previousRangeButton,
      calendarYearClassNames.previousRangeButton,
      styles.CalendarPicker__navigationButton,
    );
    compose(state.nextRangeButton, calendarYearClassNames.nextRangeButton, styles.CalendarPicker__navigationButton);
    compose(state.grid, calendarYearClassNames.grid, styles.CalendarPicker__grid);
    withDefaultIcon(state.previousRangeButton, <ChevronUpRegular aria-hidden />);
    withDefaultIcon(state.nextRangeButton, <ChevronDownRegular aria-hidden />);

    return renderCalendarYear(state);
  },
);

CalendarYear.displayName = 'CalendarYear';

export const CalendarMonth: ForwardRefComponent<CalendarMonthProps> = React.forwardRef<
  HTMLDivElement,
  CalendarMonthProps
>(({ highlightCurrentMonth, highlightSelectedMonth, ...props }, ref) => {
  const inheritedVisual = React.useContext(CalendarVisualContext);
  const visual = {
    highlightCurrent: highlightCurrentMonth ?? inheritedVisual?.highlightCurrent ?? false,
    highlightSelected: highlightSelectedMonth ?? inheritedVisual?.highlightSelected ?? false,
  };
  const state = useCalendarMonth(props, ref);

  Object.assign(state.root, {
    'data-highlight-current': visual.highlightCurrent ? '' : undefined,
    'data-highlight-selected': visual.highlightSelected ? '' : undefined,
  });
  compose(state.root, calendarMonthClassNames.root, styles.CalendarPicker);
  compose(state.header, calendarMonthClassNames.header, styles.CalendarPicker__header);
  compose(state.heading, calendarMonthClassNames.heading, styles.CalendarPicker__heading);
  compose(state.navigation, calendarMonthClassNames.navigation, styles.CalendarPicker__navigation);
  compose(
    state.previousYearButton,
    calendarMonthClassNames.previousYearButton,
    styles.CalendarPicker__navigationButton,
  );
  compose(state.nextYearButton, calendarMonthClassNames.nextYearButton, styles.CalendarPicker__navigationButton);
  compose(state.grid, calendarMonthClassNames.grid, styles.CalendarPicker__grid);
  withDefaultIcon(state.previousYearButton, <ChevronUpRegular aria-hidden />);
  withDefaultIcon(state.nextYearButton, <ChevronDownRegular aria-hidden />);
  // Re-resolving an existing slot preserves its render function, handlers and imperative ref.
  state.yearPicker = slot.always(state.yearPicker, { elementType: CalendarYear });
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Current public assertSlots requires matching component metadata.
  state.components.yearPicker = CalendarYear;

  return <CalendarVisualContext.Provider value={visual}>{renderCalendarMonth(state)}</CalendarVisualContext.Provider>;
});

CalendarMonth.displayName = 'CalendarMonth';

export const CalendarDay: ForwardRefComponent<CalendarDayProps> = React.forwardRef<HTMLDivElement, CalendarDayProps>(
  (props, ref) => {
    const state = useCalendarDay(props, ref);

    compose(state.root, calendarDayClassNames.root, styles.CalendarDay);
    compose(state.header, calendarDayClassNames.header, styles.CalendarDay__header);
    compose(state.heading, calendarDayClassNames.heading, styles.CalendarDay__heading);
    compose(state.navigation, calendarDayClassNames.navigation, styles.CalendarDay__navigation);
    compose(state.previousMonthButton, calendarDayClassNames.previousMonthButton, styles.CalendarDay__navigationButton);
    compose(state.nextMonthButton, calendarDayClassNames.nextMonthButton, styles.CalendarDay__navigationButton);
    compose(state.closeButton, calendarDayClassNames.closeButton, styles.CalendarDay__navigationButton);
    compose(state.grid, calendarDayClassNames.grid, styles.CalendarDay__grid);
    compose(state.body, calendarDayClassNames.body, styles.CalendarDay__body);
    withDefaultIcon(state.previousMonthButton, <ChevronUpRegular aria-hidden />);
    withDefaultIcon(state.nextMonthButton, <ChevronDownRegular aria-hidden />);
    withDefaultIcon(state.closeButton, <DismissRegular aria-hidden />);

    return renderCalendarDay(state);
  },
);

CalendarDay.displayName = 'CalendarDay';

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
