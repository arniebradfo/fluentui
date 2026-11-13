'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';

export type PopoverAppearance = 'brand' | 'inverted';
export type PopoverSize = 'small' | 'medium' | 'large';

export interface PopoverVisualOptions {
  /** Uses the normal surface colors when omitted. */
  appearance?: PopoverAppearance;
  /** Surface padding and arrow size. @default 'medium' */
  size?: PopoverSize;
}

// The public behavior context deliberately contains no visual choices.
export const PopoverVisualContext = React.createContext<PopoverVisualOptions | undefined>(undefined);

const defaultVisualOptions: PopoverVisualOptions = { size: 'medium' };

/** Standalone surface parts use standard Fluent visuals when no visual provider is present. */
export const usePopoverVisualContext = (): PopoverVisualOptions =>
  React.useContext(PopoverVisualContext) ?? defaultVisualOptions;
