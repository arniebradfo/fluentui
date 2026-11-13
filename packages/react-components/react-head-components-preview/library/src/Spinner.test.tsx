import * as React from 'react';
import { render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Spinner } from './Spinner';
import { Skeleton } from './Skeleton';
import { SkeletonItem } from './SkeletonItem';
import { ProgressBar } from './ProgressBar';
import { CounterBadge } from './CounterBadge';

describe('styled status composition', () => {
  it('renders the generated Spinner label through the styled Label and preserves custom slots', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const labelRef = React.createRef<HTMLLabelElement>();
    const renderLabel: SlotRenderFunction<React.ComponentPropsWithRef<'label'>> = (Label, props) => (
      <Label {...props} data-testid="custom-label">
        Loading
      </Label>
    );
    const { getByRole, getByText, getByTestId, rerender } = render(
      <Spinner ref={rootRef} label="Loading" size="huge" labelPosition="below" />,
    );
    expect(rootRef.current).toBe(getByRole('progressbar', { name: 'Loading' }));
    expect(getByRole('progressbar')).toHaveClass('Spinner');
    expect(getByRole('progressbar')).toHaveAttribute('data-size', 'huge');
    expect(getByText('Loading')).toHaveClass('Label', 'Spinner__label');

    rerender(
      <Spinner
        label={{
          ref: labelRef,
          className: 'user-label',
          children: renderLabel,
        }}
        spinner={null}
      />,
    );
    expect(labelRef.current).toBe(getByTestId('custom-label'));
    expect(getByTestId('custom-label')).toHaveClass('Label', 'Spinner__label', 'user-label');
    expect(getByRole('progressbar')).not.toHaveAttribute('data-has-spinner');

    rerender(<Spinner aria-label="Loading" label={null} />);
    expect(getByRole('progressbar')).not.toHaveAttribute('data-has-label');
  });

  it('inherits Skeleton visual options while preserving native root refs and item overrides', () => {
    const skeletonRef = React.createRef<HTMLSpanElement>();
    const itemRef = React.createRef<HTMLSpanElement>();
    const { getByTestId } = render(
      <Skeleton ref={skeletonRef} as="span" animation="pulse" appearance="translucent" size={24} shape="circle">
        <SkeletonItem ref={itemRef} as="span" data-testid="inherited" />
        <SkeletonItem data-testid="override" size={16} shape="rectangle" animation="wave" />
      </Skeleton>,
    );
    expect(skeletonRef.current?.tagName).toBe('SPAN');
    expect(skeletonRef.current).toHaveClass('Skeleton');
    expect(itemRef.current).toBe(getByTestId('inherited'));
    expect(itemRef.current?.tagName).toBe('SPAN');
    expect(getByTestId('inherited')).toHaveClass('SkeletonItem');
    expect(getByTestId('inherited')).toHaveAttribute('data-animation', 'pulse');
    expect(getByTestId('inherited')).toHaveAttribute('data-appearance', 'translucent');
    expect(getByTestId('inherited')).toHaveAttribute('data-size', '24');
    expect(getByTestId('inherited')).toHaveAttribute('data-shape', 'circle');
    expect(getByTestId('override')).toHaveAttribute('data-animation', 'wave');
    expect(getByTestId('override')).toHaveAttribute('data-size', '16');
    expect(getByTestId('override')).toHaveAttribute('data-shape', 'rectangle');
  });

  it('keeps headless ProgressBar width precedence and explicit numeric-zero CounterBadge content', () => {
    const { getByRole, getByText } = render(
      <>
        <ProgressBar value={0.5} bar={{ style: { width: '75%' }, className: 'user-bar' }} />
        <CounterBadge count={0} showZero />
      </>,
    );
    const bar = getByRole('progressbar').querySelector('.ProgressBar__bar');
    expect(bar).toHaveClass('user-bar');
    expect(bar).toHaveStyle({ width: '75%' });
    expect(getByText('0')).toHaveClass('Badge', 'CounterBadge');
    expect(getByText('0')).not.toHaveAttribute('data-hidden');
  });
});
