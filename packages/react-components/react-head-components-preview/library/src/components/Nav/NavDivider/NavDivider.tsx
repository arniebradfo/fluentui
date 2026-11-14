// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import { renderNavDivider, useNavDivider, type NavDividerProps } from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavDividerProps,
  NavDividerSlots,
  NavDividerState,
} from '@fluentui/react-headless-components-preview/nav';

export const navDividerClassNames = { root: 'fui-NavDivider', wrapper: 'fui-NavDivider__wrapper' } as const;

export const NavDivider: ForwardRefComponent<NavDividerProps> = React.forwardRef<HTMLDivElement, NavDividerProps>(
  (props, ref) => {
    const state = useNavDivider(props, ref);
    addClassName(state.root, navDividerClassNames.root, styles.NavDivider);
    addClassName(state.wrapper, navDividerClassNames.wrapper, styles.NavDivider__wrapper);
    return renderNavDivider(state);
  },
);
NavDivider.displayName = 'NavDivider';
