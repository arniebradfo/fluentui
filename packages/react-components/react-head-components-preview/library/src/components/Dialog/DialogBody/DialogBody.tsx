'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderDialogBody,
  useDialogBody,
  type DialogBodyProps,
} from '@fluentui/react-headless-components-preview/dialog';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './DialogBody.module.css';

export type {
  DialogBodyProps,
  DialogBodySlots,
  DialogBodyState,
} from '@fluentui/react-headless-components-preview/dialog';

export const dialogBodyClassNames = { root: 'fui-DialogBody' } as const;

/** Scrollable content; compose the header and actions directly inside DialogSurface. */
export const DialogBody: ForwardRefComponent<DialogBodyProps> = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  (props, ref) => {
    const state = useDialogBody(props, ref);
    state.root.className = [dialogBodyClassNames.root, styles.DialogBody, state.root.className]
      .filter(Boolean)
      .join(' ');
    return renderDialogBody(state);
  },
);

DialogBody.displayName = 'DialogBody';
