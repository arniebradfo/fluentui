import * as React from 'react';
import { act, fireEvent, render, within } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import {
  Calendar,
  CalendarDay,
  CalendarMonth,
  CalendarProvider,
  calendarFormatters,
  type CalendarDayHandle,
  type CalendarDayProps,
  type CalendarMonthHandle,
} from './Calendar';

const today = new Date(2026, 7, 12);

describe('styled Calendar', () => {
  it('preserves picker render functions and separate DOM and imperative refs', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const dayRef = React.createRef<HTMLDivElement>();
    const dayHandle = React.createRef<CalendarDayHandle>();
    const renderDay: SlotRenderFunction<CalendarDayProps> = (Component, props) => {
      expect(Component).toBe(CalendarDay);
      return <Component {...props} />;
    };
    const { container, getByRole } = render(
      <Calendar
        ref={rootRef}
        today={today}
        value={today}
        dayPicker={{
          ref: dayRef,
          imperativeRef: dayHandle,
          className: 'consumer-day',
          children: renderDay,
        }}
      />,
    );

    expect(rootRef.current).toBe(container.firstElementChild);
    expect(dayRef.current).toHaveClass('fui-CalendarDay', 'CalendarDay', 'consumer-day');
    expect(dayRef.current?.className.endsWith('consumer-day')).toBe(true);
    act(() => dayHandle.current?.focus());
    const selected = getByRole('button', { name: 'August 12, 2026' }).closest('td');
    expect(selected).toHaveFocus();
    expect(selected).toHaveAttribute('data-selected', '');
    expect(selected).toHaveAttribute('data-today', '');
  });

  it('keeps multi-day day-mode selection, hover and press state on the native day grid', () => {
    const onSelectDate = jest.fn();
    const { container, getByRole } = render(
      <Calendar
        today={today}
        value={today}
        monthPicker={null}
        dayPicker={{ daysToSelectInDayView: 3 }}
        onSelectDate={onSelectDate}
      />,
    );
    expect(getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    expect(container.querySelectorAll('td[data-selected]')).toHaveLength(3);

    const day = getByRole('button', { name: 'August 17, 2026' });
    fireEvent.mouseOver(day);
    fireEvent.mouseDown(day);
    expect(container.querySelectorAll('td[data-range-hovered]')).toHaveLength(3);
    expect(container.querySelectorAll('td[data-range-pressed]')).toHaveLength(3);
    fireEvent.click(day);
    expect(onSelectDate).toHaveBeenCalledTimes(1);
    expect(onSelectDate.mock.calls[0][1].selectedDateRange).toEqual([
      new Date(2026, 7, 17),
      new Date(2026, 7, 18),
      new Date(2026, 7, 19),
    ]);
  });

  it('exposes range selection on a standalone styled CalendarDay', () => {
    const { container, getByRole } = render(
      <CalendarProvider
        value={{
          allFocusable: false,
          calendarMonthColumns: 4,
          calendarYearColumns: 4,
          dateRangeType: 'week',
          firstDayOfWeek: 'sunday',
          firstWeekOfYear: 'firstDay',
          formatters: calendarFormatters,
          showWeekNumbers: false,
          today,
          value: today,
        }}
      >
        <CalendarDay navigatedDate={today} />
      </CalendarProvider>,
    );
    expect(getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    expect(container.querySelectorAll('td[data-selected]')).toHaveLength(7);
    expect(container.querySelector('.CalendarDay__body')).not.toBeNull();
  });

  it('keeps month and year highlights opt-in while preserving semantic selection', () => {
    const handle = React.createRef<CalendarMonthHandle>();
    const { container, rerender } = render(
      <Calendar today={today} value={today} monthPicker={{ imperativeRef: handle }} />,
    );
    const month = () => container.querySelector('.fui-CalendarMonth');
    expect(month()?.querySelector('[data-current][data-selected]')).not.toBeNull();
    expect(month()).not.toHaveAttribute('data-highlight-current');
    expect(month()).not.toHaveAttribute('data-highlight-selected');

    rerender(
      <Calendar
        today={today}
        value={today}
        highlightCurrentMonth
        highlightSelectedMonth
        monthPicker={{ imperativeRef: handle }}
      />,
    );
    expect(month()).toHaveAttribute('data-highlight-current', '');
    expect(month()).toHaveAttribute('data-highlight-selected', '');
    act(() => handle.current?.showYearPicker());
    const year = container.querySelector('.fui-CalendarYear');
    expect(year).toHaveAttribute('data-highlight-current', '');
    expect(year).toHaveAttribute('data-highlight-selected', '');
    expect(year?.querySelector('[data-current][data-selected]')).not.toBeNull();
  });

  it('respects nested visual overrides and caller navigation content', () => {
    const handle = React.createRef<CalendarMonthHandle>();
    const rootRef = React.createRef<HTMLDivElement>();
    const { container, getByRole } = render(
      <CalendarMonth
        ref={rootRef}
        imperativeRef={handle}
        navigatedDate={today}
        highlightCurrentMonth
        highlightSelectedMonth
        previousYearButton={{ children: null }}
        nextYearButton={{ children: 'Next year' }}
        yearPicker={{ highlightCurrentYear: false, highlightSelectedYear: false }}
      />,
    );
    expect(getByRole('button', { name: 'Previous year 2025' })).toBeEmptyDOMElement();
    expect(getByRole('button', { name: 'Next year 2027' })).toHaveTextContent('Next year');
    act(() => handle.current?.showYearPicker());
    expect(rootRef.current).toBe(container.firstElementChild);
    const year = within(rootRef.current!).getByRole('grid').parentElement;
    expect(year).toHaveClass('fui-CalendarYear', 'CalendarYear');
    expect(year).not.toHaveAttribute('data-highlight-current');
    expect(year).not.toHaveAttribute('data-highlight-selected');
  });
});
