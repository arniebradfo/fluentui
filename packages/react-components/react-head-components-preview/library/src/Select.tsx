// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderSelect,
  useSelect,
  type SelectProps as HeadlessSelectProps,
} from '@fluentui/react-headless-components-preview/select';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Select.module.css';

export type { SelectSlots } from '@fluentui/react-headless-components-preview/select';

export const selectClassNames = {
  root: 'fui-Select',
  select: 'fui-Select__select',
  icon: 'fui-Select__icon',
} as const;

export type SelectOnChangeData = Parameters<NonNullable<HeadlessSelectProps['onChange']>>[1];

export type SelectProps = HeadlessSelectProps & {
  /** Visual appearance. @default 'outline' */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  /** Inherits Field size when omitted. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export const Select: ForwardRefComponent<SelectProps> = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const field = useFieldContext();
    const size = sizeProp ?? field?.size ?? 'medium';
    const state = useSelect(props, ref);

    if (state.icon && (state.icon.children === null || state.icon.children === undefined)) {
      state.icon.children = <ChevronDownRegular aria-hidden />;
    }

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-required': state.select.required ? '' : undefined,
      'data-has-icon': state.icon ? '' : undefined,
    });
    state.root.className = [selectClassNames.root, styles.Select, state.root.className].filter(Boolean).join(' ');
    state.select.className = [selectClassNames.select, styles.Select__select, state.select.className]
      .filter(Boolean)
      .join(' ');
    if (state.icon) {
      state.icon.className = [selectClassNames.icon, styles.Select__icon, state.icon.className]
        .filter(Boolean)
        .join(' ');
    }

    return renderSelect(state);
  },
);

Select.displayName = 'Select';
