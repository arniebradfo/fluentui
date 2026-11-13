import * as React from 'react';
import { Default as ColorPickerDefault } from '../../../react-color-picker/stories/src/ColorPicker/ColorPickerDefault.stories';
import { Default as SwatchPickerDefault } from '../../../react-swatch-picker/stories/src/SwatchPicker/SwatchPickerDefault.stories';
import { Default as RatingDefault } from '../../../react-rating/stories/src/Rating/RatingDefault.stories';
import { Default as RatingDisplayDefault } from '../../../react-rating/stories/src/RatingDisplay/RatingDisplayDefault.stories';

export default {
  title: 'CSS Modules/Color and rating',
  parameters: {
    docs: {
      description: {
        component:
          'V9 color and rating examples use the candidate components. The controlled ColorPicker combines ColorArea, ColorSlider, AlphaSlider, Input and SpinButton. Stock preview colors and demo layout are preserved.',
      },
    },
  },
};

export const ColorPicker = () => <ColorPickerDefault />;
export const Swatches = () => <SwatchPickerDefault />;
export const Rating = () => <RatingDefault aria-label="Rate this example" defaultValue={3} />;
export const RatingDisplay = () => <RatingDisplayDefault />;
