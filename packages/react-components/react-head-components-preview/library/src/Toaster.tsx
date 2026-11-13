// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import type * as React from 'react';
import {
  renderToaster,
  useToaster,
  type ToasterProps,
  type ToasterState,
} from '@fluentui/react-headless-components-preview/toast';
import { slot } from '@fluentui/react-utilities';
import styles from './Toaster.module.css';
import containerStyles from './ToastContainer.module.css';

export {
  useToastController,
  type ToasterId,
  type ToasterProps,
  type ToasterSlots,
  type ToasterState,
} from '@fluentui/react-headless-components-preview/toast';

export const toasterClassNames = { root: 'fui-Toaster' } as const;

const positions = [
  ['top', 'top'],
  ['topStart', 'top-start'],
  ['topEnd', 'top-end'],
  ['bottom', 'bottom'],
  ['bottomStart', 'bottom-start'],
  ['bottomEnd', 'bottom-end'],
] as const;

function isShorthandOffset(
  offset: NonNullable<ToasterProps['offset']>,
): offset is { horizontal?: number; vertical?: number } {
  return 'horizontal' in offset || 'vertical' in offset;
}

const useStyledToaster = (props: ToasterProps): ToasterState => {
  const state = useToaster(props);
  const styledState = { ...state };
  for (const [slotName, position] of positions) {
    const positionSlot = state[slotName];
    if (!positionSlot) {
      continue;
    }
    const offset = state.offset;
    const resolvedOffset = offset && (isShorthandOffset(offset) ? offset : offset[position]);
    const className = [
      toasterClassNames.root,
      styles.Toaster,
      containerStyles.Toaster__containers,
      positionSlot.className,
    ]
      .filter(Boolean)
      .join(' ');
    const offsetVariables: React.CSSProperties & {
      '--fui-toast-offset-horizontal'?: string;
      '--fui-toast-offset-vertical'?: string;
    } = {
      '--fui-toast-offset-horizontal':
        resolvedOffset?.horizontal === undefined ? undefined : `${resolvedOffset.horizontal}px`,
      '--fui-toast-offset-vertical':
        resolvedOffset?.vertical === undefined ? undefined : `${resolvedOffset.vertical}px`,
    };
    styledState[slotName] = slot.always(
      {
        ...positionSlot,
        className,
        dir: positionSlot.dir ?? state.dir,
        style: { ...offsetVariables, ...positionSlot.style },
      },
      { elementType: 'div' },
    );
  }
  return styledState;
};

export const Toaster = (props: ToasterProps): React.ReactElement => renderToaster(useStyledToaster(props));

Toaster.displayName = 'Toaster';
