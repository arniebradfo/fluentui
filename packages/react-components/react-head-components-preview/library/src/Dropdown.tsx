// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderDropdown,
  useDropdown,
  useDropdownContextValues,
  type DropdownProps as HeadlessDropdownProps,
} from '@fluentui/react-headless-components-preview/dropdown';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { resolveListboxSlot } from './Listbox.js';
import type { OptionPickerVisualProps } from './OptionPickerVisuals.js';
import styles from './Dropdown.module.css';

export type { DropdownSlots } from '@fluentui/react-headless-components-preview/dropdown';
export type DropdownProps = HeadlessDropdownProps & OptionPickerVisualProps;
export type DropdownOpenChangeData = Parameters<NonNullable<HeadlessDropdownProps['onOpenChange']>>[1];
export type DropdownOpenEvent = Parameters<NonNullable<HeadlessDropdownProps['onOpenChange']>>[0];
export type DropdownActiveOptionChangeData = Parameters<NonNullable<HeadlessDropdownProps['onActiveOptionChange']>>[1];

export const dropdownClassNames = {
  root: 'fui-Dropdown',
  button: 'fui-Dropdown__button',
  clearButton: 'fui-Dropdown__clearButton',
  expandIcon: 'fui-Dropdown__expandIcon',
  listbox: 'fui-Dropdown__listbox',
} as const;

export const Dropdown: ForwardRefComponent<DropdownProps> = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const field = useFieldContext();
    const size = sizeProp ?? field?.size ?? 'medium';
    const state = useDropdown(props, ref);
    state.listbox = resolveListboxSlot(props.listbox, state.listbox);
    if (state.expandIcon && (state.expandIcon.children === null || state.expandIcon.children === undefined)) {
      state.expandIcon.children = <ChevronDownRegular aria-hidden />;
    }
    if (state.clearButton && (state.clearButton.children === null || state.clearButton.children === undefined)) {
      state.clearButton.children = <DismissRegular aria-hidden />;
    }
    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
    });
    state.root.className = [dropdownClassNames.root, styles.Dropdown, state.root.className].filter(Boolean).join(' ');
    state.button.className = [dropdownClassNames.button, styles.Dropdown__button, state.button.className]
      .filter(Boolean)
      .join(' ');
    Object.assign(state.button, {
      'data-size': size,
      'data-placeholder': state.placeholderVisible ? '' : undefined,
    });
    for (const [name, scopedClass] of [
      ['expandIcon', styles.Dropdown__expandIcon],
      ['clearButton', styles.Dropdown__clearButton],
      ['listbox', styles.Dropdown__listbox],
    ] as const) {
      const resolved = state[name];
      if (resolved) {
        Object.assign(resolved, {
          'data-size': size,
          'data-disabled': state.button.disabled ? '' : undefined,
          'data-clearable': state.showClearButton ? '' : undefined,
        });
        resolved.className = [dropdownClassNames[name], scopedClass, resolved.className].filter(Boolean).join(' ');
      }
    }
    return renderDropdown(state, useDropdownContextValues(state));
  },
);

Dropdown.displayName = 'Dropdown';
