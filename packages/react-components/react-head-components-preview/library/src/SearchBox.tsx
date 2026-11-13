// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderSearchBox,
  useSearchBox,
  type SearchBoxProps as HeadlessSearchBoxProps,
} from '@fluentui/react-headless-components-preview/search-box';
import { SearchRegular } from '@fluentui/react-icons/headless/svg/search';
import { DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './SearchBox.module.css';

export type { SearchBoxSlots } from '@fluentui/react-headless-components-preview/search-box';

export const searchBoxClassNames = {
  root: 'fui-SearchBox',
  input: 'fui-SearchBox__input',
  contentBefore: 'fui-SearchBox__contentBefore',
  contentAfter: 'fui-SearchBox__contentAfter',
  dismiss: 'fui-SearchBox__dismiss',
} as const;

export type SearchBoxChangeEvent = Parameters<NonNullable<HeadlessSearchBoxProps['onChange']>>[0];
export type SearchBoxOnChangeData = Parameters<NonNullable<HeadlessSearchBoxProps['onChange']>>[1];

export type SearchBoxProps = HeadlessSearchBoxProps & {
  /** Visual appearance. @default 'outline' */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
  /** SearchBox keeps its own size rather than inheriting Field size. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
};

export const SearchBox: ForwardRefComponent<SearchBoxProps> = React.forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ appearance = 'outline', size = 'medium', ...props }, ref) => {
    const state = useSearchBox(props, ref);

    if (state.contentBefore && (state.contentBefore.children === null || state.contentBefore.children === undefined)) {
      state.contentBefore.children = <SearchRegular aria-hidden />;
    }
    if (state.dismiss && (state.dismiss.children === null || state.dismiss.children === undefined)) {
      state.dismiss.children = <DismissRegular aria-hidden />;
    }

    const invalid = state.input['aria-invalid'];
    Object.assign(state.root, {
      'data-appearance': appearance,
      'data-size': size,
      'data-disabled': state.input.disabled ? '' : undefined,
      'data-invalid':
        invalid === true || invalid === 'true'
          ? ''
          : invalid === 'grammar' || invalid === 'spelling'
          ? invalid
          : undefined,
      'data-read-only': state.input.readOnly ? '' : undefined,
      'data-has-content-before': state.contentBefore ? '' : undefined,
      'data-has-content-after': state.contentAfter ? '' : undefined,
      'data-has-dismiss': state.contentAfter && state.dismiss ? '' : undefined,
    });
    state.root.className = [searchBoxClassNames.root, styles.SearchBox, state.root.className].filter(Boolean).join(' ');
    state.input.className = [searchBoxClassNames.input, styles.SearchBox__input, state.input.className]
      .filter(Boolean)
      .join(' ');
    if (state.contentBefore) {
      state.contentBefore.className = [
        searchBoxClassNames.contentBefore,
        styles.SearchBox__contentBefore,
        state.contentBefore.className,
      ]
        .filter(Boolean)
        .join(' ');
    }
    if (state.contentAfter) {
      state.contentAfter.className = [
        searchBoxClassNames.contentAfter,
        styles.SearchBox__contentAfter,
        state.contentAfter.className,
      ]
        .filter(Boolean)
        .join(' ');
    }
    if (state.dismiss) {
      state.dismiss.className = [searchBoxClassNames.dismiss, styles.SearchBox__dismiss, state.dismiss.className]
        .filter(Boolean)
        .join(' ');
    }

    return renderSearchBox(state);
  },
);

SearchBox.displayName = 'SearchBox';
