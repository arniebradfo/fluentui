import * as React from 'react';
import type { Meta } from '@storybook/react-webpack5';
import {
  Button,
  CompoundButton,
  MenuButton,
  SplitButton,
  ToggleButton,
  Input,
  tokens,
  type ButtonProps,
  type JSXElement,
} from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';
import { Steps } from 'storywright';
import { getStoryVariant, HIGH_CONTRAST } from '../../../../../../apps/vr-tests-react-components/src/utilities';

const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
const cases = ['button', 'compound', 'menu', 'split', 'toggle', 'expanded', 'checked', 'input'];
const steps = new Steps().snapshot('default');
for (const name of cases) {
  steps
    .hover(`#icon-${name}`)
    .snapshot(`${name} hover`)
    .mouseDown(`#icon-${name}`)
    .snapshot(`${name} pressed`)
    .mouseUp(`#icon-${name}`);
}

export default {
  title: 'CSS Modules/Shared icon states',
  parameters: { storyWright: { steps: steps.end() } },
} satisfies Meta;

const IconStates = ({ appearance, disabled }: Pick<ButtonProps, 'appearance' | 'disabled'>): JSXElement => {
  const icon = <CalendarMonth data-visual-bundle="" />;
  const common = { appearance, disabled, icon };
  return (
    <div
      data-visual-appearance={appearance}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: tokens.spacingVerticalS,
        padding: tokens.spacingVerticalS,
      }}
    >
      <div data-icon-case="button">
        <Button {...common} id="icon-button">
          Action
        </Button>
      </div>
      <div data-icon-case="compound">
        <CompoundButton {...common} id="icon-compound" secondaryContent="Details">
          Action
        </CompoundButton>
      </div>
      <div data-icon-case="menu">
        <MenuButton {...common} id="icon-menu">
          Action
        </MenuButton>
      </div>
      <div data-icon-case="split">
        <SplitButton {...common} id="icon-split">
          Action
        </SplitButton>
      </div>
      <div data-icon-case="toggle">
        <ToggleButton {...common} id="icon-toggle">
          Action
        </ToggleButton>
      </div>
      <div data-icon-case="expanded">
        <MenuButton {...common} id="icon-expanded" aria-expanded>
          Expanded
        </MenuButton>
      </div>
      <div data-icon-case="checked">
        <ToggleButton {...common} id="icon-checked" checked>
          Checked
        </ToggleButton>
      </div>
      <div data-icon-case="input">
        <Input id="icon-input" contentBefore={icon} disabled={disabled} placeholder="With icon" />
      </div>
    </div>
  );
};

export const Subtle = (): JSXElement => <IconStates appearance="subtle" />;
export const Transparent = (): JSXElement => <IconStates appearance="transparent" />;
export const Disabled = ({ appearance = 'subtle' }: Pick<ButtonProps, 'appearance'>): JSXElement => (
  <IconStates appearance={appearance} disabled />
);
Disabled.args = { appearance: 'subtle' } satisfies Pick<ButtonProps, 'appearance'>;
export const HighContrast = getStoryVariant(Subtle, HIGH_CONTRAST);
