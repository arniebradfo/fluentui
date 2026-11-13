import * as React from 'react';
import { Calendar, DatePicker, Field, Text, tokens } from '../../library/src';

export default {
  title: 'CSS Modules/Calendar and date picker',
  parameters: {
    docs: {
      description: {
        component:
          'Candidate-only examples use the new calendar and date picker event data and slot API, not the old compat controls. The reference date is fixed for visual checks. DatePicker uses a native anchored popup.',
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
