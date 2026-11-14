'use client';

import * as React from 'react';
import { renderNavItem, useNavItem, type NavItemProps } from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type { NavItemProps, NavItemSlots, NavItemState } from '@fluentui/react-headless-components-preview/nav';

export const navItemClassNames = { root: 'fui-NavItem', icon: 'fui-NavItem__icon' } as const;

export const NavItem: ForwardRefComponent<NavItemProps> = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  NavItemProps
>((props, ref) => {
  const state = useNavItem(props, ref);
  addClassName(state.root, navItemClassNames.root, styles.NavItem);
  if (state.icon) {
    addClassName(state.icon, navItemClassNames.icon, styles.NavItem__icon);
  }
  return renderNavItem(state);
});
NavItem.displayName = 'NavItem';
