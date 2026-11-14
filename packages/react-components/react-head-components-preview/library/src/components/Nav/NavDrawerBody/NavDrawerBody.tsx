// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderNavDrawerBody,
  useNavDrawerBody,
  type NavDrawerBodyProps,
} from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent, InferredElementRefType } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavDrawerBodyProps,
  NavDrawerBodySlots,
  NavDrawerBodyState,
} from '@fluentui/react-headless-components-preview/nav';

export const navDrawerBodyClassNames = { root: 'fui-NavDrawerBody' } as const;

export const NavDrawerBody: ForwardRefComponent<NavDrawerBodyProps> = React.forwardRef<
  InferredElementRefType<NavDrawerBodyProps>,
  NavDrawerBodyProps
>((props, ref) => {
  const state = useNavDrawerBody(props, ref);
  addClassName(state.root, navDrawerBodyClassNames.root, styles.NavDrawerBody);
  return renderNavDrawerBody(state);
});
NavDrawerBody.displayName = 'NavDrawerBody';
