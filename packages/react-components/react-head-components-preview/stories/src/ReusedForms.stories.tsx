import * as React from 'react';
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
