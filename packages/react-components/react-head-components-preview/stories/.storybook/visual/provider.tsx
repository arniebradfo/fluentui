'use client';

import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import {
  FluentProvider as CandidateProvider,
  type FluentProviderProps,
} from '../../../library/src/components/Provider/FluentProvider';

type VisualProviderProps = FluentProviderProps & { applyStylesToPortals?: boolean };

// The shared v9 theme decorator disables legacy portal styling. Native top-layer surfaces inherit their theme.
export const FluentProvider: ForwardRefComponent<VisualProviderProps> = React.forwardRef(
  ({ applyStylesToPortals: _applyStylesToPortals, ...props }, ref) => <CandidateProvider {...props} ref={ref} />,
);

FluentProvider.displayName = 'VisualFluentProvider';
