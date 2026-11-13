// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderCard,
  useCard,
  useCardContextValue,
  type CardProps as HeadlessCardProps,
} from '@fluentui/react-headless-components-preview/card';
import { slot, useMergedRefs, type ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Card.module.css';

export type {
  CardContextValue,
  CardOnSelectionChangeEvent,
  CardSlots,
} from '@fluentui/react-headless-components-preview/card';

export const cardClassNames = {
  root: 'fui-Card',
  floatingAction: 'fui-Card__floatingAction',
  checkbox: 'fui-Card__checkbox',
} as const;

export type CardAppearance = 'filled' | 'filled-alternative' | 'outline' | 'subtle';
export type CardSize = 'small' | 'medium' | 'large';
export type CardOrientation = 'horizontal' | 'vertical';

export type CardProps = HeadlessCardProps & {
  /** Visual emphasis. @default 'filled' */
  appearance?: CardAppearance;
  /** Controls padding, spacing, and corner radius. @default 'medium' */
  size?: CardSize;
  /** Layout of the card contents. @default 'vertical' */
  orientation?: CardOrientation;
};

/**
 * Selection follows the public headless contract. Unlike stock Card, nested controls
 * do not automatically block selection; supply `shouldRestrictTriggerAction` when needed.
 */
export const Card: ForwardRefComponent<CardProps> = React.forwardRef<HTMLDivElement, CardProps>(
  ({ appearance = 'filled', size = 'medium', orientation = 'vertical', ...props }, ref) => {
    const checkbox = slot.resolveShorthand(props.checkbox);
    const floatingAction = slot.resolveShorthand(props.floatingAction);
    const { ref: checkboxRef, ...checkboxProps } = checkbox ?? {};
    const { ref: floatingActionRef, ...floatingActionProps } = floatingAction ?? {};
    // The headless selection guard needs its own slot refs as well as the consumer's refs.
    const state = useCard(
      {
        ...props,
        checkbox: checkbox && 'ref' in checkbox ? checkboxProps : props.checkbox,
        floatingAction: floatingAction && 'ref' in floatingAction ? floatingActionProps : props.floatingAction,
      },
      ref,
    );
    const mergedCheckboxRef = useMergedRefs(state.checkbox?.ref, checkboxRef);
    const mergedFloatingActionRef = useMergedRefs(state.floatingAction?.ref, floatingActionRef);
    const context = useCardContextValue(state);

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-orientation': orientation,
      'data-interactive': !state.disabled && (state.interactive || state.selectable) ? '' : undefined,
      'data-selectable': state.selectable ? '' : undefined,
    });
    state.root.className = [cardClassNames.root, styles.Card, state.root.className].filter(Boolean).join(' ');

    if (state.floatingAction) {
      state.floatingAction.ref = mergedFloatingActionRef;
      state.floatingAction.className = [
        cardClassNames.floatingAction,
        styles.Card__floatingAction,
        state.floatingAction.className,
      ]
        .filter(Boolean)
        .join(' ');
    }
    if (state.checkbox) {
      state.checkbox.ref = mergedCheckboxRef;
      state.checkbox.className = [cardClassNames.checkbox, styles.Card__checkbox, state.checkbox.className]
        .filter(Boolean)
        .join(' ');
    }

    return renderCard(state, context);
  },
);

Card.displayName = 'Card';
