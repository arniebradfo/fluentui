// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import { renderNav, useNav, useNavContextValues, type NavProps } from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from './addClassName.js';
import styles from './Nav.module.css';

export type {
  NavProps,
  NavSlots,
  NavState,
  NavItemValue,
  OnNavItemSelectData,
} from '@fluentui/react-headless-components-preview/nav';

export const navClassNames = { root: 'fui-Nav' } as const;

export const Nav: ForwardRefComponent<NavProps> = React.forwardRef<HTMLDivElement, NavProps>((props, ref) => {
  const state = useNav(props, ref);
  const contextValues = useNavContextValues(state);
  addClassName(state.root, navClassNames.root, styles.Nav);
  return renderNav(state, contextValues);
});
Nav.displayName = 'Nav';
