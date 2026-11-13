// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import type * as React from 'react';
import {
  renderMenu,
  useMenu,
  useMenuContextValues,
  type MenuProps,
} from '@fluentui/react-headless-components-preview/menu';

export { useMenuContext, useMenuContextValues } from '@fluentui/react-headless-components-preview/menu';
export type {
  MenuContextValue,
  MenuContextValues,
  MenuOpenChangeData,
  MenuOpenEvent,
  MenuProps,
  MenuState,
} from '@fluentui/react-headless-components-preview/menu';

export const Menu = (props: MenuProps): React.ReactElement => {
  const state = useMenu(props);
  return renderMenu(state, useMenuContextValues(state));
};

Menu.displayName = 'Menu';
