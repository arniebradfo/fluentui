'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverBody,
  useTeachingPopoverBody,
  type TeachingPopoverBodyProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverBodyClassNames = {
  root: 'fui-TeachingPopoverBody',
  media: 'fui-TeachingPopoverBody__media',
} as const;

export const TeachingPopoverBody: ForwardRefComponent<TeachingPopoverBodyProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverBodyProps
>((props, ref) => {
  const state = useTeachingPopoverBody(props, ref);
  return renderTeachingPopoverBody({
    ...state,
    root: styleSlot(state.root, teachingPopoverBodyClassNames.root, styles.TeachingPopoverBody),
    media:
      state.media &&
      styleSlot(
        { ...state.media, 'data-media-length': state.mediaLength },
        teachingPopoverBodyClassNames.media,
        styles.TeachingPopoverBody__media,
      ),
  });
});

TeachingPopoverBody.displayName = 'TeachingPopoverBody';
