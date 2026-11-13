// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { StarFilled, StarRegular } from '@fluentui/react-icons/headless/svg/star';
import styles from './RatingItem.module.css';

export const RatingFilledIcon = (): React.ReactElement => <StarFilled className={styles.RatingItem__glyph} />;

export const RatingOutlineIcon = (): React.ReactElement => <StarRegular className={styles.RatingItem__glyph} />;
