// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderAccordionItem,
  useAccordionItem,
  useAccordionItemContextValues,
  type AccordionItemProps,
} from '@fluentui/react-headless-components-preview/accordion';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import './AccordionItem.module.css';

export type { AccordionItemProps, AccordionItemSlots } from '@fluentui/react-headless-components-preview/accordion';

export type AccordionItemValue = AccordionItemProps['value'];

export const accordionItemClassNames = {
  root: 'fui-AccordionItem',
} as const;

export const AccordionItem: ForwardRefComponent<AccordionItemProps> = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>((props, ref) => {
  const state = useAccordionItem(props, ref);
  const contextValues = useAccordionItemContextValues(state);

  state.root.className = [accordionItemClassNames.root, state.root.className].filter(Boolean).join(' ');

  return renderAccordionItem(state, contextValues);
});

AccordionItem.displayName = 'AccordionItem';
