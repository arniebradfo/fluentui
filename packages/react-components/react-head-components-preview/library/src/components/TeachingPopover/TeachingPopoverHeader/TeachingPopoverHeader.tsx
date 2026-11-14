'use client';

import * as React from 'react';
import {
  renderTeachingPopoverHeader,
  useTeachingPopoverHeader,
  type TeachingPopoverHeaderProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { Dismiss12Regular } from '@fluentui/react-icons/headless/svg/dismiss';
import { Lightbulb16Regular } from '@fluentui/react-icons/headless/svg/lightbulb';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { usePopoverVisualContext } from '../../Popover/PopoverVisualContext.js';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverHeaderClassNames = {
  root: 'fui-TeachingPopoverHeader',
  icon: 'fui-TeachingPopoverHeader__icon',
  dismissButton: 'fui-TeachingPopoverHeader__dismissButton',
} as const;

export const TeachingPopoverHeader: ForwardRefComponent<TeachingPopoverHeaderProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverHeaderProps
>((props, ref) => {
  const { appearance } = usePopoverVisualContext();
  const state = useTeachingPopoverHeader(props, ref);
  return renderTeachingPopoverHeader({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-appearance': appearance },
      teachingPopoverHeaderClassNames.root,
      styles.TeachingPopoverHeader,
    ),
    icon:
      state.icon &&
      styleSlot(
        {
          ...state.icon,
          'data-appearance': appearance,
          children:
            state.icon.children === undefined ? (
              <Lightbulb16Regular className={styles.TeachingPopover__glyph} />
            ) : (
              state.icon.children
            ),
        },
        teachingPopoverHeaderClassNames.icon,
        styles.TeachingPopoverHeader__icon,
      ),
    dismissButton:
      state.dismissButton &&
      styleSlot(
        {
          ...state.dismissButton,
          type: state.dismissButton.type ?? 'button',
          'data-appearance': appearance,
          children:
            state.dismissButton.children === undefined ? (
              <Dismiss12Regular className={styles.TeachingPopover__glyph} />
            ) : (
              state.dismissButton.children
            ),
        },
        teachingPopoverHeaderClassNames.dismissButton,
        styles.TeachingPopoverHeader__dismissButton,
      ),
  });
});

TeachingPopoverHeader.displayName = 'TeachingPopoverHeader';
