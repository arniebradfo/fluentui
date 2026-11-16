import * as React from 'react';
import type { Decorator } from '@storybook/react';
import { FluentProvider } from '@fluentui/react-provider';
import { webLightTheme } from '@fluentui/react-theme';
import { polyfillBodyAndObserve } from '@microsoft/focusgroup-polyfill/shadowless';
import '../../../../../../apps/vr-tests-react-components/.storybook/preview';

declare const __HEAD_VISUAL_IMPLEMENTATION__: 'reference' | 'candidate';

polyfillBodyAndObserve();

export const parameters = {
  layout: 'none',
  mode: 'vr-test',
  reactStorybookAddon: { disabledDecorators: ['AriaLive', 'FluentProvider'] },
};

const withVisualProvider: Decorator = Story => (
  <FluentProvider theme={webLightTheme} data-visual-implementation={__HEAD_VISUAL_IMPLEMENTATION__}>
    <Story />
  </FluentProvider>
);

export const decorators: Decorator[] = [withVisualProvider];
