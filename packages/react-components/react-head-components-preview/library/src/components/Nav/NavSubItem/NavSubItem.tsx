'use client';

import * as React from 'react';
import { renderNavSubItem, useNavSubItem, type NavSubItemProps } from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavSubItemProps,
  NavSubItemSlots,
  NavSubItemState,
} from '@fluentui/react-headless-components-preview/nav';

export const navSubItemClassNames = { root: 'fui-NavSubItem' } as const;

export const NavSubItem: ForwardRefComponent<NavSubItemProps> = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  NavSubItemProps
>((props, ref) => {
  const state = useNavSubItem(props, ref);
  addClassName(state.root, navSubItemClassNames.root, styles.NavSubItem);
  return renderNavSubItem(state);
});
NavSubItem.displayName = 'NavSubItem';
