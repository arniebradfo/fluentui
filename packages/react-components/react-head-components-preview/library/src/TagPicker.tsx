// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import type * as React from 'react';
import {
  renderTagPicker,
  useTagPicker,
  useTagPickerContextValues,
  type TagPickerProps as HeadlessTagPickerProps,
  type TagPickerSize,
} from '@fluentui/react-headless-components-preview/tag-picker';

export {
  useTagPickerContext_unstable,
  useTagPickerContextValues,
  useTagPickerFilter,
} from '@fluentui/react-headless-components-preview/tag-picker';
export type {
  TagPickerContextValue,
  TagPickerContextValues,
  TagPickerOnOpenChangeData,
  TagPickerOnOptionSelectData,
  TagPickerSize,
  TagPickerSlots,
  TagPickerState,
} from '@fluentui/react-headless-components-preview/tag-picker';

export type TagPickerAppearance = 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';

export type TagPickerProps = HeadlessTagPickerProps & {
  /** Control appearance. @default 'outline' */
  appearance?: TagPickerAppearance;
  /** Sizes the control, input, button and selected tags. @default 'medium' */
  size?: TagPickerSize;
};

export const TagPicker = ({
  appearance = 'outline',
  size = 'medium',
  ...headlessProps
}: TagPickerProps): React.ReactElement => {
  const state = { ...useTagPicker(headlessProps), appearance, size };
  return renderTagPicker(state, useTagPickerContextValues(state));
};

TagPicker.displayName = 'TagPicker';
