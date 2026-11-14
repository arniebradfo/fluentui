'use client';

import * as React from 'react';
import {
  renderTeachingPopoverSurface,
  useTeachingPopoverSurface,
  type TeachingPopoverSurfaceProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import type { ForwardRefComponent, InferredElementRefType } from '@fluentui/react-utilities';
import { popoverSurfaceClassNames } from '../../Popover/PopoverSurface/PopoverSurface.js';
import { usePopoverVisualContext } from '../../Popover/PopoverVisualContext.js';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverSurfaceClassNames = { root: 'fui-TeachingPopoverSurface' } as const;

export const TeachingPopoverSurface: ForwardRefComponent<TeachingPopoverSurfaceProps> = React.forwardRef<
  InferredElementRefType<TeachingPopoverSurfaceProps>,
  TeachingPopoverSurfaceProps
>((props, ref) => {
  const { appearance, size } = usePopoverVisualContext();
  const state = useTeachingPopoverSurface(props, ref);
  return renderTeachingPopoverSurface({
    ...state,
    root: styleSlot(
      {
        ...state.root,
        'data-appearance': appearance,
        'data-size': size,
        'data-teaching-popover-surface': '',
      },
      `${popoverSurfaceClassNames.root} ${teachingPopoverSurfaceClassNames.root}`,
      styles.TeachingPopoverSurface,
    ),
  });
});

TeachingPopoverSurface.displayName = 'TeachingPopoverSurface';
