import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Image } from './Image.js';

describe('Image', () => {
  it('preserves image semantics, refs, events, and fit sizing with and without explicit dimensions', () => {
    const ref = React.createRef<HTMLImageElement>();
    const onLoad = jest.fn();
    const { getByRole, rerender } = render(
      <Image ref={ref} alt="Sample" src="/sample.png" fit="contain" className="consumer" onLoad={onLoad} />,
    );
    const image = getByRole('img', { name: 'Sample' });

    expect(ref.current).toBe(image);
    expect(image).toHaveClass('consumer');
    expect(image).toHaveAttribute('data-shape', 'square');
    expect(image).toHaveAttribute('data-fit-fill');
    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledTimes(1);

    rerender(<Image ref={ref} alt="Sample" src="/sample.png" fit="contain" width={80} />);
    expect(ref.current).toBe(image);
    expect(image).toHaveAttribute('width', '80');
    expect(image).not.toHaveAttribute('data-fit-fill');

    rerender(<Image alt="Sample" src="/sample.png" fit="contain" width={0} />);
    expect(image).not.toHaveAttribute('data-fit-fill');
  });
});
