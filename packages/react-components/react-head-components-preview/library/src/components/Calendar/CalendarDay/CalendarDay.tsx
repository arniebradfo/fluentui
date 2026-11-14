// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCalendarDay,
  useCalendarDay,
  type CalendarDayProps,
} from '@fluentui/react-headless-components-preview/calendar';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { ChevronUpRegular } from '@fluentui/react-icons/headless/svg/chevron-up';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import { compose, withDefaultIcon } from '../calendarVisual.js';
import styles from '../Calendar.module.css';

export type {
  CalendarDayCellData,
  CalendarDayHandle,
  CalendarDayProps,
  CalendarDaySlots,
  CalendarDayState,
} from '@fluentui/react-headless-components-preview/calendar';

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
