import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { ColorSwatch } from './ColorSwatch';
import { EmptySwatch } from './EmptySwatch';
import { ImageSwatch } from './ImageSwatch';
import { SwatchPicker } from './SwatchPicker';
import { SwatchPickerRow } from './SwatchPickerRow';

describe('styled swatches', () => {
  it('defaults to square and retains native selection callbacks and refs', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onSelectionChange = jest.fn();
    const { getByRole } = render(
      <SwatchPicker onSelectionChange={onSelectionChange}>
        <ColorSwatch ref={ref} value="blue" color="blue" aria-label="Blue" />
      </SwatchPicker>,
    );
    const swatch = getByRole('radio', { name: 'Blue' });
    expect(swatch).toHaveAttribute('data-shape', 'square');
    expect(ref.current).toBe(swatch);
    fireEvent.click(swatch);
    expect(swatch).toHaveAttribute('aria-checked', 'true');
    expect(swatch).toHaveAttribute('data-selected', '');
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange.mock.calls[0][1]).toMatchObject({ selectedValue: 'blue', selectedSwatch: 'blue' });
  });

  it('inherits grid visuals, with explicit per-item size and shape overrides', () => {
    const { getByRole } = render(
      <SwatchPicker layout="grid" size="large" shape="circular" spacing="small">
        <SwatchPickerRow>
          <ColorSwatch value="blue" color="blue" aria-label="Blue" />
          <EmptySwatch aria-label="Empty" />
          <ImageSwatch value="image" src="image.png" aria-label="Image" size="small" shape="rounded" />
        </SwatchPickerRow>
      </SwatchPicker>,
    );
    expect(getByRole('row')).toHaveAttribute('data-spacing', 'small');
    expect(getByRole('gridcell', { name: 'Blue' })).toHaveAttribute('data-size', 'large');
    expect(getByRole('gridcell', { name: 'Blue' })).toHaveAttribute('data-shape', 'circular');
    expect(getByRole('gridcell', { name: 'Empty' })).toHaveAttribute('data-shape', 'circular');
    expect(getByRole('gridcell', { name: 'Image' })).toHaveAttribute('data-size', 'small');
    expect(getByRole('gridcell', { name: 'Image' })).toHaveAttribute('data-shape', 'rounded');
  });

  it('supplies the disabled glyph without replacing nulls or custom slot render functions', () => {
    const renderDisabledIcon: SlotRenderFunction<React.ComponentProps<'span'>> = (Component, props) => (
      <Component {...props} data-testid="disabled-icon" />
    );
    const { getByRole, getByTestId } = render(
      <SwatchPicker>
        <ColorSwatch disabled value="default" color="blue" aria-label="Default" />
        <ColorSwatch disabled value="null" color="blue" aria-label="No glyph" disabledIcon={null} />
        <ColorSwatch
          disabled
          value="custom"
          color="blue"
          aria-label="Custom"
          disabledIcon={{ children: renderDisabledIcon }}
        />
      </SwatchPicker>,
    );
    expect(getByRole('radio', { name: 'Default' }).querySelector('svg')).not.toBeNull();
    expect(getByRole('radio', { name: 'No glyph' }).querySelector('svg')).toBeNull();
    expect(getByTestId('disabled-icon')).toHaveClass('fui-ColorSwatch__disabledIcon', 'ColorSwatch__disabledIcon');
    expect(getByTestId('disabled-icon').querySelector('svg')).not.toBeNull();
  });
});
