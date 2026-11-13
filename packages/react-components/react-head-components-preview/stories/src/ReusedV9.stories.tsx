import * as React from 'react';
import { Default as ButtonDefault } from '../../../react-button/stories/src/Button/ButtonDefault.stories';
import { Disabled as ButtonDisabled } from '../../../react-button/stories/src/Button/ButtonDisabled.stories';
import { Default as InputDefault } from '../../../react-input/stories/src/Input/InputDefault.stories';
import { Mixed as CheckboxMixed } from '../../../react-checkbox/stories/src/Checkbox/CheckboxMixed.stories';
import { Required as FieldRequired } from '../../../react-field/stories/src/Field/FieldRequired.stories';

export default { title: 'CSS Modules/Reused v9 scenarios' };

export const ButtonDefaults = () => <ButtonDefault />;
export const DisabledButtons = () => <ButtonDisabled />;
export const LabeledInput = () => <InputDefault />;
export const MixedCheckbox = () => <CheckboxMixed />;
export const RequiredField = () => <FieldRequired />;
