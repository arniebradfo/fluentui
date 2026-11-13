// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderTreeItemLayout,
  useTreeContext,
  useTreeItemLayout,
  type TreeItemLayoutActionSlotProps,
  type TreeItemLayoutProps,
} from '@fluentui/react-headless-components-preview/tree';
import { ChevronRight12Regular } from '@fluentui/react-icons/headless/svg/chevron-right';
import { ButtonContextProvider } from '@fluentui/react-headless-components-preview/button';
import {
  slot,
  type ExtractSlotProps,
  type ForwardRefComponent,
  type SlotRenderFunction,
} from '@fluentui/react-utilities';
import styles from './TreeItemLayout.module.css';

export type {
  TreeItemLayoutActionSlotProps,
  TreeItemLayoutActionVisibilityChangeData,
  TreeItemLayoutProps,
  TreeItemLayoutSlots,
  TreeItemLayoutState,
} from '@fluentui/react-headless-components-preview/tree';

export const treeItemLayoutClassNames = {
  root: 'fui-TreeItemLayout',
  iconBefore: 'fui-TreeItemLayout__iconBefore',
  main: 'fui-TreeItemLayout__main',
  iconAfter: 'fui-TreeItemLayout__iconAfter',
  expandIcon: 'fui-TreeItemLayout__expandIcon',
  aside: 'fui-TreeItemLayout__aside',
  actions: 'fui-TreeItemLayout__actions',
  selector: 'fui-TreeItemLayout__selector',
} as const;

export const TreeItemLayout: ForwardRefComponent<TreeItemLayoutProps> = React.forwardRef<
  HTMLDivElement,
  TreeItemLayoutProps
>((props, ref) => {
  const state = useTreeItemLayout(props, ref);
  const size = useTreeContext(ctx => ctx.size);
  const appearance = useTreeContext(ctx => ctx.appearance);

  if (state.expandIcon) {
    state.expandIcon.children ??= <ChevronRight12Regular className={styles.TreeItemLayout__chevron} />;
  }

  Object.assign(state.root, { 'data-size': size, 'data-appearance': appearance });
  state.root.className = [treeItemLayoutClassNames.root, styles.TreeItemLayout, state.root.className]
    .filter(Boolean)
    .join(' ');
  state.main.className = [treeItemLayoutClassNames.main, styles.TreeItemLayout__main, state.main.className]
    .filter(Boolean)
    .join(' ');
  if (state.iconBefore) {
    state.iconBefore.className = [
      treeItemLayoutClassNames.iconBefore,
      styles.TreeItemLayout__iconBefore,
      state.iconBefore.className,
    ]
      .filter(Boolean)
      .join(' ');
  }
  if (state.iconAfter) {
    state.iconAfter.className = [
      treeItemLayoutClassNames.iconAfter,
      styles.TreeItemLayout__iconAfter,
      state.iconAfter.className,
    ]
      .filter(Boolean)
      .join(' ');
  }
  if (state.expandIcon) {
    state.expandIcon.className = [
      treeItemLayoutClassNames.expandIcon,
      styles.TreeItemLayout__expandIcon,
      state.expandIcon.className,
    ]
      .filter(Boolean)
      .join(' ');
  }
  if (state.aside) {
    state.aside.className = [treeItemLayoutClassNames.aside, styles.TreeItemLayout__aside, state.aside.className]
      .filter(Boolean)
      .join(' ');
  }
  if (state.actions) {
    state.actions.className = [
      treeItemLayoutClassNames.actions,
      styles.TreeItemLayout__actions,
      state.actions.className,
    ]
      .filter(Boolean)
      .join(' ');
  }
  if (state.selector) {
    state.selector.className = [
      treeItemLayoutClassNames.selector,
      styles.TreeItemLayout__selector,
      state.selector.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  // Scope the visual size to the action region, including caller-provided render functions.
  if (state.actions) {
    const render = slot.resolveShorthand(props.actions)?.children;
    const renderActions: SlotRenderFunction<TreeItemLayoutActionSlotProps> = (Component, slotProps) => (
      <ButtonContextProvider value={{ size: 'small' }}>
        {typeof render === 'function' ? render(Component, slotProps) : <Component {...slotProps} />}
      </ButtonContextProvider>
    );
    state.actions = slot.always<TreeItemLayoutActionSlotProps>(
      { children: renderActions },
      { defaultProps: state.actions, elementType: 'div' },
    );
  }
  if (state.aside) {
    const render = slot.resolveShorthand(props.aside)?.children;
    const renderAside: SlotRenderFunction<ExtractSlotProps<TreeItemLayoutProps['aside']>> = (Component, slotProps) => (
      <ButtonContextProvider value={{ size: 'small' }}>
        {typeof render === 'function' ? render(Component, slotProps) : <Component {...slotProps} />}
      </ButtonContextProvider>
    );
    state.aside = slot.always<ExtractSlotProps<TreeItemLayoutProps['aside']>>(
      { children: renderAside },
      { defaultProps: state.aside, elementType: 'div' },
    );
  }

  return renderTreeItemLayout(state);
});

TreeItemLayout.displayName = 'TreeItemLayout';
