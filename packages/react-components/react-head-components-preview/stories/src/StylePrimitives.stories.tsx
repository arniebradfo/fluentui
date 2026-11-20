import * as React from 'react';
import { TagRegular } from '@fluentui/react-icons';
import {
  AlphaSlider,
  Avatar,
  Checkbox,
  ColorArea,
  ColorSlider,
  Combobox,
  DatePicker,
  Dropdown,
  Field,
  FluentProvider,
  Input,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  Option,
  Radio,
  RadioGroup,
  Rating,
  RatingDisplay,
  SearchBox,
  Select,
  SpinButton,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Textarea,
  tokens,
  webLightTheme,
  type TagPickerAppearance,
} from '../../library/src';

export default { title: 'CSS Modules/Style primitives' };

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacingVerticalS,
};
const examples: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
};

function Review({ title, instructions, children }: React.PropsWithChildren<{ title: string; instructions: string }>) {
  return (
    <div style={{ ...stack, gap: tokens.spacingVerticalL }}>
      <header>
        <h1 style={{ margin: 0, fontSize: tokens.fontSizeBase600, lineHeight: tokens.lineHeightBase600 }}>{title}</h1>
        <p style={{ marginBlock: `${tokens.spacingVerticalS} 0` }}>{instructions}</p>
      </header>
      <div style={examples}>{children}</div>
    </div>
  );
}

function ExampleGroup({ label, children }: React.PropsWithChildren<{ label: string }>) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} style={stack}>
      <h2 id={headingId} style={{ margin: 0, fontSize: tokens.fontSizeBase400, lineHeight: tokens.lineHeightBase400 }}>
        {label}
      </h2>
      {children}
    </section>
  );
}

const fruit = ['Apple', 'Pear', 'Plum'];
const options = fruit.map(name => <Option key={name}>{name}</Option>);
const nativeOptions = fruit.map(name => <option key={name}>{name}</option>);
const referenceDate = new Date(2026, 10, 13);

function FruitTagPicker({
  label,
  appearance,
  disabled,
  invalid,
}: {
  label: string;
  appearance?: TagPickerAppearance;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const [selected, setSelected] = React.useState<string[]>(['Apple']);

  return (
    <Field label={label} validationState={invalid ? 'error' : undefined}>
      <TagPicker
        appearance={appearance}
        disabled={disabled}
        selectedOptions={selected}
        onOptionSelect={(_, data) => setSelected(data.selectedOptions)}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected fruit">
            {selected.map(name => (
              <Tag key={name} value={name}>
                {name}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput aria-label={label} />
        </TagPickerControl>
        <TagPickerList>
          {fruit
            .filter(name => !selected.includes(name))
            .map(name => (
              <TagPickerOption key={name} value={name}>
                {name}
              </TagPickerOption>
            ))}
        </TagPickerList>
      </TagPicker>
    </Field>
  );
}

export const FieldFocus = () => (
  <Review
    title="Field focus"
    instructions="Tab through the fields to compare their focus lines. Focus the Dropdown clear button, compare the Select corners, and drag the Textarea resize handle."
  >
    <ExampleGroup label="Text and number fields">
      <Field label="Input">
        <Input defaultValue="Text input" />
      </Field>
      <Field label="SearchBox">
        <SearchBox defaultValue="Search terms" />
      </Field>
      <Field label="SpinButton">
        <SpinButton defaultValue={5} />
      </Field>
    </ExampleGroup>
    <ExampleGroup label="Choice fields">
      <Field label="Combobox">
        <Combobox placeholder="Choose a fruit">{options}</Combobox>
      </Field>
      <Field label="Dropdown with clear button">
        <Dropdown clearable defaultValue="Apple" defaultSelectedOptions={['Apple']}>
          {options}
        </Dropdown>
      </Field>
      <FruitTagPicker label="TagPicker" />
    </ExampleGroup>
    <ExampleGroup label="Native Select">
      <Field label="Select with rounded corners">
        <Select>{nativeOptions}</Select>
      </Field>
      <FluentProvider theme={{ borderRadiusMedium: webLightTheme.borderRadiusNone }}>
        <Field label="Select with square corners">
          <Select>{nativeOptions}</Select>
        </Field>
      </FluentProvider>
    </ExampleGroup>
    <ExampleGroup label="Textarea and DatePicker">
      <Field label="Resizable Textarea">
        <Textarea resize="both" defaultValue="Focus and resize" />
      </Field>
      <Field label="Disabled Textarea">
        <Textarea disabled defaultValue="Skipped when tabbing" />
      </Field>
      <Field label="DatePicker button">
        <DatePicker today={referenceDate} defaultValue={referenceDate} />
      </Field>
      <Field label="Editable DatePicker">
        <DatePicker allowTextInput today={referenceDate} defaultValue={referenceDate} />
      </Field>
    </ExampleGroup>
  </Review>
);

export const FocusRing = () => (
  <Review
    title="Focus ring"
    instructions="Tab to compare the keyboard focus rings. Press Space to toggle a checkbox, or use the arrow keys to change the radio choice or rating."
  >
    <ExampleGroup label="Checkbox">
      <Checkbox label="Unchecked" />
      <Checkbox label="Mixed" defaultChecked="mixed" />
      <Checkbox label="Disabled" disabled />
    </ExampleGroup>
    <ExampleGroup label="Radio">
      <RadioGroup aria-label="Radio choices" defaultValue="first">
        <Radio value="first" label="First choice" />
        <Radio value="second" label="Second choice" />
        <Radio value="disabled" label="Disabled choice" disabled />
      </RadioGroup>
    </ExampleGroup>
    <ExampleGroup label="RatingItem">
      <Rating aria-label="Interactive rating" defaultValue={2.5} step={0.5} />
      <RatingDisplay value={2.5} />
      <span>The read-only rating is not a Tab stop.</span>
    </ExampleGroup>
  </Review>
);

const pickerStates: { label: string; appearance: TagPickerAppearance; invalid?: boolean; disabled?: boolean }[] = [
  { label: 'Outline', appearance: 'outline' },
  { label: 'Underline', appearance: 'underline' },
  { label: 'Filled lighter', appearance: 'filled-lighter' },
  { label: 'Filled darker', appearance: 'filled-darker' },
  { label: 'Invalid', appearance: 'outline', invalid: true },
  { label: 'Disabled', appearance: 'outline', disabled: true },
];

export const PickerFrame = () => (
  <Review
    title="Picker frame and validation"
    instructions="Compare the three pickers at rest, on hover, and on focus. The invalid borders are easiest to see before you focus those fields."
  >
    {pickerStates.map(({ label, appearance, invalid, disabled }) => (
      <ExampleGroup key={label} label={label}>
        <Field label="Combobox" validationState={invalid ? 'error' : undefined}>
          <Combobox appearance={appearance} disabled={disabled} placeholder="Choose a fruit">
            {options}
          </Combobox>
        </Field>
        <Field label="Dropdown" validationState={invalid ? 'error' : undefined}>
          <Dropdown appearance={appearance} disabled={disabled} placeholder="Choose a fruit">
            {options}
          </Dropdown>
        </Field>
        <FruitTagPicker label="TagPicker" appearance={appearance} invalid={invalid} disabled={disabled} />
      </ExampleGroup>
    ))}
  </Review>
);

export const TagVisual = () => (
  <Review
    title="Tag visuals and hit areas"
    instructions="Compare the icon, media, and text spacing across sizes. Tab to both InteractionTag buttons, then hover just above or below the extra-small buttons to try their extended hit area."
  >
    {(['medium', 'small', 'extra-small'] as const).map(size => (
      <ExampleGroup key={size} label={size}>
        <Tag size={size} dismissible icon={<TagRegular aria-hidden />}>
          Tag with icon
        </Tag>
        <InteractionTag size={size} appearance="outline" shape="circular">
          <InteractionTagPrimary
            hasSecondaryAction
            media={<Avatar name="Ada" aria-hidden />}
            secondaryText={size === 'medium' ? 'Secondary text' : undefined}
          >
            Primary action
          </InteractionTagPrimary>
          <InteractionTagSecondary aria-label={`Dismiss ${size} interaction tag`} />
        </InteractionTag>
      </ExampleGroup>
    ))}
  </Review>
);

const sampleColor = { h: 210, s: 0.6, v: 0.8, a: 0.65 };

export const ColorThumb = () => (
  <Review
    title="Color thumb"
    instructions="Tab to each control and use the arrow keys or pointer to move the thumb. In ColorArea, left and right change saturation; up and down change brightness."
  >
    <ExampleGroup label="ColorArea">
      <ColorArea
        defaultColor={sampleColor}
        inputX={{ 'aria-label': 'Saturation' }}
        inputY={{ 'aria-label': 'Brightness' }}
      />
    </ExampleGroup>
    <ExampleGroup label="ColorSlider and AlphaSlider">
      <span>Hue</span>
      <ColorSlider aria-label="Hue" channel="hue" defaultColor={sampleColor} />
      <span>Opacity</span>
      <AlphaSlider aria-label="Opacity" defaultColor={sampleColor} />
    </ExampleGroup>
  </Review>
);
