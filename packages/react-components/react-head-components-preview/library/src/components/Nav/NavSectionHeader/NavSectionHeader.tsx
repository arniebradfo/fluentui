// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderNavSectionHeader,
  useNavSectionHeader,
  type NavSectionHeaderProps,
} from '@fluentui/react-headless-components-preview/nav';
import { useMergedRefs, type ForwardRefComponent, type InferredElementRefType } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavSectionHeaderProps,
  NavSectionHeaderSlots,
  NavSectionHeaderState,
} from '@fluentui/react-headless-components-preview/nav';

export const navSectionHeaderClassNames = { root: 'fui-NavSectionHeader' } as const;

export const NavSectionHeader: ForwardRefComponent<NavSectionHeaderProps> = React.forwardRef<
  InferredElementRefType<NavSectionHeaderProps>,
  NavSectionHeaderProps
>((props, ref) => {
  const state = useNavSectionHeader(props, useMergedRefs(ref));
  addClassName(state.root, navSectionHeaderClassNames.root, styles.NavSectionHeader);
  return renderNavSectionHeader(state);
});
NavSectionHeader.displayName = 'NavSectionHeader';
