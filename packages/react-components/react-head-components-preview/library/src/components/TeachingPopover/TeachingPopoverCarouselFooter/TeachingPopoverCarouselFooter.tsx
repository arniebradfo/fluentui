'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverCarouselFooter,
  useTeachingPopoverCarouselFooter,
  type TeachingPopoverCarouselFooterButtonProps,
  type TeachingPopoverCarouselFooterProps as HeadlessCarouselFooterProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { slot, type ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';
import { TeachingPopoverCarouselFooterButton } from '../TeachingPopoverCarouselFooterButton/TeachingPopoverCarouselFooterButton.js';
import styles from '../TeachingPopover.module.css';

export type TeachingPopoverCarouselFooterProps = HeadlessCarouselFooterProps & {
  /**
   * Visual alignment; the public previous/children/next DOM and Tab order are unchanged.
   * @default 'centered'
   */
  layout?: 'centered' | 'offset';
};

export const teachingPopoverCarouselFooterClassNames = {
  root: 'fui-TeachingPopoverCarouselFooter',
  previous: 'fui-TeachingPopoverCarouselFooter__previous',
  next: 'fui-TeachingPopoverCarouselFooter__next',
} as const;

export const TeachingPopoverCarouselFooter: ForwardRefComponent<TeachingPopoverCarouselFooterProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselFooterProps
>(({ layout = 'centered', ...props }, ref) => {
  const state = useTeachingPopoverCarouselFooter(props, ref);
  return renderTeachingPopoverCarouselFooter({
    ...state,
    components: {
      root: 'div',
      previous: TeachingPopoverCarouselFooterButton,
      next: TeachingPopoverCarouselFooterButton,
    },
    root: styleSlot(
      {
        ...state.root,
        'data-layout': layout,
        'data-has-previous': state.previous ? '' : undefined,
      },
      teachingPopoverCarouselFooterClassNames.root,
      styles.TeachingPopoverCarouselFooter,
    ),
    previous:
      state.previous &&
      slot.always<TeachingPopoverCarouselFooterButtonProps>(
        styleSlot(
          state.previous,
          teachingPopoverCarouselFooterClassNames.previous,
          styles.TeachingPopoverCarouselFooter__previous,
        ),
        { elementType: TeachingPopoverCarouselFooterButton },
      ),
    next: slot.always<TeachingPopoverCarouselFooterButtonProps>(
      styleSlot(state.next, teachingPopoverCarouselFooterClassNames.next, styles.TeachingPopoverCarouselFooter__next),
      { elementType: TeachingPopoverCarouselFooterButton },
    ),
  });
});

TeachingPopoverCarouselFooter.displayName = 'TeachingPopoverCarouselFooter';
