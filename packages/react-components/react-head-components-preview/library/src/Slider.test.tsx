import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import { Slider } from './Slider';

describe('styled Slider', () => {
  it.each([
    ['ltr', false, '90deg'],
    ['rtl', false, '270deg'],
    ['ltr', true, '0deg'],
    ['rtl', true, '0deg'],
  ] as const)('keeps native progress and direction for %s, vertical=%s', (dir, vertical, direction) => {
    const ref = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <Provider dir={dir}>
        <Slider
          ref={ref}
          aria-label="Volume"
          min={10}
          max={30}
          step={5}
          defaultValue={20}
          vertical={vertical}
          onChange={onChange}
        />
      </Provider>,
    );
    const root = container.querySelector<HTMLElement>('.Slider')!;
    expect(ref.current).toBe(getByRole('slider'));
    expect(root.style.getPropertyValue('--fui-Slider--progress')).toBe('50%');
    expect(root.style.getPropertyValue('--fui-Slider--direction')).toBe(direction);
    expect(root.style.getPropertyValue('--fui-Slider--steps-percent')).toBe('25%');
    fireEvent.change(getByRole('slider'), { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual({ value: 25 });
    expect(root.style.getPropertyValue('--fui-Slider--progress')).toBe('75%');
  });
});
