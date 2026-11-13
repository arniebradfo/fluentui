'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderOverlayDrawer,
  useDrawerContextValue,
  useOverlayDrawer,
  type OverlayDrawerProps as HeadlessOverlayDrawerProps,
} from '@fluentui/react-headless-components-preview/drawer';
import { useDialogSurfaceContext } from '@fluentui/react-headless-components-preview/dialog';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { DrawerSize } from './Drawer.js';
import styles from './OverlayDrawer.module.css';

export type { OverlayDrawerSlots, OverlayDrawerState } from '@fluentui/react-headless-components-preview/drawer';

export type OverlayDrawerProps = HeadlessOverlayDrawerProps & {
  /** Visual size; bottom drawers use the same size on their block axis. @default 'small' */
  size?: DrawerSize;
};

export const overlayDrawerClassNames = { root: 'fui-OverlayDrawer' } as const;

export const OverlayDrawer: ForwardRefComponent<OverlayDrawerProps> = React.forwardRef<
  HTMLDialogElement,
  OverlayDrawerProps
>(({ size = 'small', ...props }, ref) => {
  const isNestedDialog = useDialogSurfaceContext();
  const state = useOverlayDrawer(props, ref);
  const contextValue = useDrawerContextValue();
  Object.assign(state.root, {
    'data-size': size,
    'data-dialog-nested': isNestedDialog ? '' : undefined,
  });
  state.root.className = [overlayDrawerClassNames.root, styles.OverlayDrawer, state.root.className]
    .filter(Boolean)
    .join(' ');
  return renderOverlayDrawer(state, contextValue);
});

OverlayDrawer.displayName = 'OverlayDrawer';
