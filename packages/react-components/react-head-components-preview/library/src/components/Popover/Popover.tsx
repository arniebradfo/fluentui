'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderPopover,
  usePopover,
  usePopoverContextValues,
  type PopoverProps as HeadlessPopoverProps,
} from '@fluentui/react-headless-components-preview/popover';
import { PopoverVisualContext, type PopoverVisualOptions } from './PopoverVisualContext.js';

export { usePopoverContext, usePopoverContextValues } from '@fluentui/react-headless-components-preview/popover';
export type {
  OnOpenChangeData as PopoverOnOpenChangeData,
  OpenPopoverEvents,
  PopoverContextValue,
  PopoverState,
} from '@fluentui/react-headless-components-preview/popover';
export type { PopoverAppearance, PopoverSize } from './PopoverVisualContext.js';

/**
 * Native anchored popover with Fluent visuals.
 * Pointer-relative context-menu placement remains limited by the public headless positioning hook.
 */
export type PopoverProps = HeadlessPopoverProps & PopoverVisualOptions;

export const Popover = (props: PopoverProps): React.ReactElement => {
  const { appearance, size = 'medium', ...behaviorProps } = props;
  const state = usePopover(behaviorProps);
  const contextValues = usePopoverContextValues(state);
  const visual = React.useMemo(() => ({ appearance, size }), [appearance, size]);

  return (
    <PopoverVisualContext.Provider value={visual}>{renderPopover(state, contextValues)}</PopoverVisualContext.Provider>
  );
};

Popover.displayName = 'Popover';
