'use client';

import * as React from 'react';
import {
  renderNavCategory,
  useNavCategory,
  useNavCategoryContextValues,
  type NavCategoryProps,
} from '@fluentui/react-headless-components-preview/nav';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export type { NavCategoryProps, NavCategoryState } from '@fluentui/react-headless-components-preview/nav';

// NavCategory is a context boundary, not a DOM element, as in the public primitive.
export const NavCategory: ForwardRefComponent<NavCategoryProps> = React.forwardRef<never, NavCategoryProps>(
  (props, ref) => {
    const state = useNavCategory(props, ref);
    return renderNavCategory(state, useNavCategoryContextValues(state));
  },
);
NavCategory.displayName = 'NavCategory';
