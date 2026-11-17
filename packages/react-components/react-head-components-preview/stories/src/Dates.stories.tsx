import * as React from 'react';
import { Calendar as StockCalendar, DateRangeType } from '@fluentui/react-calendar-compat';
import { DatePicker as StockDatePicker } from '@fluentui/react-datepicker-compat';
import { FluentProvider as StockProvider } from '@fluentui/react-components';
import { Calendar, DatePicker, Field, FluentProvider, Text, tokens, webLightTheme } from '../../library/src';

export default {
  title: 'CSS Modules/Calendar and date picker',
  parameters: {
    docs: {
      description: {
        component:
          'Candidate examples use the new calendar and date picker event data and slot API. Focused comparison fixtures render current stock compat controls separately as the style oracle. Reference dates are fixed. DatePicker uses a native anchored popup.',
      },
    },
  },
};

const referenceDate = new Date(2026, 10, 13);
const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacingVerticalM,
};

export const CalendarSelection = () => {
  const [value, setValue] = React.useState<Date | null>(referenceDate);
  return (
    <div style={stack}>
      <Calendar
        aria-label="Choose a project date"
        today={referenceDate}
        value={value}
        onSelectDate={(_, data) => setValue(data.date)}
        showWeekNumbers
      />
      <Text role="status">Selected: {value?.toLocaleDateString('en-US') ?? 'No date selected'}</Text>
    </div>
  );
};

export const CalendarOverlayLayout = () => (
  <Calendar
    aria-label="Calendar with an overlay month picker"
    today={referenceDate}
    defaultValue={referenceDate}
    layout="overlay"
    highlightCurrentMonth
    highlightSelectedMonth
  />
);

export const DatePickerButton = () => {
  const [value, setValue] = React.useState<Date | null>(null);
  return (
    <div style={stack}>
      <Field label="Project date">
        <DatePicker
          today={referenceDate}
          value={value}
          placeholder="Choose a project date"
          onDateChange={(_, data) => setValue(data.value)}
        />
      </Field>
      <Text role="status">Selected: {value?.toLocaleDateString('en-US') ?? 'No date selected'}</Text>
    </div>
  );
};

export const DatePickerTextInput = () => (
  <Field label="November project date" hint="Type a date in November 2026, for example 11/13/2026.">
    <DatePicker
      allowTextInput
      today={referenceDate}
      defaultValue={referenceDate}
      minDate={new Date(2026, 10, 1)}
      maxDate={new Date(2026, 10, 30)}
    />
  </Field>
);

const comparisonLayout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, max-content)',
};
const comparisonPanel: React.CSSProperties = {
  ...stack,
  padding: tokens.spacingVerticalL,
};
const datePickerGapCases = [
  { id: 'medium-button', size: 'medium', editable: false },
  { id: 'large-button', size: 'large', editable: false },
  { id: 'large-editable', size: 'large', editable: true },
] as const;

export const DatePickerGapComparison = () => (
  <div style={comparisonLayout}>
    <StockProvider theme={webLightTheme} dir="ltr" style={comparisonPanel} data-testid="stock-date-gaps">
      {datePickerGapCases.map(({ id, size, editable }) => (
        <div key={id} data-testid={id}>
          <StockDatePicker
            aria-label={id}
            today={referenceDate}
            value={referenceDate}
            open={false}
            size={size}
            allowTextInput={editable}
          />
        </div>
      ))}
    </StockProvider>
    <FluentProvider theme={webLightTheme} dir="ltr" style={comparisonPanel} data-testid="candidate-date-gaps">
      {datePickerGapCases.map(({ id, size, editable }) => {
        const props = { 'aria-label': id, today: referenceDate, value: referenceDate, open: false, size };
        return (
          <div key={id} data-testid={id}>
            {editable ? <DatePicker {...props} allowTextInput /> : <DatePicker {...props} />}
          </div>
        );
      })}
    </FluentProvider>
  </div>
);

const calendarToday = new Date(2026, 7, 12);
const calendarValue = new Date(2026, 7, 14);
const markedDays = [new Date(2026, 7, 7), calendarToday, calendarValue];
const restrictedDays = [new Date(2026, 6, 29)];
const calendarMinimum = new Date(2026, 6, 27);
const calendarMaximum = new Date(2026, 7, 31);
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const CalendarStateComparison = () => {
  const [range, setRange] = React.useState(false);
  const [allFocusable, setAllFocusable] = React.useState(false);
  return (
    <div style={stack}>
      <label>
        <input type="checkbox" checked={range} onChange={event => setRange(event.currentTarget.checked)} />
        Select a week
      </label>
      <label>
        <input
          type="checkbox"
          checked={allFocusable}
          onChange={event => setAllFocusable(event.currentTarget.checked)}
        />
        Allow unavailable date focus
      </label>
      <div style={comparisonLayout}>
        <StockProvider theme={webLightTheme} dir="ltr" style={comparisonPanel} data-testid="stock-calendar-states">
          {/* Stock root allFocusable reaches days; months require the public override bag. */}
          <StockCalendar
            key={String(range)}
            today={calendarToday}
            value={calendarValue}
            minDate={calendarMinimum}
            maxDate={calendarMaximum}
            restrictedDates={restrictedDays}
            dateRangeType={range ? DateRangeType.Week : DateRangeType.Day}
            allFocusable={allFocusable}
            calendarMonthProps={{ allFocusable }}
            highlightCurrentMonth
            highlightSelectedMonth
            calendarDayProps={{
              getMarkedDays: () => markedDays,
              customDayCellRef: (element, date) => {
                if (element) {
                  element.setAttribute('data-calendar-date', dateKey(date));
                }
              },
            }}
          />
        </StockProvider>
        <FluentProvider theme={webLightTheme} dir="ltr" style={comparisonPanel} data-testid="candidate-calendar-states">
          <Calendar
            key={String(range)}
            today={calendarToday}
            value={calendarValue}
            minDate={calendarMinimum}
            maxDate={calendarMaximum}
            restrictedDates={restrictedDays}
            dateRangeType={range ? 'week' : 'day'}
            allFocusable={allFocusable}
            calendarMonthColumns={4}
            calendarYearColumns={4}
            highlightCurrentMonth
            highlightSelectedMonth
            dayPicker={{
              getMarkedDays: () => markedDays,
              getCellProps: day => ({
                root: {
                  'aria-label': day.originalDate ? dateKey(day.originalDate) : day.date,
                  'data-calendar-date': day.originalDate ? dateKey(day.originalDate) : undefined,
                },
              }),
            }}
          />
        </FluentProvider>
      </div>
    </div>
  );
};

const calendarGeometryCases = {
  'five-week-side-by-side': { value: new Date(2026, 10, 13), overlay: false },
  'six-week-side-by-side': { value: new Date(2026, 7, 13), overlay: false },
  'five-week-overlay': { value: new Date(2026, 10, 13), overlay: true },
  'six-week-overlay': { value: new Date(2026, 7, 13), overlay: true },
} as const;

export const CalendarGeometryComparison = () => {
  const [fixture, setFixture] = React.useState<keyof typeof calendarGeometryCases>('five-week-side-by-side');
  const { value, overlay } = calendarGeometryCases[fixture];
  return (
    <div style={stack} data-geometry-case={fixture}>
      <label>
        Calendar geometry case
        <select
          value={fixture}
          onChange={event => setFixture(event.currentTarget.value as keyof typeof calendarGeometryCases)}
        >
          {Object.keys(calendarGeometryCases).map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <div style={comparisonLayout}>
        <StockProvider theme={webLightTheme} dir="ltr" style={comparisonPanel} data-testid="stock-calendar-geometry">
          <StockCalendar
            key={fixture}
            today={referenceDate}
            value={value}
            showSixWeeksByDefault={false}
            showMonthPickerAsOverlay={overlay}
            showGoToToday
          />
        </StockProvider>
        <FluentProvider
          theme={webLightTheme}
          dir="ltr"
          style={comparisonPanel}
          data-testid="candidate-calendar-geometry"
        >
          <Calendar
            key={fixture}
            today={referenceDate}
            value={value}
            layout={overlay ? 'overlay' : 'sideBySide'}
            calendarMonthColumns={4}
            calendarYearColumns={4}
          />
        </FluentProvider>
      </div>
    </div>
  );
};
