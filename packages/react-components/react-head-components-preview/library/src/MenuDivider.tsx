// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderMenuDivider,
  useMenuDivider,
  type MenuDividerProps,
} from '@fluentui/react-headless-components-preview/menu';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './MenuDivider.module.css';

export type {
  MenuDividerProps,
  MenuDividerSlots,
  MenuDividerState,
} from '@fluentui/react-headless-components-preview/menu';

export const menuDividerClassNames = { root: 'fui-MenuDivider' } as const;

export const MenuDivider: ForwardRefComponent<MenuDividerProps> = React.forwardRef<HTMLDivElement, MenuDividerProps>(
  (props, ref) => {
    const state = useMenuDivider(props, ref);
    state.root.className = [menuDividerClassNames.root, styles.MenuDivider, state.root.className]
      .filter(Boolean)
      .join(' ');
    return renderMenuDivider(state);
  },
);

MenuDivider.displayName = 'MenuDivider';
