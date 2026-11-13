// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import {
  renderImageSwatch,
  useImageSwatch,
  useSwatchPickerContextValue,
  type ImageSwatchProps as HeadlessImageSwatchProps,
} from '@fluentui/react-headless-components-preview/swatch-picker';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { SwatchPickerProps } from './SwatchPicker.js';
import styles from './ImageSwatch.module.css';

export type { ImageSwatchSlots, ImageSwatchState } from '@fluentui/react-headless-components-preview/swatch-picker';
export type ImageSwatchProps = HeadlessImageSwatchProps & Pick<SwatchPickerProps, 'size' | 'shape'>;

export const imageSwatchClassNames = { root: 'fui-ImageSwatch' } as const;

/** Image-backed swatch; explicit size and shape override the surrounding SwatchPicker's visuals. */
export const ImageSwatch: ForwardRefComponent<ImageSwatchProps> = React.forwardRef<HTMLButtonElement, ImageSwatchProps>(
  ({ size: sizeProp, shape: shapeProp, ...props }, ref) => {
    const contextSize = useSwatchPickerContextValue(context => context.size);
    const contextShape = useSwatchPickerContextValue(context => context.shape);
    const size = sizeProp ?? contextSize ?? 'medium';
    const shape = shapeProp ?? contextShape ?? 'square';
    const state = useImageSwatch(props, ref);
    Object.assign(state.root, { 'data-size': size, 'data-shape': shape });
    state.root.className = [imageSwatchClassNames.root, styles.ImageSwatch, state.root.className]
      .filter(Boolean)
      .join(' ');
    return renderImageSwatch(state);
  },
);

ImageSwatch.displayName = 'ImageSwatch';
