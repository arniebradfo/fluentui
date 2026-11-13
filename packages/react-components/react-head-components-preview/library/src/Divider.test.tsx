import * as React from 'react';
import { render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Divider, type DividerSlots } from './Divider.js';

describe('Divider', () => {
  it('renders the standard labeled separator and preserves its wrapper renderer and refs', () => {
    const ref = React.createRef<HTMLDivElement>();
    const wrapperRef = React.createRef<HTMLDivElement>();
    const renderWrapper: SlotRenderFunction<ExtractSlotProps<DividerSlots['wrapper']>> = (Component, props) => (
      <Component {...props} data-custom-wrapper="" />
    );
    const { getByRole, getByText } = render(
      <Divider
        ref={ref}
        className="consumer"
        alignContent="start"
        wrapper={{
          ref: wrapperRef,
          children: renderWrapper,
        }}
      >
        Section
      </Divider>,
    );
    const divider = getByRole('separator', { name: 'Section' });
    const wrapper = getByText('Section');

    expect(ref.current).toBe(divider);
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveAttribute('aria-labelledby', wrapper.id);
    expect(divider).toHaveAttribute('data-align-content', 'start');
    expect(divider).toHaveClass('consumer');
    expect(wrapperRef.current).toBe(wrapper);
    expect(wrapper).toHaveClass('fui-Divider__wrapper');
    expect(wrapper).toHaveAttribute('data-custom-wrapper');
  });

  it('keeps native orientation and childless styling state', () => {
    const { getByRole } = render(<Divider vertical inset appearance="strong" />);
    const divider = getByRole('separator');

    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider).toHaveAttribute('data-orientation', 'vertical');
    expect(divider).toHaveAttribute('data-inset');
    expect(divider).not.toHaveAttribute('data-has-content');
  });
});
