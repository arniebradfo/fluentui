'use client';

import * as React from 'react';
import {
  renderTeachingPopoverCarouselNav,
  useTeachingPopoverCarouselNav,
  type TeachingPopoverCarouselNavProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverCarouselNavClassNames = {
  root: 'fui-TeachingPopoverCarouselNav',
} as const;

/** The public headless tablist does not yet wire arrow-key focus navigation. */
export const TeachingPopoverCarouselNav: ForwardRefComponent<TeachingPopoverCarouselNavProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselNavProps
>((props, ref) => {
  const state = useTeachingPopoverCarouselNav(props, ref);
  return renderTeachingPopoverCarouselNav({
    ...state,
    root: styleSlot(state.root, teachingPopoverCarouselNavClassNames.root, styles.TeachingPopoverCarouselNav),
  });
});

TeachingPopoverCarouselNav.displayName = 'TeachingPopoverCarouselNav';
