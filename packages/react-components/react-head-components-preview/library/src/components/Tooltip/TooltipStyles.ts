// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { TooltipState } from '@fluentui/react-headless-components-preview/tooltip';
import styles from './Tooltip.module.css';

export type TooltipAppearance = 'normal' | 'inverted';

export const tooltipClassNames = {
  content: 'fui-Tooltip__content',
} as const;

export function applyTooltipContentStyles(content: TooltipState['content'], appearance: TooltipAppearance): void {
  Object.assign(content, {
    'data-tooltip-content': '',
    'data-appearance': appearance,
  });
  content.className = [tooltipClassNames.content, styles.Tooltip__content, content.className].filter(Boolean).join(' ');
}
