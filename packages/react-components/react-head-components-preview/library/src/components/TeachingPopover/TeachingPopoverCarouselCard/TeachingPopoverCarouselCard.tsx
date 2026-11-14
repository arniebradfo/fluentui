'use client';

import * as React from 'react';
import {
  renderTeachingPopoverCarouselCard,
  useTeachingPopoverCarouselCard,
  type TeachingPopoverCarouselCardProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';

export const teachingPopoverCarouselCardClassNames = {
  root: 'fui-TeachingPopoverCarouselCard',
} as const;

export const TeachingPopoverCarouselCard: ForwardRefComponent<TeachingPopoverCarouselCardProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselCardProps
>((props, ref) => {
  const state = useTeachingPopoverCarouselCard(props, ref);
  return renderTeachingPopoverCarouselCard({
    ...state,
    root: styleSlot(state.root, teachingPopoverCarouselCardClassNames.root, undefined),
  });
});

TeachingPopoverCarouselCard.displayName = 'TeachingPopoverCarouselCard';
