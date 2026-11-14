// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderMenuPopover,
  useMenuPopover,
  type MenuPopoverProps,
} from '@fluentui/react-headless-components-preview/menu';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './MenuPopover.module.css';

export type {
  MenuPopoverProps,
  MenuPopoverSlots,
  MenuPopoverState,
} from '@fluentui/react-headless-components-preview/menu';

export const menuPopoverClassNames = { root: 'fui-MenuPopover' } as const;

export const MenuPopover: ForwardRefComponent<MenuPopoverProps> = React.forwardRef<HTMLDivElement, MenuPopoverProps>(
  (props, ref) => {
    const state = useMenuPopover(props, ref);
    state.root.className = [menuPopoverClassNames.root, styles.MenuPopover, state.root.className]
      .filter(Boolean)
      .join(' ');
    return renderMenuPopover(state);
  },
);

MenuPopover.displayName = 'MenuPopover';
