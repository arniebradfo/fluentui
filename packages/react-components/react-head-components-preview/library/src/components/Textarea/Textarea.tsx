// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderTextarea,
  useTextarea,
  type TextareaProps as HeadlessTextareaProps,
} from '@fluentui/react-headless-components-preview/textarea';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Textarea.module.css';

export type { TextareaSlots } from '@fluentui/react-headless-components-preview/textarea';

export type TextareaOnChangeData = Parameters<NonNullable<HeadlessTextareaProps['onChange']>>[1];

export const textareaClassNames = {
  root: 'fui-Textarea',
  textarea: 'fui-Textarea__textarea',
} as const;

export type TextareaProps = HeadlessTextareaProps & {
  /** Visual appearance. @default 'outline' */
  appearance?: 'outline' | 'filled-darker' | 'filled-lighter';
  /** Inherits Field size when omitted. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export const Textarea: ForwardRefComponent<TextareaProps> = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const fieldContext = useFieldContext();
    const size = sizeProp ?? fieldContext?.size ?? 'medium';
    const state = useTextarea(props, ref);

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-read-only': state.textarea.readOnly ? '' : undefined,
      'data-required': state.textarea.required ? '' : undefined,
    });
    state.root.className = [textareaClassNames.root, styles.Textarea, state.root.className].filter(Boolean).join(' ');
    state.textarea.className = [textareaClassNames.textarea, styles.Textarea__textarea, state.textarea.className]
      .filter(Boolean)
      .join(' ');

    return renderTextarea(state);
  },
);

Textarea.displayName = 'Textarea';
