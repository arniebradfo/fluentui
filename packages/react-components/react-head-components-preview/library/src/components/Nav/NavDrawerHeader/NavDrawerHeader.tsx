'use client';

import * as React from 'react';
import {
  renderNavDrawerHeader,
  useNavDrawerHeader,
  type NavDrawerHeaderProps,
} from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent, InferredElementRefType } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavDrawerHeaderProps,
  NavDrawerHeaderSlots,
  NavDrawerHeaderState,
} from '@fluentui/react-headless-components-preview/nav';

export const navDrawerHeaderClassNames = { root: 'fui-NavDrawerHeader' } as const;

export const NavDrawerHeader: ForwardRefComponent<NavDrawerHeaderProps> = React.forwardRef<
  InferredElementRefType<NavDrawerHeaderProps>,
  NavDrawerHeaderProps
>((props, ref) => {
  const state = useNavDrawerHeader(props, ref);
  addClassName(state.root, navDrawerHeaderClassNames.root, styles.NavDrawerHeader);
  return renderNavDrawerHeader(state);
});
NavDrawerHeader.displayName = 'NavDrawerHeader';
