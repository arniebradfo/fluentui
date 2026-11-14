'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverFooter,
  useTeachingPopoverFooter,
  type TeachingPopoverFooterProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverFooterClassNames = { root: 'fui-TeachingPopoverFooter' } as const;

export const TeachingPopoverFooter: ForwardRefComponent<TeachingPopoverFooterProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverFooterProps
>((props, ref) => {
  const state = useTeachingPopoverFooter(props, ref);
  return renderTeachingPopoverFooter({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-footer-layout': state.footerLayout },
      teachingPopoverFooterClassNames.root,
      styles.TeachingPopoverFooter,
    ),
  });
});

TeachingPopoverFooter.displayName = 'TeachingPopoverFooter';
