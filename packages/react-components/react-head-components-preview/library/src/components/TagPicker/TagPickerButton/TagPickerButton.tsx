// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderTagPickerButton,
  useTagPickerButton,
  useTagPickerContext_unstable,
  type TagPickerButtonProps as HeadlessTagPickerButtonProps,
} from '@fluentui/react-headless-components-preview/tag-picker';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './TagPickerButton.module.css';

export type {
  TagPickerButtonSlots,
  TagPickerButtonState,
} from '@fluentui/react-headless-components-preview/tag-picker';

/** Size and appearance are supplied by the enclosing TagPicker. */
export type TagPickerButtonProps = HeadlessTagPickerButtonProps;

export const tagPickerButtonClassNames = { root: 'fui-TagPickerButton' } as const;

export const TagPickerButton: ForwardRefComponent<TagPickerButtonProps> = React.forwardRef<
  HTMLButtonElement,
  TagPickerButtonProps
>((props, ref) => {
  const size = useTagPickerContext_unstable(context => context.size);
  const state = useTagPickerButton(props, ref);
  Object.assign(state.root, {
    'data-size': size,
    'data-has-selected-option': state.hasSelectedOption ? '' : undefined,
  });
  state.root.className = [tagPickerButtonClassNames.root, styles.TagPickerButton, state.root.className]
    .filter(Boolean)
    .join(' ');
  return renderTagPickerButton(state);
});

TagPickerButton.displayName = 'TagPickerButton';
