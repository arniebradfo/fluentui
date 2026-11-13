import * as React from 'react';
import type { Decorator } from '@storybook/react';
import { polyfillBodyAndObserve } from '@microsoft/focusgroup-polyfill/shadowless';
import { FluentProvider, webDarkTheme, webLightTheme, tokens } from '../../library/src';
import * as rootPreview from '../../../../../.storybook/preview';

polyfillBodyAndObserve();

export const globalTypes = {
  theme: {
    description: 'Fluent theme',
    toolbar: { icon: 'paintbrush', items: ['light', 'dark'] },
  },
  direction: {
    description: 'Text direction',
    toolbar: { icon: 'paragraph', items: ['ltr', 'rtl'] },
  },
};

export const initialGlobals = { theme: 'light', direction: 'ltr' };

export const decorators: Decorator[] = [
  ...rootPreview.decorators,
  (Story, context) => (
    <FluentProvider
      theme={context.globals.theme === 'dark' ? webDarkTheme : webLightTheme}
      dir={context.globals.direction === 'rtl' ? 'rtl' : 'ltr'}
      style={{ padding: tokens.spacingVerticalL }}
    >
      <Story />
    </FluentProvider>
  ),
];

export const parameters = {
  ...rootPreview.parameters,
  docs: { ...rootPreview.parameters.docs, source: { type: 'code' } },
};
