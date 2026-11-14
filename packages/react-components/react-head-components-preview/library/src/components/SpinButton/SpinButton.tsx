// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderSpinButton,
  useSpinButton,
  type SpinButtonProps as HeadlessSpinButtonProps,
} from '@fluentui/react-headless-components-preview/spin-button';
import { ChevronUp16Regular } from '@fluentui/react-icons/headless/svg/chevron-up';
import { ChevronDown16Regular } from '@fluentui/react-icons/headless/svg/chevron-down';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './SpinButton.module.css';

export type { SpinButtonSlots } from '@fluentui/react-headless-components-preview/spin-button';

export const spinButtonClassNames = {
  root: 'fui-SpinButton',
  input: 'fui-SpinButton__input',
  incrementButton: 'fui-SpinButton__incrementButton',
  decrementButton: 'fui-SpinButton__decrementButton',
} as const;

export type SpinButtonChangeEvent = Parameters<NonNullable<HeadlessSpinButtonProps['onChange']>>[0];
export type SpinButtonOnChangeData = Parameters<NonNullable<HeadlessSpinButtonProps['onChange']>>[1];

export type SpinButtonProps = HeadlessSpinButtonProps & {
  /** Visual appearance. @default 'outline' */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  /** SpinButton keeps its own size rather than inheriting Field size. @default 'medium' */
  size?: 'small' | 'medium';
};

export const SpinButton: ForwardRefComponent<SpinButtonProps> = React.forwardRef<HTMLInputElement, SpinButtonProps>(
  ({ appearance = 'outline', size = 'medium', ...props }, ref) => {
    const state = useSpinButton(props, ref);

    if (state.incrementButton.children === null || state.incrementButton.children === undefined) {
      state.incrementButton.children = <ChevronUp16Regular aria-hidden />;
    }
    if (state.decrementButton.children === null || state.decrementButton.children === undefined) {
      state.decrementButton.children = <ChevronDown16Regular aria-hidden />;
    }

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
    });
    state.root.className = [spinButtonClassNames.root, styles.SpinButton, state.root.className]
      .filter(Boolean)
      .join(' ');
    state.input.className = [spinButtonClassNames.input, styles.SpinButton__input, state.input.className]
      .filter(Boolean)
      .join(' ');
    state.incrementButton.className = [
      spinButtonClassNames.incrementButton,
      styles.SpinButton__incrementButton,
      state.incrementButton.className,
    ]
      .filter(Boolean)
      .join(' ');
    state.decrementButton.className = [
      spinButtonClassNames.decrementButton,
      styles.SpinButton__decrementButton,
      state.decrementButton.className,
    ]
      .filter(Boolean)
      .join(' ');

    return renderSpinButton(state);
  },
);

SpinButton.displayName = 'SpinButton';
