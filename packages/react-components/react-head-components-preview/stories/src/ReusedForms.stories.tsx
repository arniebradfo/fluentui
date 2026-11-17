import * as React from 'react';
import {
  Combobox as StockCombobox,
  Dropdown as StockDropdown,
  FluentProvider as StockProvider,
} from '@fluentui/react-components';
import {
  Combobox as CandidateCombobox,
  Dropdown as CandidateDropdown,
  FluentProvider,
  tokens,
  webLightTheme,
} from '../../library/src';
import { Default as TextareaDefault } from '../../../react-textarea/stories/src/Textarea/TextareaDefault.stories';
import { Default as SwitchDefault } from '../../../react-switch/stories/src/Switch/SwitchDefault.stories';
import { Default as RadioGroupDefault } from '../../../react-radio/stories/src/RadioGroup/RadioGroupDefault.stories';
import { Default as SelectDefault } from '../../../react-select/stories/src/Select/SelectDefault.stories';
import { Default as ComboboxDefault } from '../../../react-combobox/stories/src/Combobox/ComboboxDefault.stories';
import { Default as DropdownDefault } from '../../../react-combobox/stories/src/Dropdown/DropdownDefault.stories';
import { Default as SpinButtonDefault } from '../../../react-spinbutton/stories/src/SpinButton/SpinButtonDefault.stories';
import { Default as SliderDefault } from '../../../react-slider/stories/src/Slider/SliderDefault.stories';
import { Default as SearchBoxDefault } from '../../../react-search/stories/src/SearchBox/SearchBoxDefault.stories';
import { Default as TagPickerDefault } from '../../../react-tag-picker/stories/src/TagPicker/TagPickerDefault.stories';

export default {
  title: 'CSS Modules/Forms and pickers',
  parameters: {
    docs: {
      description: {
        component:
          'Unmodified v9 form examples use an explicit candidate-only component facade. Combobox, Dropdown and TagPicker exercise native anchored lists. Demo layout may still use Griffel.',
      },
    },
  },
};

export const MultilineInput = () => <TextareaDefault />;
export const Switch = () => <SwitchDefault />;
export const RadioGroup = () => <RadioGroupDefault />;
export const NativeSelect = () => <SelectDefault />;
export const Combobox = () => <ComboboxDefault />;
export const Dropdown = () => <DropdownDefault />;
export const SpinButton = () => <SpinButtonDefault />;
export const Slider = () => <SliderDefault />;
export const Search = () => <SearchBoxDefault />;
export const TagPicker = () => <TagPickerDefault />;

export const PickerStateComparison = () => {
  const layout: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)' }}>
      <StockProvider theme={webLightTheme} dir="ltr" style={layout} data-testid="stock-pickers">
        <div data-testid="outline-combobox">
          <StockCombobox aria-label="Outline combobox" appearance="outline" open={false} />
        </div>
        <div data-testid="outline-dropdown">
          <StockDropdown aria-label="Outline dropdown" appearance="outline" open={false} />
        </div>
      </StockProvider>
      <FluentProvider theme={webLightTheme} dir="ltr" style={layout} data-testid="candidate-pickers">
        <div data-testid="outline-combobox">
          <CandidateCombobox aria-label="Outline combobox" appearance="outline" open={false} />
        </div>
        <div data-testid="outline-dropdown">
          <CandidateDropdown aria-label="Outline dropdown" appearance="outline" open={false} />
        </div>
      </FluentProvider>
    </div>
  );
};
