'use client';

import * as React from 'react';
import {
  renderTeachingPopoverTitle,
  useTeachingPopoverTitle,
  type TeachingPopoverTitleProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import { slot, type ExtractSlotProps, type ForwardRefComponent } from '@fluentui/react-utilities';
import { usePopoverVisualContext } from '../../Popover/PopoverVisualContext.js';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverTitleClassNames = {
  root: 'fui-TeachingPopoverTitle',
  dismissButton: 'fui-TeachingPopoverTitle__dismissButton',
} as const;

export const TeachingPopoverTitle: ForwardRefComponent<TeachingPopoverTitleProps> = React.forwardRef<
  HTMLHeadingElement,
  TeachingPopoverTitleProps
>((props, ref) => {
  const { appearance } = usePopoverVisualContext();
  const state = useTeachingPopoverTitle(props, ref);
  const dismissButtonProps = slot.resolveShorthand<
    ExtractSlotProps<TeachingPopoverTitleProps['dismissButton']> | null | undefined
  >(props.dismissButton);
  return renderTeachingPopoverTitle({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-appearance': appearance },
      teachingPopoverTitleClassNames.root,
      styles.TeachingPopoverTitle,
    ),
    dismissButton:
      state.dismissButton &&
      styleSlot(
        {
          ...state.dismissButton,
          type: state.dismissButton.type ?? 'button',
          'data-appearance': appearance,
          // A visible styled dismiss control is accessible unless the caller explicitly hides it.
          'aria-hidden': dismissButtonProps?.['aria-hidden'],
          children:
            state.dismissButton.children === undefined ? (
              <DismissRegular className={styles.TeachingPopover__glyph} />
            ) : (
              state.dismissButton.children
            ),
        },
        teachingPopoverTitleClassNames.dismissButton,
        styles.TeachingPopoverTitle__dismissButton,
      ),
  });
});

TeachingPopoverTitle.displayName = 'TeachingPopoverTitle';
