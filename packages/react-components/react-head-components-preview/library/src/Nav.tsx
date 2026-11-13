// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderNav,
  renderNavCategory,
  renderNavCategoryItem,
  renderNavDivider,
  renderNavDrawer,
  renderNavDrawerBody,
  renderNavDrawerFooter,
  renderNavDrawerHeader,
  renderNavItem,
  renderNavSectionHeader,
  renderNavSubItem,
  renderNavSubItemGroup,
  useNav,
  useNavCategory,
  useNavCategoryContextValues,
  useNavCategoryItem,
  useNavCategoryItemContextValues,
  useNavContextValues,
  useNavDivider,
  useNavDrawer,
  useNavDrawerBody,
  useNavDrawerFooter,
  useNavDrawerHeader,
  useNavItem,
  useNavSectionHeader,
  useNavSubItem,
  useNavSubItemGroup,
  type NavCategoryItemProps,
  type NavCategoryProps,
  type NavDividerProps,
  type NavDrawerBodyProps,
  type NavDrawerFooterProps,
  type NavDrawerHeaderProps,
  type NavDrawerProps,
  type NavItemProps,
  type NavProps,
  type NavSectionHeaderProps,
  type NavSubItemGroupProps,
  type NavSubItemProps,
} from '@fluentui/react-headless-components-preview/nav';
import { ChevronRight20Regular } from '@fluentui/react-icons/headless/svg/chevron-right';
import { slot, useMergedRefs, type ForwardRefComponent, type InferredElementRefType } from '@fluentui/react-utilities';
import styles from './Nav.module.css';

export type {
  NavProps,
  NavSlots,
  NavState,
  NavItemValue,
  OnNavItemSelectData,
  NavCategoryProps,
  NavCategoryState,
  NavCategoryItemProps,
  NavCategoryItemSlots,
  NavCategoryItemState,
  NavDividerProps,
  NavDividerSlots,
  NavDividerState,
  NavDrawerProps,
  NavDrawerSlots,
  NavDrawerState,
  NavDrawerBodyProps,
  NavDrawerBodySlots,
  NavDrawerBodyState,
  NavDrawerFooterProps,
  NavDrawerFooterSlots,
  NavDrawerFooterState,
  NavDrawerHeaderProps,
  NavDrawerHeaderSlots,
  NavDrawerHeaderState,
  NavItemProps,
  NavItemSlots,
  NavItemState,
  NavSectionHeaderProps,
  NavSectionHeaderSlots,
  NavSectionHeaderState,
  NavSubItemGroupProps,
  NavSubItemGroupSlots,
  NavSubItemGroupState,
  NavSubItemProps,
  NavSubItemSlots,
  NavSubItemState,
} from '@fluentui/react-headless-components-preview/nav';

export const navClassNames = { root: 'fui-Nav' } as const;
export const navItemClassNames = { root: 'fui-NavItem', icon: 'fui-NavItem__icon' } as const;
export const navSubItemClassNames = { root: 'fui-NavSubItem' } as const;
export const navCategoryItemClassNames = {
  root: 'fui-NavCategoryItem',
  icon: 'fui-NavCategoryItem__icon',
  expandIcon: 'fui-NavCategoryItem__expandIcon',
} as const;
export const navSubItemGroupClassNames = { root: 'fui-NavSubItemGroup' } as const;
export const navDividerClassNames = { root: 'fui-NavDivider', wrapper: 'fui-NavDivider__wrapper' } as const;
export const navSectionHeaderClassNames = { root: 'fui-NavSectionHeader' } as const;
export const navDrawerClassNames = { root: 'fui-NavDrawer' } as const;
export const navDrawerHeaderClassNames = { root: 'fui-NavDrawerHeader' } as const;
export const navDrawerBodyClassNames = { root: 'fui-NavDrawerBody' } as const;
export const navDrawerFooterClassNames = { root: 'fui-NavDrawerFooter' } as const;

function addClassName(target: { className?: string }, ...classNames: string[]): void {
  target.className = [...classNames, target.className].filter(Boolean).join(' ');
}

export const Nav: ForwardRefComponent<NavProps> = React.forwardRef<HTMLDivElement, NavProps>((props, ref) => {
  const state = useNav(props, ref);
  const contextValues = useNavContextValues(state);
  addClassName(state.root, navClassNames.root, styles.Nav);
  return renderNav(state, contextValues);
});
Nav.displayName = 'Nav';

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

export const NavSubItem: ForwardRefComponent<NavSubItemProps> = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  NavSubItemProps
>((props, ref) => {
  const state = useNavSubItem(props, ref);
  addClassName(state.root, navSubItemClassNames.root, styles.NavSubItem);
  return renderNavSubItem(state);
});
NavSubItem.displayName = 'NavSubItem';

// NavCategory is a context boundary, not a DOM element, as in the public primitive.
export const NavCategory: ForwardRefComponent<NavCategoryProps> = React.forwardRef<never, NavCategoryProps>(
  (props, ref) => {
    const state = useNavCategory(props, ref);
    return renderNavCategory(state, useNavCategoryContextValues(state));
  },
);
NavCategory.displayName = 'NavCategory';

export const NavCategoryItem: ForwardRefComponent<NavCategoryItemProps> = React.forwardRef<
  HTMLButtonElement,
  NavCategoryItemProps
>((props, ref) => {
  const expandIcon = slot.optional(props.expandIcon, {
    renderByDefault: true,
    defaultProps: {
      'aria-hidden': true,
      children: <ChevronRight20Regular className={styles.NavCategoryItem__glyph} />,
    },
    elementType: 'span',
  });
  const state = useNavCategoryItem({ ...props, expandIcon }, ref);
  const contextValues = useNavCategoryItemContextValues(state);
  addClassName(state.root, navCategoryItemClassNames.root, styles.NavCategoryItem);
  if (state.icon) {
    addClassName(state.icon, navCategoryItemClassNames.icon, styles.NavItem__icon);
  }
  if (state.expandIcon) {
    addClassName(state.expandIcon, navCategoryItemClassNames.expandIcon, styles.NavCategoryItem__expandIcon);
  }
  return renderNavCategoryItem(state, contextValues);
});
NavCategoryItem.displayName = 'NavCategoryItem';

export const NavSubItemGroup: ForwardRefComponent<NavSubItemGroupProps> = React.forwardRef<
  HTMLDivElement,
  NavSubItemGroupProps
>((props, ref) => {
  const state = useNavSubItemGroup(props, ref);
  addClassName(state.root, navSubItemGroupClassNames.root, styles.NavSubItemGroup);
  return renderNavSubItemGroup(state);
});
NavSubItemGroup.displayName = 'NavSubItemGroup';

export const NavDivider: ForwardRefComponent<NavDividerProps> = React.forwardRef<HTMLDivElement, NavDividerProps>(
  (props, ref) => {
    const state = useNavDivider(props, ref);
    addClassName(state.root, navDividerClassNames.root, styles.NavDivider);
    addClassName(state.wrapper, navDividerClassNames.wrapper, styles.NavDivider__wrapper);
    return renderNavDivider(state);
  },
);
NavDivider.displayName = 'NavDivider';

export const NavSectionHeader: ForwardRefComponent<NavSectionHeaderProps> = React.forwardRef<
  InferredElementRefType<NavSectionHeaderProps>,
  NavSectionHeaderProps
>((props, ref) => {
  const state = useNavSectionHeader(props, useMergedRefs(ref));
  addClassName(state.root, navSectionHeaderClassNames.root, styles.NavSectionHeader);
  return renderNavSectionHeader(state);
});
NavSectionHeader.displayName = 'NavSectionHeader';

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

export const NavDrawerHeader: ForwardRefComponent<NavDrawerHeaderProps> = React.forwardRef<
  InferredElementRefType<NavDrawerHeaderProps>,
  NavDrawerHeaderProps
>((props, ref) => {
  const state = useNavDrawerHeader(props, ref);
  addClassName(state.root, navDrawerHeaderClassNames.root, styles.NavDrawerHeader);
  return renderNavDrawerHeader(state);
});
NavDrawerHeader.displayName = 'NavDrawerHeader';

export const NavDrawerBody: ForwardRefComponent<NavDrawerBodyProps> = React.forwardRef<
  InferredElementRefType<NavDrawerBodyProps>,
  NavDrawerBodyProps
>((props, ref) => {
  const state = useNavDrawerBody(props, ref);
  addClassName(state.root, navDrawerBodyClassNames.root, styles.NavDrawerBody);
  return renderNavDrawerBody(state);
});
NavDrawerBody.displayName = 'NavDrawerBody';

export const NavDrawerFooter: ForwardRefComponent<NavDrawerFooterProps> = React.forwardRef<
  InferredElementRefType<NavDrawerFooterProps>,
  NavDrawerFooterProps
>((props, ref) => {
  const state = useNavDrawerFooter(props, ref);
  addClassName(state.root, navDrawerFooterClassNames.root, styles.NavDrawerFooter);
  return renderNavDrawerFooter(state);
});
NavDrawerFooter.displayName = 'NavDrawerFooter';
