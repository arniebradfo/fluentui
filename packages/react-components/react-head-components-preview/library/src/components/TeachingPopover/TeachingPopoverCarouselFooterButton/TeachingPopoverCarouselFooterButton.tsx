'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopoverCarouselFooterButton,
  useTeachingPopoverCarouselFooterButton,
  type TeachingPopoverCarouselFooterButtonProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { slot, type ForwardRefComponent } from '@fluentui/react-utilities';
import { Button } from '../../Button/Button.js';
import { usePopoverVisualContext } from '../../Popover/PopoverVisualContext.js';
import { styleSlot } from '../styleSlot.js';
import styles from '../TeachingPopover.module.css';

export const teachingPopoverCarouselFooterButtonClassNames = {
  root: 'fui-TeachingPopoverCarouselFooterButton',
} as const;

export const TeachingPopoverCarouselFooterButton: ForwardRefComponent<TeachingPopoverCarouselFooterButtonProps> =
  React.forwardRef<HTMLButtonElement | HTMLAnchorElement, TeachingPopoverCarouselFooterButtonProps>((props, ref) => {
    const { appearance: popoverAppearance } = usePopoverVisualContext();
    const { appearance: appearanceProp, size, shape, ...behaviorProps } = props;
    const appearance =
      'appearance' in props
        ? appearanceProp ?? 'secondary'
        : props.navType === 'next'
        ? popoverAppearance === 'brand'
          ? 'secondary'
          : 'primary'
        : popoverAppearance === 'brand'
        ? 'outline'
        : 'secondary';
    const state = useTeachingPopoverCarouselFooterButton(behaviorProps, ref);
    const brandRecipe =
      popoverAppearance === 'brand' &&
      (appearance === 'secondary' || appearance === 'outline') &&
      !props.disabled &&
      !props.disabledFocusable;
    // Keep navigation and trailing-step text from the public footer hook.
    // Button supplies its standard native type, ARIA, disabled and icon semantics.
    return renderTeachingPopoverCarouselFooterButton({
      ...state,
      components: { root: Button },
      root: slot.always(
        styleSlot(
          {
            ...state.root,
            'data-appearance': appearance,
            'data-popover-appearance': popoverAppearance,
            'data-nav-type': state.navType,
            'data-brand-nav': brandRecipe ? state.navType : undefined,
            'data-brand-background': brandRecipe && appearance === 'secondary' ? '' : undefined,
            appearance,
            size,
            shape,
            icon: props.icon,
            iconPosition: props.iconPosition,
            disabled: props.disabled,
            disabledFocusable: props.disabledFocusable,
          },
          teachingPopoverCarouselFooterButtonClassNames.root,
          styles.TeachingPopoverCarouselFooterButton,
        ),
        { elementType: Button },
      ),
    });
  });

TeachingPopoverCarouselFooterButton.displayName = 'TeachingPopoverCarouselFooterButton';
