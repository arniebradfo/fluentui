'use client';

import * as React from 'react';
import {
  renderNavDrawerFooter,
  useNavDrawerFooter,
  type NavDrawerFooterProps,
} from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent, InferredElementRefType } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavDrawerFooterProps,
  NavDrawerFooterSlots,
  NavDrawerFooterState,
} from '@fluentui/react-headless-components-preview/nav';

export const navDrawerFooterClassNames = { root: 'fui-NavDrawerFooter' } as const;

export const NavDrawerFooter: ForwardRefComponent<NavDrawerFooterProps> = React.forwardRef<
  InferredElementRefType<NavDrawerFooterProps>,
  NavDrawerFooterProps
>((props, ref) => {
  const state = useNavDrawerFooter(props, ref);
  addClassName(state.root, navDrawerFooterClassNames.root, styles.NavDrawerFooter);
  return renderNavDrawerFooter(state);
});
NavDrawerFooter.displayName = 'NavDrawerFooter';
