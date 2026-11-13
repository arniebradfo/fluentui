// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { ChevronLeftFilled, ChevronLeftRegular } from '@fluentui/react-icons/headless/svg/chevron-left';
import { ChevronRightFilled, ChevronRightRegular } from '@fluentui/react-icons/headless/svg/chevron-right';
import styles from './MenuItem.module.css';

export const MenuSubmenuGlyph = ({ dir }: { dir: 'ltr' | 'rtl' }): React.ReactElement => {
  const Regular = dir === 'rtl' ? ChevronLeftRegular : ChevronRightRegular;
  const Filled = dir === 'rtl' ? ChevronLeftFilled : ChevronRightFilled;
  return (
    <>
      <Regular className={styles.MenuItem__glyph} data-menu-icon-kind="regular" aria-hidden />
      <Filled className={styles.MenuItem__glyph} data-menu-icon-kind="filled" aria-hidden />
    </>
  );
};
