// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderInteractionTagSecondary,
  useInteractionTagSecondary,
  type InteractionTagSecondaryProps,
} from '@fluentui/react-headless-components-preview/interaction-tag';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import { InteractionTagVisualContext } from './TagVisualContext.js';
import styles from './InteractionTagSecondary.module.css';

export type {
  InteractionTagSecondaryProps,
  InteractionTagSecondarySlots,
  InteractionTagSecondaryState,
} from '@fluentui/react-headless-components-preview/interaction-tag';

export const interactionTagSecondaryClassNames = { root: 'fui-InteractionTagSecondary' } as const;

export const InteractionTagSecondary: ForwardRefComponent<InteractionTagSecondaryProps> = React.forwardRef<
  HTMLButtonElement,
  InteractionTagSecondaryProps
>((props, ref) => {
  const context = React.useContext(InteractionTagVisualContext);
  const appearance = context?.appearance ?? 'filled';
  const shape = context?.shape ?? 'rounded';
  const size = context?.size ?? 'medium';
  const state = useInteractionTagSecondary(props, ref);
  state.root.children ??= <DismissRegular className={styles.InteractionTagSecondary__glyph} />;
  state.root.className = [interactionTagSecondaryClassNames.root, styles.InteractionTagSecondary, state.root.className]
    .filter(Boolean)
    .join(' ');
  Object.assign(state.root, {
    'data-appearance': appearance,
    'data-shape': shape,
    'data-size': size,
  });
  return renderInteractionTagSecondary(state);
});

InteractionTagSecondary.displayName = 'InteractionTagSecondary';
