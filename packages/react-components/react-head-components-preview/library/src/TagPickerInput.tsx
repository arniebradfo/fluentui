// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderTagPickerInput,
  useTagPickerContext_unstable,
  useTagPickerInput,
  type TagPickerInputProps as HeadlessTagPickerInputProps,
} from '@fluentui/react-headless-components-preview/tag-picker';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './TagPickerInput.module.css';

export type { TagPickerInputSlots, TagPickerInputState } from '@fluentui/react-headless-components-preview/tag-picker';

/** Size and appearance are supplied by the enclosing TagPicker. */
export type TagPickerInputProps = HeadlessTagPickerInputProps;

export const tagPickerInputClassNames = { root: 'fui-TagPickerInput' } as const;

export const TagPickerInput: ForwardRefComponent<TagPickerInputProps> = React.forwardRef<
  HTMLInputElement,
  TagPickerInputProps
>((props, ref) => {
  const size = useTagPickerContext_unstable(context => context.size);
  const state = useTagPickerInput(props, ref);
  Object.assign(state.root, { 'data-size': size });
  state.root.className = [tagPickerInputClassNames.root, styles.TagPickerInput, state.root.className]
    .filter(Boolean)
    .join(' ');
  return renderTagPickerInput(state);
});

TagPickerInput.displayName = 'TagPickerInput';
