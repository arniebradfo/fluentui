// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import type * as React from 'react';
import { useButtonContext } from '@fluentui/react-headless-components-preview/button';
import { buttonClassNames, type ButtonProps } from './Button.js';

export type ButtonVariantVisualProps = Pick<ButtonProps, 'appearance' | 'shape' | 'size'>;

export function useButtonVariantVisuals(
  { appearance = 'secondary', shape = 'rounded', size }: ButtonVariantVisualProps,
  inheritSize = true,
): Required<ButtonVariantVisualProps> {
  const context = useButtonContext();
  return {
    appearance,
    shape,
    size: size ?? (inheritSize ? context.size : undefined) ?? 'medium',
  };
}

export function applyButtonVariantStyles(
  state: {
    root: { className?: string; children?: React.ReactNode };
    icon?: { className?: string };
  },
  visuals: Required<ButtonVariantVisualProps>,
  markers: { root: string; icon: string },
  classes: { root: string; icon: string },
): void {
  Object.assign(state.root, {
    'data-appearance': visuals.appearance,
    'data-size': visuals.size,
    'data-shape': visuals.shape,
    'data-has-icon': state.icon ? '' : undefined,
    'data-has-content': state.root.children ? '' : undefined,
  });
  state.root.className = [buttonClassNames.root, markers.root, classes.root, state.root.className]
    .filter(Boolean)
    .join(' ');
  if (state.icon) {
    state.icon.className = [buttonClassNames.icon, markers.icon, classes.icon, state.icon.className]
      .filter(Boolean)
      .join(' ');
  }
}
