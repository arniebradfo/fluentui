// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import { renderListItem, useListItem, type ListItemProps } from '@fluentui/react-headless-components-preview/list';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './ListItem.module.css';

export type {
  ListItemActionEventData,
  ListItemProps,
  ListItemSlots,
  ListItemState,
  ListItemValue,
} from '@fluentui/react-headless-components-preview/list';

export const listItemClassNames = {
  root: 'fui-ListItem',
  checkmark: 'fui-ListItem__checkmark',
} as const;

export const ListItem: ForwardRefComponent<ListItemProps> = React.forwardRef<
  HTMLLIElement | HTMLDivElement,
  ListItemProps
>((props, ref) => {
  const state = useListItem(props, ref);
  state.root.className = [listItemClassNames.root, styles.ListItem, state.root.className].filter(Boolean).join(' ');
  if (state.checkmark) {
    state.checkmark.className = [listItemClassNames.checkmark, styles.ListItem__checkmark, state.checkmark.className]
      .filter(Boolean)
      .join(' ');
  }
  return renderListItem(state);
});

ListItem.displayName = 'ListItem';
