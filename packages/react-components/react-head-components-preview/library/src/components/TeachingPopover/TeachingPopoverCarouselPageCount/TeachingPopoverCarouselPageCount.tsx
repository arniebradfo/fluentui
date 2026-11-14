'use client';

import * as React from 'react';
import {
  renderTeachingPopoverCarouselPageCount,
  useTeachingPopoverCarouselPageCount,
  type TeachingPopoverCarouselPageCountProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverCarouselPageCountClassNames = {
  root: 'fui-TeachingPopoverCarouselPageCount',
} as const;

export const TeachingPopoverCarouselPageCount: ForwardRefComponent<TeachingPopoverCarouselPageCountProps> =
  React.forwardRef<HTMLDivElement, TeachingPopoverCarouselPageCountProps>((props, ref) => {
    const state = useTeachingPopoverCarouselPageCount(props, ref);
    return renderTeachingPopoverCarouselPageCount({
      ...state,
      root: styleSlot(
        state.root,
        teachingPopoverCarouselPageCountClassNames.root,
        styles.TeachingPopoverCarouselPageCount,
      ),
    });
  });

TeachingPopoverCarouselPageCount.displayName = 'TeachingPopoverCarouselPageCount';
