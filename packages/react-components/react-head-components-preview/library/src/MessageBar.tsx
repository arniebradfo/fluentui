// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderMessageBar,
  useMessageBar,
  useMessageBarContextValues,
  type MessageBarProps as HeadlessMessageBarProps,
} from '@fluentui/react-headless-components-preview/message-bar';
import { InfoFilled } from '@fluentui/react-icons/headless/svg/info';
import { WarningFilled } from '@fluentui/react-icons/headless/svg/warning';
import { DiamondDismissFilled } from '@fluentui/react-icons/headless/svg/diamond-dismiss';
import { CheckmarkCircleFilled } from '@fluentui/react-icons/headless/svg/checkmark-circle';
import { slot, type ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './MessageBar.module.css';

export {
  useMessageBarContext,
  type MessageBarContextValues,
  type MessageBarIntent,
  type MessageBarSlots,
  type MessageBarState,
} from '@fluentui/react-headless-components-preview/message-bar';

export const messageBarClassNames = {
  root: 'fui-MessageBar',
  icon: 'fui-MessageBar__icon',
  bottomReflowSpacer: 'fui-MessageBar__bottomReflowSpacer',
} as const;

export type MessageBarShape = 'rounded' | 'square';

export type MessageBarProps = HeadlessMessageBarProps & {
  /** Rounded for component messages; square for page messages. @default 'rounded' */
  shape?: MessageBarShape;
};

const intentIcons = {
  info: InfoFilled,
  warning: WarningFilled,
  error: DiamondDismissFilled,
  success: CheckmarkCircleFilled,
};

export const MessageBar: ForwardRefComponent<MessageBarProps> = React.forwardRef<HTMLDivElement, MessageBarProps>(
  ({ shape = 'rounded', ...props }, ref) => {
    const state = useMessageBar(props, ref);
    const context = useMessageBarContextValues(state);
    const IntentIcon = intentIcons[state.intent];

    state.icon = slot.optional(props.icon, {
      defaultProps: { children: <IntentIcon aria-hidden /> },
      renderByDefault: true,
      elementType: 'div',
    });
    Object.assign(state.root, { 'data-shape': shape });
    state.root.className = [messageBarClassNames.root, styles.MessageBar, state.root.className]
      .filter(Boolean)
      .join(' ');

    if (state.icon) {
      Object.assign(state.icon, { 'data-intent': state.intent });
      state.icon.className = [messageBarClassNames.icon, styles.MessageBar__icon, state.icon.className]
        .filter(Boolean)
        .join(' ');
    }
    if (state.bottomReflowSpacer) {
      state.bottomReflowSpacer.className = [
        messageBarClassNames.bottomReflowSpacer,
        styles.MessageBar__bottomReflowSpacer,
        state.bottomReflowSpacer.className,
      ]
        .filter(Boolean)
        .join(' ');
    }

    return renderMessageBar(state, context);
  },
);

MessageBar.displayName = 'MessageBar';
