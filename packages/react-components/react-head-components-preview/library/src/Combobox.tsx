// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCombobox,
  useCombobox,
  useComboboxContextValues,
  type ComboboxProps as HeadlessComboboxProps,
} from '@fluentui/react-headless-components-preview/combobox';
import { useFieldContext } from '@fluentui/react-headless-components-preview/field';
import { ChevronDownRegular } from '@fluentui/react-icons/headless/svg/chevron-down';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { resolveListboxSlot } from './Listbox.js';
import type { OptionPickerVisualProps } from './OptionPickerVisuals.js';
import styles from './Combobox.module.css';

export { useComboboxFilter } from '@fluentui/react-headless-components-preview/combobox';
export type { ComboboxSlots } from '@fluentui/react-headless-components-preview/combobox';

export type ComboboxProps = HeadlessComboboxProps & OptionPickerVisualProps;
export type ComboboxOpenChangeData = Parameters<NonNullable<HeadlessComboboxProps['onOpenChange']>>[1];
export type ComboboxOpenEvent = Parameters<NonNullable<HeadlessComboboxProps['onOpenChange']>>[0];
export type ComboboxActiveOptionChangeData = Parameters<NonNullable<HeadlessComboboxProps['onActiveOptionChange']>>[1];

export const comboboxClassNames = {
  root: 'fui-Combobox',
  input: 'fui-Combobox__input',
  expandIcon: 'fui-Combobox__expandIcon',
  clearIcon: 'fui-Combobox__clearIcon',
  listbox: 'fui-Combobox__listbox',
} as const;

export const Combobox: ForwardRefComponent<ComboboxProps> = React.forwardRef<HTMLInputElement, ComboboxProps>(
  ({ appearance = 'outline', size: sizeProp, ...props }, ref) => {
    const field = useFieldContext();
    const size = sizeProp ?? field?.size ?? 'medium';
    const state = useCombobox(props, ref);
    state.listbox = resolveListboxSlot(props.listbox, state.listbox);
    if (state.expandIcon && (state.expandIcon.children === null || state.expandIcon.children === undefined)) {
      state.expandIcon.children = <ChevronDownRegular aria-hidden />;
    }
    if (state.clearIcon && (state.clearIcon.children === null || state.clearIcon.children === undefined)) {
      state.clearIcon.children = <DismissRegular aria-hidden />;
    }
    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
    });
    state.root.className = [comboboxClassNames.root, styles.Combobox, state.root.className].filter(Boolean).join(' ');
    state.input.className = [comboboxClassNames.input, styles.Combobox__input, state.input.className]
      .filter(Boolean)
      .join(' ');
    Object.assign(state.input, { 'data-size': size });
    for (const [name, scopedClass] of [
      ['expandIcon', styles.Combobox__expandIcon],
      ['clearIcon', styles.Combobox__clearIcon],
      ['listbox', styles.Combobox__listbox],
    ] as const) {
      const resolved = state[name];
      if (resolved) {
        Object.assign(resolved, {
          'data-size': size,
          'data-disabled': state.input.disabled ? '' : undefined,
          'data-clearable': state.showClearIcon ? '' : undefined,
        });
        resolved.className = [comboboxClassNames[name], scopedClass, resolved.className].filter(Boolean).join(' ');
      }
    }
    return renderCombobox(state, useComboboxContextValues(state));
  },
);

Combobox.displayName = 'Combobox';
