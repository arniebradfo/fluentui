'use client';

import * as React from 'react';
import {
  renderTeachingPopover,
  useTeachingPopover,
  useTeachingPopoverContextValues,
  type TeachingPopoverProps as HeadlessTeachingPopoverProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { PopoverVisualContext, type PopoverVisualOptions } from '../Popover/PopoverVisualContext.js';

export type TeachingPopoverProps = HeadlessTeachingPopoverProps & PopoverVisualOptions;

export const TeachingPopover = (props: TeachingPopoverProps): React.ReactElement => {
  const { appearance, size = 'medium', ...behaviorProps } = props;
  const state = useTeachingPopover(behaviorProps);
  const contextValues = useTeachingPopoverContextValues(state);
  const visual = React.useMemo(() => ({ appearance, size }), [appearance, size]);
  return (
    <PopoverVisualContext.Provider value={visual}>
      {renderTeachingPopover(state, contextValues)}
    </PopoverVisualContext.Provider>
  );
};

TeachingPopover.displayName = 'TeachingPopover';
