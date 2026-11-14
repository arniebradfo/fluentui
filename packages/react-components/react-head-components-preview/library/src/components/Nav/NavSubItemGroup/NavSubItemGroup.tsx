// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderNavSubItemGroup,
  useNavSubItemGroup,
  type NavSubItemGroupProps,
} from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavSubItemGroupProps,
  NavSubItemGroupSlots,
  NavSubItemGroupState,
} from '@fluentui/react-headless-components-preview/nav';

export const navSubItemGroupClassNames = { root: 'fui-NavSubItemGroup' } as const;

export const NavSubItemGroup: ForwardRefComponent<NavSubItemGroupProps> = React.forwardRef<
  HTMLDivElement,
  NavSubItemGroupProps
>((props, ref) => {
  const state = useNavSubItemGroup(props, ref);
  addClassName(state.root, navSubItemGroupClassNames.root, styles.NavSubItemGroup);
  return renderNavSubItemGroup(state);
});
NavSubItemGroup.displayName = 'NavSubItemGroup';
