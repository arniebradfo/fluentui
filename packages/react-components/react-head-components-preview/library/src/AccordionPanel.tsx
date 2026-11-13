// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderAccordionPanel,
  useAccordionPanel,
  type AccordionPanelProps,
  type AccordionPanelSlots as HeadlessAccordionPanelSlots,
} from '@fluentui/react-headless-components-preview/accordion';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './AccordionPanel.module.css';

export type { AccordionPanelProps } from '@fluentui/react-headless-components-preview/accordion';
export type AccordionPanelSlots = Pick<HeadlessAccordionPanelSlots, 'root'>;

export const accordionPanelClassNames = {
  root: 'fui-AccordionPanel',
} as const;

export const AccordionPanel: ForwardRefComponent<AccordionPanelProps> = React.forwardRef<
  HTMLDivElement,
  AccordionPanelProps
>((props, ref) => {
  const state = useAccordionPanel(props, ref);

  state.root.className = [accordionPanelClassNames.root, styles.AccordionPanel, state.root.className]
    .filter(Boolean)
    .join(' ');

  return renderAccordionPanel(state);
});

AccordionPanel.displayName = 'AccordionPanel';
