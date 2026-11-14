// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderButton,
  useButton,
  useButtonContext,
  type ButtonProps as HeadlessButtonProps,
} from '@fluentui/react-headless-components-preview/button';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Button.module.css';

export const buttonClassNames = {
  root: 'fui-Button',
  icon: 'fui-Button__icon',
} as const;

export type ButtonProps = HeadlessButtonProps & {
  /** Visual emphasis. @default 'secondary' */
  appearance?: 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
  /** Corner shape. @default 'rounded' */
  shape?: 'rounded' | 'circular' | 'square';
  /** Inherits Button context size when omitted. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export const Button: ForwardRefComponent<ButtonProps> = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ appearance = 'secondary', shape = 'rounded', size: sizeProp, ...props }, ref) => {
  const { size: contextSize } = useButtonContext();
  const size = sizeProp ?? contextSize ?? 'medium';
  const state = useButton(props, ref);

  Object.assign(state.root, {
    'data-appearance': appearance,
    'data-size': size,
    'data-shape': shape,
    'data-has-icon': state.icon ? '' : undefined,
    'data-has-content': state.root.children ? '' : undefined,
  });
  state.root.className = [buttonClassNames.root, styles.Button, state.root.className].filter(Boolean).join(' ');

  if (state.icon) {
    state.icon.className = [buttonClassNames.icon, styles.Button__icon, state.icon.className].filter(Boolean).join(' ');
  }

  return renderButton(state);
});

Button.displayName = 'Button';
