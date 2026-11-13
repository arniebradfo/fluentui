import type * as React from 'react';
import { applyButtonVariantStyles } from './ButtonVariants.js';

export type ToolbarButtonAppearance = 'primary' | 'subtle' | 'transparent';
export type ToolbarButtonSize = 'small' | 'medium' | 'large';

export function applyToolbarButtonStyles(
  state: {
    root: { className?: string; children?: React.ReactNode };
    icon?: { className?: string };
    iconPosition: 'before' | 'after';
  },
  appearance: ToolbarButtonAppearance,
  size: ToolbarButtonSize,
  markers: { root: string; icon: string },
  classes: { root: string; icon: string },
): void {
  applyButtonVariantStyles(state, { appearance, size, shape: 'rounded' }, markers, classes);
  Object.assign(state.root, { 'data-icon-position': state.iconPosition });
}
