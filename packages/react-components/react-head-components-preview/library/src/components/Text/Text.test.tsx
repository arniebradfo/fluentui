import * as React from 'react';
import { render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Text, type TextSlots } from './Text.js';

describe('Text', () => {
  it('uses standard body typography rather than inheriting parent font choices', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { getByText } = render(
      <Text ref={ref} className="consumer" style={{ opacity: 0.5 }}>
        Body text
      </Text>,
    );
    const text = getByText('Body text');

    expect(ref.current).toBe(text);
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveAttribute('data-font', 'base');
    expect(text).toHaveAttribute('data-size', '300');
    expect(text).toHaveAttribute('data-weight', 'regular');
    expect(text).toHaveClass('consumer');
    expect(text).toHaveStyle({ opacity: '0.5' });
  });

  it('keeps native heading semantics, root renderers, and explicit typography choices', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    const renderHeading: SlotRenderFunction<Extract<ExtractSlotProps<TextSlots['root']>, { as: 'h2' }>> = (
      _Component,
      props,
    ) => <h2 {...props}>Heading</h2>;
    const { getByRole } = render(
      <Text as="h2" ref={ref} size={600} weight="semibold" font="monospace" underline strikethrough block wrap={false}>
        {renderHeading}
      </Text>,
    );
    const heading = getByRole('heading', { level: 2, name: 'Heading' });

    expect(ref.current).toBe(heading);
    expect(heading).toHaveAttribute('data-size', '600');
    expect(heading).toHaveAttribute('data-weight', 'semibold');
    expect(heading).toHaveAttribute('data-font', 'monospace');
    expect(heading).toHaveAttribute('data-underline');
    expect(heading).toHaveAttribute('data-strikethrough');
    expect(heading).toHaveAttribute('data-block');
    expect(heading).toHaveAttribute('data-nowrap');
  });
});
