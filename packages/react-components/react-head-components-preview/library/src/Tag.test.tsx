import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useAvatarContext } from '@fluentui/react-headless-components-preview/avatar';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { InteractionTag } from './InteractionTag';
import { InteractionTagPrimary } from './InteractionTagPrimary';
import { InteractionTagSecondary } from './InteractionTagSecondary';
import { Tag, type TagSlots } from './Tag';
import { TagGroup } from './TagGroup';

const AvatarContext = ({ name }: { name: string }): React.ReactElement => {
  const { size, shape } = useAvatarContext();
  return <span data-testid={name} data-size={size} data-shape={shape} />;
};

describe('Tag visual contexts', () => {
  it('keeps standalone tags and split tags usable without a visual group provider', () => {
    const { getByText, getByRole, getByTestId } = render(
      <>
        <Tag media={<AvatarContext name="standalone-avatar" />}>One</Tag>
        <InteractionTag>
          <InteractionTagPrimary hasSecondaryAction media={<AvatarContext name="standalone-split-avatar" />}>
            Open
          </InteractionTagPrimary>
          <InteractionTagSecondary aria-label="Remove" />
        </InteractionTag>
      </>,
    );
    expect(getByText('One').closest('.fui-Tag')).toHaveAttribute('data-appearance', 'filled');
    expect(getByRole('button', { name: 'Open' })).toHaveAttribute('data-size', 'medium');
    expect(getByRole('button', { name: 'Open Remove' })).toHaveAttribute('data-shape', 'rounded');
    expect(getByTestId('standalone-avatar')).toHaveAttribute('data-size', '28');
    expect(getByTestId('standalone-split-avatar')).toHaveAttribute('data-shape', 'square');
  });

  it('inherits standard group visuals and passes the matching Avatar context through media slots', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { getByText, getByTestId, getByRole } = render(
      <TagGroup size="small" appearance="outline">
        <Tag ref={ref} className="consumer-tag" style={{ opacity: 0.8 }} media={<AvatarContext name="avatar" />}>
          One
        </Tag>
        <Tag size="extra-small" shape="circular" appearance="brand" media={<AvatarContext name="override-avatar" />}>
          Two
        </Tag>
      </TagGroup>,
    );
    const tag = getByText('One').closest('.fui-Tag');
    expect(ref.current).toBe(tag);
    expect(tag).toHaveAttribute('data-appearance', 'outline');
    expect(tag).toHaveAttribute('data-size', 'small');
    expect(tag).toHaveClass('consumer-tag');
    expect(tag).toHaveStyle({ opacity: 0.8 });
    expect(getByTestId('avatar')).toHaveAttribute('data-size', '20');
    expect(getByTestId('avatar')).toHaveAttribute('data-shape', 'square');
    expect(getByTestId('override-avatar')).toHaveAttribute('data-size', '16');
    expect(getByTestId('override-avatar')).toHaveAttribute('data-shape', 'circular');
    expect(getByRole('toolbar')).toHaveAttribute('focusgroup', 'toolbar inline wrap');
  });

  it('keeps null dismiss slots and custom primary render functions without changing dismissal behavior', () => {
    const onDismiss = jest.fn();
    const primaryRef = React.createRef<HTMLSpanElement>();
    const renderText: SlotRenderFunction<ExtractSlotProps<TagSlots['primaryText']>> = (Text, props) => (
      <Text {...props} data-consumer="text" />
    );
    const { getByRole } = render(
      <TagGroup dismissible onDismiss={onDismiss}>
        <Tag
          value="one"
          dismissIcon={null}
          primaryText={{
            ref: primaryRef,
            className: 'consumer-text',
            children: renderText,
          }}
        >
          One
        </Tag>
      </TagGroup>,
    );
    const tag = getByRole('button', { name: 'One' });
    expect(primaryRef.current).toHaveAttribute('data-consumer', 'text');
    expect(primaryRef.current).toHaveClass('consumer-text');
    expect(tag.querySelector('.fui-Tag__dismissIcon')).toBeNull();
    fireEvent.click(tag);
    expect(onDismiss).toHaveBeenCalledWith(expect.anything(), { value: 'one' });
  });

  it('shares split-tag visuals and Avatar defaults without replacing the secondary button contract', () => {
    const secondaryRef = React.createRef<HTMLButtonElement>();
    const onDismiss = jest.fn();
    const { getByRole, getByTestId } = render(
      <TagGroup size="extra-small" appearance="brand" onDismiss={onDismiss}>
        <InteractionTag value="split" shape="circular">
          <InteractionTagPrimary hasSecondaryAction media={<AvatarContext name="split-avatar" />}>
            Open
          </InteractionTagPrimary>
          <InteractionTagSecondary ref={secondaryRef} className="consumer-secondary" aria-label="Remove">
            Custom dismiss
          </InteractionTagSecondary>
        </InteractionTag>
      </TagGroup>,
    );
    const primary = getByRole('button', { name: 'Open' });
    const secondary = getByRole('button', { name: 'Open Remove' });
    expect(primary).toHaveAttribute('data-size', 'extra-small');
    expect(primary).toHaveAttribute('data-appearance', 'brand');
    expect(primary).toHaveAttribute('data-has-secondary-action', '');
    expect(getByTestId('split-avatar')).toHaveAttribute('data-size', '16');
    expect(getByTestId('split-avatar')).toHaveAttribute('data-shape', 'circular');
    expect(secondaryRef.current).toBe(secondary);
    expect(secondary).toHaveClass('consumer-secondary');
    expect(secondary).toHaveTextContent('Custom dismiss');
    expect(secondary.querySelector('svg')).toBeNull();
    fireEvent.click(secondary);
    expect(onDismiss).toHaveBeenCalledWith(expect.anything(), { value: 'split' });
  });
});
