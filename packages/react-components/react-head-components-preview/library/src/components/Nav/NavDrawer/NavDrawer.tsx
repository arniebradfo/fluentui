'use client';

import * as React from 'react';
import {
  renderNavDrawer,
  useNavDrawer,
  useNavContextValues,
  type NavDrawerProps,
} from '@fluentui/react-headless-components-preview/nav';
import { useMergedRefs, type ForwardRefComponent, type InferredElementRefType } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type { NavDrawerProps, NavDrawerSlots, NavDrawerState } from '@fluentui/react-headless-components-preview/nav';

export const navDrawerClassNames = { root: 'fui-NavDrawer' } as const;

export const NavDrawer: ForwardRefComponent<NavDrawerProps> = React.forwardRef<
  InferredElementRefType<NavDrawerProps>,
  NavDrawerProps
>((props, ref) => {
  const state = useNavDrawer(props, useMergedRefs(ref));
  const contextValues = useNavContextValues(state);
  addClassName(state.root, navDrawerClassNames.root, styles.NavDrawer);
  return renderNavDrawer(state, contextValues);
});
NavDrawer.displayName = 'NavDrawer';
