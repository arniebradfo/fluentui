'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderPopoverSurface,
  usePopoverSurface,
  type PopoverSurfaceProps,
  type PopoverSurfaceState,
} from '@fluentui/react-headless-components-preview/popover';
import type { ForwardRefComponent, InferredElementRefType } from '@fluentui/react-utilities';
import { usePopoverVisualContext, type PopoverVisualOptions } from './PopoverVisualContext.js';
import styles from './PopoverSurface.module.css';

export type {
  PopoverSurfaceProps,
  PopoverSurfaceSlots,
  PopoverSurfaceState,
} from '@fluentui/react-headless-components-preview/popover';

export const popoverSurfaceClassNames = {
  root: 'fui-PopoverSurface',
} as const;

type StyledPopoverSurfaceRoot = PopoverSurfaceState['root'] & {
  'data-appearance': PopoverVisualOptions['appearance'];
  'data-size': PopoverVisualOptions['size'];
};

export const PopoverSurface: ForwardRefComponent<PopoverSurfaceProps> = React.forwardRef<
  InferredElementRefType<PopoverSurfaceProps>,
  PopoverSurfaceProps
>((props, ref) => {
  const { appearance, size } = usePopoverVisualContext();
  const state = usePopoverSurface(props, ref);
  const root: StyledPopoverSurfaceRoot = {
    ...state.root,
    'data-appearance': appearance,
    'data-size': size,
    className: [popoverSurfaceClassNames.root, styles.PopoverSurface, state.root.className].filter(Boolean).join(' '),
  };

  return renderPopoverSurface({
    ...state,
    root,
  });
});

PopoverSurface.displayName = 'PopoverSurface';
