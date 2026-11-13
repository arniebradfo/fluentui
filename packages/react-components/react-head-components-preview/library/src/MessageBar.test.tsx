import * as React from 'react';
import { render } from '@testing-library/react';
import { useButtonContext } from '@fluentui/react-headless-components-preview/button';
import { useLinkContext } from '@fluentui/react-headless-components-preview/link';
import { InfoFilled } from '@fluentui/react-icons/headless/svg/info';
import { WarningFilled } from '@fluentui/react-icons/headless/svg/warning';
import { DiamondDismissFilled } from '@fluentui/react-icons/headless/svg/diamond-dismiss';
import { CheckmarkCircleFilled } from '@fluentui/react-icons/headless/svg/checkmark-circle';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { MessageBar, type MessageBarSlots } from './MessageBar';
import { MessageBarBody } from './MessageBarBody';
import { MessageBarTitle } from './MessageBarTitle';
import { MessageBarActions } from './MessageBarActions';

describe('styled headless MessageBar', () => {
  it.each([
    ['info', InfoFilled],
    ['warning', WarningFilled],
    ['error', DiamondDismissFilled],
    ['success', CheckmarkCircleFilled],
  ] as const)('restores the stock %s intent glyph', (intent, ExpectedGlyph) => {
    const { getByRole, getByTestId } = render(
      <>
        <MessageBar intent={intent}>
          <MessageBarBody>
            <MessageBarTitle>Notice</MessageBarTitle>Content
          </MessageBarBody>
        </MessageBar>
        <ExpectedGlyph data-testid="expected-icon" />
      </>,
    );
    const root = getByRole('group');
    expect(root).toHaveAttribute('data-intent', intent);
    expect(root).toHaveAttribute('data-shape', 'rounded');
    expect(root.querySelector('.fui-MessageBar__icon')).toHaveAttribute('data-intent', intent);
    expect(root.querySelector('.fui-MessageBar__icon path')?.getAttribute('d')).toBe(
      getByTestId('expected-icon').querySelector('path')?.getAttribute('d'),
    );
  });

  it('defaults to info and keeps measured refs, title semantics, and owned child contexts', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const bodyRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLSpanElement>();
    const actionsRef = React.createRef<HTMLDivElement>();
    const LinkProbe = () => {
      const { inline } = useLinkContext();
      return (
        <a href="#details" data-inline={String(inline)}>
          Details
        </a>
      );
    };
    const ButtonProbe = () => {
      const { size } = useButtonContext();
      return <button data-size={size}>Review</button>;
    };
    const { getByRole, getByText } = render(
      <MessageBar ref={rootRef} className="caller-message">
        <MessageBarBody ref={bodyRef}>
          <MessageBarTitle ref={titleRef}>Saved</MessageBarTitle>
          <LinkProbe />
        </MessageBarBody>
        <MessageBarActions ref={actionsRef} containerAction={<button>Dismiss</button>}>
          <ButtonProbe />
        </MessageBarActions>
      </MessageBar>,
    );
    const root = getByRole('group');
    expect(rootRef.current).toBe(root);
    expect(root).toHaveAttribute('data-intent', 'info');
    expect(root).toHaveAttribute('aria-labelledby', titleRef.current?.id);
    expect(root).toHaveClass('caller-message');
    expect(bodyRef.current).toContainElement(getByRole('link'));
    expect(getByRole('link')).toHaveAttribute('data-inline', 'true');
    expect(actionsRef.current).toContainElement(getByText('Review'));
    expect(getByRole('button', { name: 'Review' })).toHaveAttribute('data-size', 'small');
    expect(getByRole('button', { name: 'Dismiss' }).parentElement?.parentElement).toBe(root);
  });

  it('preserves null slots and caller slot render functions in multiline layout', () => {
    const iconRef = React.createRef<HTMLDivElement>();
    const renderIcon: SlotRenderFunction<ExtractSlotProps<MessageBarSlots['icon']>> = (Component, props) => (
      <Component {...props} data-testid="custom-icon">
        Custom
      </Component>
    );
    const { getByRole, getByTestId, rerender } = render(
      <MessageBar
        layout="multiline"
        shape="square"
        icon={{
          ref: iconRef,
          className: 'caller-icon',
          style: { opacity: 0.7 },
          children: renderIcon,
        }}
        bottomReflowSpacer={null}
      >
        <MessageBarBody>
          <MessageBarTitle>Notice</MessageBarTitle>Content
        </MessageBarBody>
      </MessageBar>,
    );
    const root = getByRole('group');
    expect(root).toHaveAttribute('data-layout', 'multiline');
    expect(root).toHaveAttribute('data-shape', 'square');
    expect(iconRef.current).toBe(getByTestId('custom-icon'));
    expect(iconRef.current).toHaveClass('fui-MessageBar__icon', 'caller-icon');
    expect(iconRef.current).toHaveStyle({ opacity: '0.7' });
    expect(root.querySelector('.fui-MessageBar__bottomReflowSpacer')).toBeNull();

    rerender(<MessageBar icon={null}>No icon</MessageBar>);
    expect(getByRole('group').querySelector('.fui-MessageBar__icon')).toBeNull();
  });
});
