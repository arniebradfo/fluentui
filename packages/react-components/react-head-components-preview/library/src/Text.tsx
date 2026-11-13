// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

'use client';

import * as React from 'react';
import {
  slot,
  useMergedRefs,
  type ComponentProps,
  type ForwardRefComponent,
  type Slot,
} from '@fluentui/react-utilities';
import styles from './Text.module.css';

export const textClassNames = { root: 'fui-Text' } as const;

export type TextSlots = {
  root: Slot<'span', 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'pre' | 'strong' | 'b' | 'em' | 'i'>;
};

export type TextProps = ComponentProps<TextSlots> & {
  /** Aligns text within its container. @default 'start' */
  align?: 'start' | 'center' | 'end' | 'justify';
  /** Applies a block display. @default false */
  block?: boolean;
  /** Applies a theme font family. @default 'base' */
  font?: 'base' | 'monospace' | 'numeric';
  /** Applies italic styling without changing the element's semantics. @default false */
  italic?: boolean;
  /** Applies a theme font size and line height. @default 300 */
  size?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
  /** Applies a line-through decoration. @default false */
  strikethrough?: boolean;
  /** Applies ellipsis overflow; combine with block and wrap={false} for truncation. @default false */
  truncate?: boolean;
  /** Applies an underline decoration. @default false */
  underline?: boolean;
  /** Applies a theme font weight. @default 'regular' */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  /** Wraps text on white space. @default true */
  wrap?: boolean;
};

/** Native typography with Fluent's standard body-text defaults. */
export const Text: ForwardRefComponent<TextProps> = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      align = 'start',
      block = false,
      font = 'base',
      italic = false,
      size = 300,
      strikethrough = false,
      truncate = false,
      underline = false,
      weight = 'regular',
      wrap = true,
      className,
      ...nativeProps
    },
    ref,
  ) => {
    const Root = slot.always(
      {
        ...nativeProps,
        ref: useMergedRefs(ref),
        className: [textClassNames.root, styles.Text, className].filter(Boolean).join(' '),
        'data-align': align,
        'data-block': block ? '' : undefined,
        'data-font': font,
        'data-italic': italic ? '' : undefined,
        'data-size': size,
        'data-strikethrough': strikethrough ? '' : undefined,
        'data-truncate': truncate ? '' : undefined,
        'data-underline': underline ? '' : undefined,
        'data-weight': weight,
        'data-nowrap': wrap === false ? '' : undefined,
      },
      { elementType: 'span' },
    );
    return <Root />;
  },
);

Text.displayName = 'Text';
