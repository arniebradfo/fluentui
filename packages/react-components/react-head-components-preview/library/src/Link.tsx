// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderLink,
  useLink,
  useLinkContext,
  type LinkProps as HeadlessLinkProps,
} from '@fluentui/react-headless-components-preview/link';
import { useBackgroundAppearance } from '@fluentui/react-shared-contexts';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './Link.module.css';

export type { LinkSlots } from '@fluentui/react-headless-components-preview/link';

export const linkClassNames = {
  root: 'fui-Link',
} as const;

export type LinkProps = HeadlessLinkProps & {
  /** Visual emphasis. @default 'default' */
  appearance?: 'default' | 'subtle';
  /** Underlines a link used alongside text. Inherits the public Link context when omitted. */
  inline?: boolean;
};

export const Link: ForwardRefComponent<LinkProps> = React.forwardRef<HTMLSpanElement, LinkProps>(
  ({ appearance = 'default', inline: inlineProp, ...props }, ref) => {
    const { inline: inlineContext } = useLinkContext();
    const inline = inlineProp ?? !!inlineContext;
    const backgroundAppearance = useBackgroundAppearance();
    const state = useLink(props, ref);

    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-background-appearance': backgroundAppearance,
      'data-inline': inline ? '' : undefined,
      'data-has-href': state.root.as === 'a' && state.root.href ? '' : undefined,
    });
    state.root.className = [linkClassNames.root, styles.Link, state.root.className].filter(Boolean).join(' ');

    return renderLink(state);
  },
);

Link.displayName = 'Link';
