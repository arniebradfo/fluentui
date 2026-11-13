import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import { AlphaSlider } from './AlphaSlider';
import { ColorArea } from './ColorArea';
import { ColorPicker } from './ColorPicker';
import { ColorSlider } from './ColorSlider';

describe('styled color controls', () => {
  it('retains controlled color propagation, native refs and inherited shape', () => {
    const hueRef = React.createRef<HTMLInputElement>();
    const alphaRef = React.createRef<HTMLInputElement>();
    const onColorChange = jest.fn();
    const { container, getByRole } = render(
      <ColorPicker color={{ h: 120, s: 0.5, v: 0.75, a: 0.3 }} shape="square" onColorChange={onColorChange}>
        <ColorSlider ref={hueRef} aria-label="Hue" channel="hue" />
        <AlphaSlider ref={alphaRef} aria-label="Opacity" />
        <ColorArea inputX={{ 'aria-label': 'Saturation' }} inputY={{ 'aria-label': 'Value' }} />
      </ColorPicker>,
    );
    expect(hueRef.current).toBe(getByRole('slider', { name: 'Hue' }));
    expect(alphaRef.current).toBe(getByRole('slider', { name: 'Opacity' }));
    expect(container.querySelector('.ColorSlider')).toHaveAttribute('data-shape', 'square');
    expect(container.querySelector('.AlphaSlider')).toHaveAttribute('data-shape', 'square');
    expect(container.querySelector('.ColorArea')).toHaveAttribute('data-shape', 'square');
    expect(getByRole('slider', { name: 'Saturation' })).toHaveValue('50');
    expect(getByRole('slider', { name: 'Value' })).toHaveValue('75');
    fireEvent.change(getByRole('slider', { name: 'Hue' }), { target: { value: '180' } });
    expect(onColorChange).toHaveBeenCalledTimes(1);
    expect(onColorChange.mock.calls[0][1]).toMatchObject({ color: { h: 180, s: 0.5, v: 0.75, a: 0.3 } });
    expect(getByRole('slider', { name: 'Hue' })).toHaveValue('120');
  });

  it.each(['ltr', 'rtl'] as const)('keeps ColorArea on the physical X axis in %s', dir => {
    const ref = React.createRef<HTMLDivElement>();
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <Provider dir={dir}>
        <ColorArea
          ref={ref}
          defaultColor={{ h: 120, s: 0.5, v: 0.75 }}
          inputX={{ 'aria-label': 'Saturation' }}
          inputY={{ 'aria-label': 'Value' }}
          onChange={onChange}
        />
      </Provider>,
    );
    const root = container.querySelector<HTMLElement>('.ColorArea')!;
    expect(ref.current).toBe(root);
    fireEvent.keyDown(getByRole('slider', { name: 'Saturation' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(root.style.getPropertyValue('--fui-AreaX--progress')).toBe('51%');
    expect(root.style.getPropertyValue('--fui-AreaY--progress')).toBe('75%');
    expect(getByRole('slider', { name: 'Saturation' })).toHaveValue('51');
  });

  it.each([false, true])('preserves native alpha progress when transparency=%s', transparency => {
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <AlphaSlider
        aria-label="Alpha"
        defaultColor={{ h: 120, s: 0.5, v: 0.75, a: 0.3 }}
        transparency={transparency}
        vertical
        onChange={onChange}
      />,
    );
    const root = container.querySelector<HTMLElement>('.AlphaSlider')!;
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root.style.getPropertyValue('--fui-AlphaSlider--progress')).toBe(transparency ? '70%' : '30%');
    fireEvent.change(getByRole('slider'), { target: { value: '40' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1].color.a).toBe(transparency ? 0.6 : 0.4);
    expect(root.style.getPropertyValue('--fui-AlphaSlider--progress')).toBe('40%');
  });
});
