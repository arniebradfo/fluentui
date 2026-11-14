'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverCarouselNavButton,
  useTeachingPopoverCarouselNavButton,
  type TeachingPopoverCarouselNavButtonProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { usePopoverVisualContext } from '../../Popover/PopoverVisualContext.js';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverCarouselNavButtonClassNames = {
  root: 'fui-TeachingPopoverCarouselNavButton',
} as const;

export const TeachingPopoverCarouselNavButton: ForwardRefComponent<TeachingPopoverCarouselNavButtonProps> =
  React.forwardRef<HTMLButtonElement | HTMLAnchorElement, TeachingPopoverCarouselNavButtonProps>((props, ref) => {
    const { appearance } = usePopoverVisualContext();
    const state = useTeachingPopoverCarouselNavButton(props, ref);
    return renderTeachingPopoverCarouselNavButton({
      ...state,
      root: styleSlot(
        { ...state.root, 'data-appearance': appearance },
        teachingPopoverCarouselNavButtonClassNames.root,
        styles.TeachingPopoverCarouselNavButton,
      ),
    });
  });

TeachingPopoverCarouselNavButton.displayName = 'TeachingPopoverCarouselNavButton';
