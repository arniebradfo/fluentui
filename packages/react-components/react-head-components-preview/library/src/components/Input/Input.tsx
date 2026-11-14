// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderInput,
  useInput,
  type InputProps as HeadlessInputProps,
} from '@fluentui/react-headless-components-preview/input';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Input.module.css';

export type { InputSlots } from '@fluentui/react-headless-components-preview/input';

export const inputClassNames = {
  root: 'fui-Input',
  input: 'fui-Input__input',
  contentBefore: 'fui-Input__contentBefore',
  contentAfter: 'fui-Input__contentAfter',
} as const;

export type InputOnChangeData = Parameters<NonNullable<HeadlessInputProps['onChange']>>[1];

export type InputProps = HeadlessInputProps & {
  /** Visual appearance. @default 'outline' */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  /** Inherits Field size when omitted. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export const Input: ForwardRefComponent<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const field = useFieldContext();
    const size = sizeProp ?? field?.size ?? 'medium';
    const state = useInput(props, ref);

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-read-only': state.input.readOnly ? '' : undefined,
      'data-has-content-before': state.contentBefore ? '' : undefined,
      'data-has-content-after': state.contentAfter ? '' : undefined,
    });
    state.root.className = [inputClassNames.root, styles.Input, state.root.className].filter(Boolean).join(' ');
    state.input.className = [inputClassNames.input, styles.Input__input, state.input.className]
      .filter(Boolean)
      .join(' ');

    if (state.contentBefore) {
      state.contentBefore.className = [
        inputClassNames.contentBefore,
        styles.Input__contentBefore,
        state.contentBefore.className,
      ]
        .filter(Boolean)
        .join(' ');
    }
    if (state.contentAfter) {
      state.contentAfter.className = [
        inputClassNames.contentAfter,
        styles.Input__contentAfter,
        state.contentAfter.className,
      ]
        .filter(Boolean)
        .join(' ');
    }

    return renderInput(state);
  },
);

Input.displayName = 'Input';
