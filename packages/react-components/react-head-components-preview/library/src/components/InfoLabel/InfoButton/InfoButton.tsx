// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import type { InfoButtonSlots as HeadlessInfoButtonSlots } from '@fluentui/react-headless-components-preview/info-label';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { InfoButtonBase, type InfoButtonBaseProps } from './InfoButtonBase.js';

export { infoButtonClassNames } from './InfoButtonBase.js';

export type InfoButtonSlots = Omit<HeadlessInfoButtonSlots, 'popover'> & {
  popover: NonNullable<InfoButtonBaseProps['popover']>;
};

export type InfoButtonProps = InfoButtonBaseProps;

export const InfoButton: ForwardRefComponent<InfoButtonProps> = React.forwardRef<HTMLButtonElement, InfoButtonProps>(
  (props, ref) => {
    return <InfoButtonBase {...props} ref={ref} />;
  },
);

InfoButton.displayName = 'InfoButton';
