import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarGroupItem } from './AvatarGroupItem';
import { AvatarGroupPopover } from './AvatarGroupPopover';
import { Persona } from './Persona';
import { PresenceBadge } from './PresenceBadge';

describe('styled Avatar', () => {
  it('uses one automatic initial at size 16 without changing the accessible name', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { getByRole, rerender } = render(<Avatar ref={ref} size={16} name="John Doe" />);
    const avatar = getByRole('img', { name: 'John Doe' });

    expect(avatar).toHaveTextContent('J');
    expect(avatar.querySelector('.fui-Avatar__initials')).toHaveTextContent(/^J$/);
    expect(avatar).toHaveClass('Avatar');
    expect(ref.current).toBe(avatar);

    rerender(<Avatar ref={ref} name="John Doe" />);
    expect(avatar.querySelector('.fui-Avatar__initials')).toHaveTextContent(/^JD$/);
  });

  it.each([
    ['(Team) John Doe', 'J'],
    ['𠀀 Doe', '𠀀'],
    ['ß Doe', 'SS'],
  ])('keeps the primitive name cleanup and Unicode behavior for %s', (name, initial) => {
    const { getByRole } = render(<Avatar size={16} name={name} />);

    expect(getByRole('img', { name }).querySelector('.fui-Avatar__initials')).toHaveTextContent(initial);
  });

  it('uses the first name initial in RTL and leaves larger automatic initials unchanged', () => {
    const { getByTestId } = render(
      <Provider dir="rtl">
        <Avatar size={16} name="John Doe" data-testid="small" />
        <Avatar name="John Doe" data-testid="default" />
      </Provider>,
    );

    expect(getByTestId('small').querySelector('.fui-Avatar__initials')).toHaveTextContent(/^J$/);
    expect(getByTestId('default').querySelector('.fui-Avatar__initials')).toHaveTextContent(/^DJ$/);
  });

  it('keeps explicit initials, slot renderers, slot refs and native styles', () => {
    const initialsRef = React.createRef<HTMLSpanElement>();
    const renderInitials: SlotRenderFunction<React.ComponentPropsWithRef<'span'>> = (Initials, props) => (
      <Initials {...props} data-testid="custom-initials">
        Explicit
      </Initials>
    );
    const { getByRole, getByTestId, rerender } = render(<Avatar size={16} name="John Doe" initials="XY" />);
    expect(getByRole('img')).toHaveTextContent('XY');

    rerender(
      <Avatar
        size={16}
        name="John Doe"
        className="user-avatar"
        style={{ opacity: 0.8 }}
        initials={{
          ref: initialsRef,
          className: 'user-initials',
          children: renderInitials,
        }}
      />,
    );
    expect(getByTestId('custom-initials')).toHaveClass('Avatar__initials', 'user-initials');
    expect(initialsRef.current).toBe(getByTestId('custom-initials'));
    expect(getByRole('img')).toHaveClass('user-avatar');
    expect(getByRole('img')).toHaveStyle({ opacity: '0.8' });

    rerender(<Avatar size={16} name="John Doe" initials={null} icon={null} />);
    expect(getByRole('img')).toBeEmptyDOMElement();
  });

  it('retains native image load/error behavior and supplies a styled fallback glyph', () => {
    const onError = jest.fn();
    const onLoad = jest.fn();
    const { getByRole, getByAltText } = render(
      <Avatar aria-label="Profile" image={{ src: 'avatar.png', alt: 'Profile photo', onError, onLoad }} />,
    );
    const avatar = getByRole('img', { name: 'Profile' });
    expect(avatar).not.toHaveAttribute('data-has-icon');

    fireEvent.error(getByAltText('Profile photo'));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(getByAltText('Profile photo')).toHaveAttribute('hidden');
    expect(avatar.querySelector('.Avatar__icon svg')).toHaveClass('Avatar__glyph');

    fireEvent.load(getByAltText('Profile photo'));
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(getByAltText('Profile photo')).not.toHaveAttribute('hidden');
    expect(avatar).not.toHaveAttribute('data-has-icon');
  });

  it('styles generated Persona Avatar and PresenceBadge slots and preserves explicit nulls', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByRole, rerender, container } = render(
      <Persona ref={ref} name="Ada Lovelace" avatar={{ className: 'user-avatar' }} presence={{ status: 'away' }} />,
    );

    expect(ref.current).toHaveClass('Persona');
    expect(getByRole('img', { name: 'Ada Lovelace away' })).toHaveClass('Avatar', 'Persona__avatar', 'user-avatar');
    expect(getByRole('img', { name: 'away' })).toHaveClass('PresenceBadge', 'Avatar__badge');

    rerender(<Persona presenceOnly size="huge" name="Ada Lovelace" presence={{ status: 'busy' }} />);
    expect(container.querySelector('.Avatar')).toBeNull();
    expect(getByRole('img', { name: 'busy' })).toHaveClass('PresenceBadge', 'Persona__presence');
    expect(getByRole('img', { name: 'busy' })).toHaveAttribute('data-size', 'large');

    rerender(<Persona name="Ada Lovelace" avatar={null} presence={null} />);
    expect(container.querySelector('.Avatar')).toBeNull();
    expect(container.querySelector('.PresenceBadge')).toBeNull();
  });

  it('inherits group size into the styled Avatar and forwards the primary-slot ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { getByRole } = render(
      <AvatarGroup size={16} layout="stack">
        <AvatarGroupItem ref={ref} name="John Doe" color="neutral" />
      </AvatarGroup>,
    );
    const avatar = getByRole('img', { name: 'John Doe' });

    expect(ref.current).toBe(avatar);
    expect(avatar).toHaveClass('Avatar', 'AvatarGroupItem__avatar');
    expect(avatar).toHaveAttribute('data-size', '16');
    expect(avatar.querySelector('.Avatar__initials')).toHaveTextContent(/^J$/);
    expect(avatar).toHaveAttribute('data-color', 'neutral');
  });

  it('styles the overflow glyph, native surface and generated overflow Avatar', () => {
    const { getByRole, container } = render(
      <AvatarGroup size={20}>
        <AvatarGroupPopover defaultOpen>
          <AvatarGroupItem name="John Doe" />
        </AvatarGroupPopover>
      </AvatarGroup>,
    );

    expect(getByRole('button').querySelector('svg')).toHaveClass('AvatarGroupPopover__glyph');
    const surface = container.querySelector('dialog');
    expect(surface).toHaveClass('PopoverSurface', 'AvatarGroupPopover__popoverSurface');
    expect(surface).toHaveAttribute('data-open');
    expect(surface?.querySelector('[role="img"]')).toHaveClass('Avatar', 'AvatarGroupItem__avatar');
    expect(surface?.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'John Doe');
  });

  it('does not replace explicit empty PresenceBadge icons or their render functions', () => {
    const renderIcon: SlotRenderFunction<React.ComponentPropsWithRef<'span'>> = (Icon, props) => (
      <Icon {...props} data-testid="custom-presence" />
    );
    const { container, rerender, getByTestId } = render(<PresenceBadge status="available" icon={{ children: null }} />);
    expect(container.querySelector('svg')).toBeNull();

    rerender(
      <PresenceBadge
        icon={{
          className: 'user-icon',
          children: renderIcon,
        }}
      />,
    );
    expect(getByTestId('custom-presence')).toHaveClass('PresenceBadge__icon', 'user-icon');
    expect(container.querySelector('svg')).toBeNull();
  });
});
