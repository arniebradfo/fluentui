'use client';

import * as React from 'react';
import {
  renderCalendarMonth,
  useCalendarMonth,
  type CalendarMonthProps as HeadlessCalendarMonthProps,
} from '@fluentui/react-headless-components-preview/calendar';
import { slot, type ForwardRefComponent, type Slot } from '@fluentui/react-utilities';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { ChevronUpRegular } from '@fluentui/react-icons/headless/svg/chevron-up';
import { CalendarYear } from '../CalendarYear/CalendarYear.js';
import { CalendarVisualContext, compose, withDefaultIcon, type CalendarMonthVisualProps } from '../calendarVisual.js';
import styles from '../Calendar.module.css';

export type {
  CalendarMonthHandle,
  CalendarMonthSlots,
  CalendarMonthState,
} from '@fluentui/react-headless-components-preview/calendar';

export type CalendarMonthProps = Omit<HeadlessCalendarMonthProps, 'yearPicker'> &
  CalendarMonthVisualProps & {
    yearPicker?: NonNullable<Slot<typeof CalendarYear>>;
  };

export const calendarMonthClassNames = {
  root: 'fui-CalendarMonth',
  header: 'fui-CalendarMonth__header',
  heading: 'fui-CalendarMonth__heading',
  navigation: 'fui-CalendarMonth__navigation',
  previousYearButton: 'fui-CalendarMonth__previousYearButton',
  nextYearButton: 'fui-CalendarMonth__nextYearButton',
  grid: 'fui-CalendarMonth__grid',
} as const;

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
