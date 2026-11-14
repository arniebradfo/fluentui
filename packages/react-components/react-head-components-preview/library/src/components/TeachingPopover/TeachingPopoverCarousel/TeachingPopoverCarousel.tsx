'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverCarousel,
  useTeachingPopoverCarousel,
  useTeachingPopoverCarouselContextValues,
  type TeachingPopoverCarouselProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';

export const teachingPopoverCarouselClassNames = { root: 'fui-TeachingPopoverCarousel' } as const;

export const TeachingPopoverCarousel: ForwardRefComponent<TeachingPopoverCarouselProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselProps
>((props, ref) => {
  const state = useTeachingPopoverCarousel(props, ref);
  const contextValues = useTeachingPopoverCarouselContextValues(state);
  return renderTeachingPopoverCarousel(
    { ...state, root: styleSlot(state.root, teachingPopoverCarouselClassNames.root, undefined) },
    contextValues,
  );
});

TeachingPopoverCarousel.displayName = 'TeachingPopoverCarousel';
