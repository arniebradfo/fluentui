// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderDivider,
  useDivider,
  type DividerProps as HeadlessDividerProps,
} from '@fluentui/react-headless-components-preview/divider';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Divider.module.css';

export type { DividerSlots } from '@fluentui/react-headless-components-preview/divider';

export const dividerClassNames = {
  root: 'fui-Divider',
  wrapper: 'fui-Divider__wrapper',
} as const;

export type DividerAppearance = 'brand' | 'default' | 'strong' | 'subtle';

export type DividerProps = HeadlessDividerProps & {
  /** Content alignment along the line. @default 'center' */
  alignContent?: 'start' | 'center' | 'end';
  /** Stroke and content appearance. @default 'default' */
  appearance?: DividerAppearance;
  /** Inset the line using horizontal padding or vertical margins. @default false */
  inset?: boolean;
};

export const Divider: ForwardRefComponent<DividerProps> = React.forwardRef<HTMLElement, DividerProps>(
  ({ alignContent = 'center', appearance = 'default', inset = false, ...props }, ref) => {
    const state = useDivider(props, ref);

    Object.assign(state.root, {
      'data-align-content': alignContent,
      'data-appearance': appearance,
      'data-inset': inset ? '' : undefined,
      'data-has-content': state.root.children !== undefined ? '' : undefined,
    });
    state.root.className = [dividerClassNames.root, styles.Divider, state.root.className].filter(Boolean).join(' ');
    state.wrapper.className = [dividerClassNames.wrapper, styles.Divider__wrapper, state.wrapper.className]
      .filter(Boolean)
      .join(' ');

    return renderDivider(state);
  },
);

Divider.displayName = 'Divider';
