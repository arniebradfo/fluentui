import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { LinkContextProvider, type LinkSlots } from '@fluentui/react-headless-components-preview/link';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Link } from './Link.js';

describe('Link', () => {
  it('preserves native navigation, inline context, refs, and caller root rendering without adding a glyph', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const renderRoot: SlotRenderFunction<Extract<ExtractSlotProps<LinkSlots['root']>, { as?: 'a' }>> = (
      _Component,
      props,
    ) => <a {...props}>Destination</a>;
    const { getByRole } = render(
      <LinkContextProvider value={{ inline: true }}>
        <Link as="a" href="/destination" target="_self" rel="author" ref={ref} className="consumer">
          {renderRoot}
        </Link>
      </LinkContextProvider>,
    );
    const link = getByRole('link', { name: 'Destination' });

    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('href', '/destination');
    expect(link).toHaveAttribute('target', '_self');
    expect(link).toHaveAttribute('rel', 'author');
    expect(link).toHaveAttribute('data-inline');
    expect(link).toHaveClass('consumer');
    expect(link.querySelector('svg')).toBeNull();
  });

  it('retains disabled-focusable semantics without enabling activation', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Link href="/destination" disabled disabledFocusable onClick={onClick}>
        Disabled link
      </Link>,
    );
    const link = getByText('Disabled link');

    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '0');
    expect(link).toHaveAttribute('data-disabled');
    expect(link).toHaveAttribute('data-disabled-focusable');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
