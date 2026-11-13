// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderMenuGroup,
  useMenuGroup,
  useMenuGroupContextValues,
  type MenuGroupProps,
} from '@fluentui/react-headless-components-preview/menu';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export { useMenuGroupContext, useMenuGroupContextValues } from '@fluentui/react-headless-components-preview/menu';
export type {
  MenuGroupContextValue,
  MenuGroupContextValues,
  MenuGroupProps,
  MenuGroupSlots,
  MenuGroupState,
} from '@fluentui/react-headless-components-preview/menu';

export const menuGroupClassNames = { root: 'fui-MenuGroup' } as const;

export const MenuGroup: ForwardRefComponent<MenuGroupProps> = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  (props, ref) => {
    const state = useMenuGroup(props, ref);
    state.root.className = [menuGroupClassNames.root, state.root.className].filter(Boolean).join(' ');
    return renderMenuGroup(state, useMenuGroupContextValues(state));
  },
);

MenuGroup.displayName = 'MenuGroup';
