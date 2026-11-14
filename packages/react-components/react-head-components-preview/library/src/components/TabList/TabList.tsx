// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderTabList,
  useTabList,
  useTabListContextValues,
  type TabListProps as HeadlessTabListProps,
} from '@fluentui/react-headless-components-preview/tab-list';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './TabList.module.css';

export { useTabListContext, useTabListContextValues } from '@fluentui/react-headless-components-preview/tab-list';
export type { TabListSlots, TabListState, TabValue } from '@fluentui/react-headless-components-preview/tab-list';

export type TabListAppearance = 'transparent' | 'subtle' | 'subtle-circular' | 'filled-circular';

export type TabListProps = HeadlessTabListProps & {
  /** Visual emphasis inherited by tabs. @default 'transparent' */
  appearance?: TabListAppearance;
  /** Tab spacing and typography. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** Reserve the selected text width without adding selection state. @default true */
  reserveSelectedTabSpace?: boolean;
};

export type SelectTabEventHandler = NonNullable<HeadlessTabListProps['onTabSelect']>;
export type SelectTabEvent = Parameters<SelectTabEventHandler>[0];
export type SelectTabData = Parameters<SelectTabEventHandler>[1];
export type TabListContextValues = ReturnType<typeof useTabListContextValues>;

export const tabListClassNames = { root: 'fui-TabList' } as const;

export const TabList: ForwardRefComponent<TabListProps> = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ appearance = 'transparent', size = 'medium', reserveSelectedTabSpace = true, ...props }, ref) => {
    const state = {
      ...useTabList(props, ref),
      appearance,
      size,
      reserveSelectedTabSpace,
    };
    const contextValues = useTabListContextValues(state);
    Object.assign(state.root, { 'data-appearance': appearance, 'data-size': size });
    state.root.className = [tabListClassNames.root, styles.TabList, state.root.className].filter(Boolean).join(' ');

    return renderTabList(state, contextValues);
  },
);

TabList.displayName = 'TabList';
