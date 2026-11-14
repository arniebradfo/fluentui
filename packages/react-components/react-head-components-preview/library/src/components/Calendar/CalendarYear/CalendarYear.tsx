// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCalendarYear,
  useCalendarYear,
  type CalendarYearProps as HeadlessCalendarYearProps,
} from '@fluentui/react-headless-components-preview/calendar';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { ChevronUpRegular } from '@fluentui/react-icons/headless/svg/chevron-up';
import { CalendarVisualContext, compose, withDefaultIcon } from '../calendarVisual.js';
import styles from '../Calendar.module.css';

export type {
  CalendarYearHandle,
  CalendarYearSlots,
  CalendarYearState,
} from '@fluentui/react-headless-components-preview/calendar';

export type CalendarYearProps = HeadlessCalendarYearProps & {
  /** Highlight today's year. @default false */
  highlightCurrentYear?: boolean;
  /** Highlight the selected year. @default false */
  highlightSelectedYear?: boolean;
};

export const calendarYearClassNames = {
  root: 'fui-CalendarYear',
  header: 'fui-CalendarYear__header',
  heading: 'fui-CalendarYear__heading',
  navigation: 'fui-CalendarYear__navigation',
  previousRangeButton: 'fui-CalendarYear__previousRangeButton',
  nextRangeButton: 'fui-CalendarYear__nextRangeButton',
  grid: 'fui-CalendarYear__grid',
} as const;

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
