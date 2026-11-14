import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { RangeSlider } from './RangeSlider';

describe('styled RangeSlider', () => {
  it('retains sorted progress, individual disabled state and active overlap handling', () => {
    const ref = React.createRef<HTMLDivElement>();
    const startRef = React.createRef<HTMLInputElement>();
    const endRef = React.createRef<HTMLInputElement>();
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <RangeSlider
        ref={ref}
        defaultValue={{ start: 80, end: 20 }}
        startInput={{ ref: startRef, disabled: true, 'aria-label': 'Minimum' }}
        endInput={{ ref: endRef, 'aria-label': 'Maximum' }}
        onChange={onChange}
      />,
    );
    const root = container.querySelector<HTMLElement>('.RangeSlider')!;
    expect(ref.current).toBe(root);
    expect(startRef.current).toBe(getByRole('slider', { name: 'Minimum' }));
    expect(endRef.current).toBe(getByRole('slider', { name: 'Maximum' }));
    expect(root).not.toHaveAttribute('data-disabled');
    expect(root.style.getPropertyValue('--fui-RangeSlider--start-progress')).toBe('20%');
    expect(root.style.getPropertyValue('--fui-RangeSlider--end-progress')).toBe('80%');
    expect(container.querySelector('.RangeSlider__startThumb')).toHaveAttribute('data-disabled', '');
    expect(container.querySelector('.RangeSlider__endThumb')).not.toHaveAttribute('data-disabled');
    fireEvent.change(getByRole('slider', { name: 'Maximum' }), { target: { value: '20' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toMatchObject({ value: { start: 20, end: 20 } });
    expect(root).toHaveAttribute('data-thumbs-overlap', '');
    expect(container.querySelector('.RangeSlider__endThumb')).toHaveAttribute('data-active', '');
  });

  it('moves the overlap visual priority with the active native input', () => {
    const { container, getByRole } = render(
      <RangeSlider
        defaultValue={{ start: 50, end: 50 }}
        startInput={{ 'aria-label': 'Minimum' }}
        endInput={{ 'aria-label': 'Maximum' }}
      />,
    );
    expect(container.querySelector('.RangeSlider__startThumb')).toHaveAttribute('data-active', '');
    fireEvent.focus(getByRole('slider', { name: 'Maximum' }));
    expect(container.querySelector('.RangeSlider__startThumb')).not.toHaveAttribute('data-active');
    expect(container.querySelector('.RangeSlider__endThumb')).toHaveAttribute('data-active', '');
  });
});
