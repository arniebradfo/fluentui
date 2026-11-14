'use client';

import * as React from 'react';
import {
  renderNavCategoryItem,
  useNavCategoryItem,
  useNavCategoryItemContextValues,
  type NavCategoryItemProps,
} from '@fluentui/react-headless-components-preview/nav';
import { ChevronRight20Regular } from '@fluentui/react-icons/headless/svg/chevron-right';
import { slot, type ForwardRefComponent } from '@fluentui/react-utilities';
import { addClassName } from '../addClassName.js';
import styles from '../Nav.module.css';

export type {
  NavCategoryItemProps,
  NavCategoryItemSlots,
  NavCategoryItemState,
} from '@fluentui/react-headless-components-preview/nav';

export const navCategoryItemClassNames = {
  root: 'fui-NavCategoryItem',
  icon: 'fui-NavCategoryItem__icon',
  expandIcon: 'fui-NavCategoryItem__expandIcon',
} as const;

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
