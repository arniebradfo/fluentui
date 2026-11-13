import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Rating } from './Rating';
import { RatingDisplay } from './RatingDisplay';
import { RatingItem } from './RatingItem';

describe('styled rating family', () => {
  it('generates styled interactive items and preserves native half-value callbacks', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onChange = jest.fn();
    const { container, getByRole } = render(
      <Rating ref={ref} aria-label="Rating" defaultValue={1.5} step={0.5} max={3} onChange={onChange} />,
    );
    expect(ref.current).toBe(getByRole('radiogroup'));
    const items = container.querySelectorAll('.fui-RatingItem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass('RatingItem');
    expect(items[0]).toHaveAttribute('data-size', 'extra-large');
    expect(items[1]).toHaveAttribute('data-appearance', 'filled-half');
    expect(items[1]).toHaveAttribute('data-icon-appearance', 'outline');
    expect(items[1].querySelector('svg')).not.toBeNull();
    fireEvent.click(getByRole('radio', { name: '2.5' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toMatchObject({ value: 2.5, type: 'change' });
  });

  it('provides styled default items to a root render function', () => {
    const renderRoot: SlotRenderFunction<React.ComponentProps<'div'>> = (Component, props) => (
      <Component {...props} data-testid="rating" />
    );
    const { getByTestId, getAllByRole } = render(
      <Rating size="small" color="brand" max={2}>
        {renderRoot}
      </Rating>,
    );
    expect(getByTestId('rating').querySelectorAll('.RatingItem')).toHaveLength(2);
    expect(getAllByRole('radio')[0].closest('.RatingItem')).toHaveAttribute('data-size', 'small');
    expect(getAllByRole('radio')[0].closest('.RatingItem')).toHaveAttribute('data-color', 'brand');
  });

  it('preserves explicit children, empty content and custom icon slots', () => {
    const { container, rerender } = render(
      <Rating value={1}>
        <RatingItem value={1} selectedIcon={{ children: <span data-testid="custom">Custom</span> }} />
      </Rating>,
    );
    expect(container.querySelectorAll('.RatingItem')).toHaveLength(1);
    expect(container.querySelector('[data-testid="custom"]')).toHaveTextContent('Custom');
    rerender(<Rating value={1}>{null}</Rating>);
    expect(container.querySelector('.RatingItem')).toBeNull();
    rerender(<RatingDisplay value={2}>{null}</RatingDisplay>);
    expect(container.querySelector('.RatingItem')).toBeNull();
    expect(container.querySelector('.RatingDisplay__valueText')).toHaveTextContent('2');
  });

  it('replaces generated read-only items even through a root render function', () => {
    const renderRoot: SlotRenderFunction<React.ComponentProps<'div'>> = (Component, props) => (
      <Component {...props} data-testid="display" />
    );
    const FontIcon = () => <i className="fui-Icon-font" aria-hidden="true" />;
    const { container, getByRole } = render(
      <RatingDisplay value={1.5} count={20} max={3} icon={FontIcon} size="large" color="marigold">
        {renderRoot}
      </RatingDisplay>,
    );
    const items = container.querySelectorAll('.RatingItem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('data-appearance', 'filled-half');
    expect(items[1]).toHaveAttribute('data-icon-appearance', 'filled');
    expect(items[1]).toHaveAttribute('data-color', 'marigold');
    expect(items[1]).toHaveAttribute('data-size', 'large');
    expect(items[1].querySelectorAll('.fui-Icon-font')).toHaveLength(2);
    expect(getByRole('img', { name: '1.5 20' })).toBeInTheDocument();
    expect(container.querySelector('input')).toBeNull();
  });

  it('retains compact read-only generation and optional text slot nulls', () => {
    const { container } = render(<RatingDisplay compact value={3.5} count={20} valueText={null} countText={null} />);
    expect(container.querySelectorAll('.RatingItem')).toHaveLength(1);
    expect(container.querySelector('.RatingItem')).toHaveAttribute('data-size', 'medium');
    expect(container.querySelector('.RatingDisplay__valueText')).toBeNull();
    expect(container.querySelector('.RatingDisplay__countText')).toBeNull();
  });
});
