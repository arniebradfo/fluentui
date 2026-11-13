import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ButtonContextProvider } from '@fluentui/react-headless-components-preview/button';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import {
  TeachingPopover,
  TeachingPopoverCarousel,
  TeachingPopoverCarouselCard,
  TeachingPopoverCarouselFooter,
  TeachingPopoverCarouselFooterButton,
  TeachingPopoverHeader,
  TeachingPopoverSurface,
  TeachingPopoverTitle,
  TeachingPopoverTrigger,
  type TeachingPopoverCarouselFooterButtonProps,
  type TeachingPopoverHeaderProps,
} from './TeachingPopover';
import { Tooltip } from './Tooltip';

type FooterNativeButtonProps = Extract<TeachingPopoverCarouselFooterButtonProps, { as?: 'button' }>;
type FooterAnchorProps = Extract<TeachingPopoverCarouselFooterButtonProps, { as: 'a' }>;

describe('styled native TeachingPopover', () => {
  it('preserves the public trigger marker through a nested Tooltip', () => {
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <TeachingPopover>
        <Tooltip relationship="label" content="Show teaching tip">
          <TeachingPopoverTrigger>
            <button ref={triggerRef} type="button">
              Show
            </button>
          </TeachingPopoverTrigger>
        </Tooltip>
        <TeachingPopoverSurface>Teaching content</TeachingPopoverSurface>
      </TeachingPopover>,
    );

    const trigger = screen.getByRole('button', { name: 'Show teaching tip' });
    expect(triggerRef.current).toBe(trigger);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group', { hidden: true })).toHaveTextContent('Teaching content');
  });

  it('provides named, non-submitting dismiss defaults and preserves slot render functions and refs', () => {
    const onSubmit = jest.fn((event: React.FormEvent) => event.preventDefault());
    const dismissRef = React.createRef<HTMLButtonElement>();
    const titleDismissRef = React.createRef<HTMLButtonElement>();
    const renderDismiss: SlotRenderFunction<ExtractSlotProps<TeachingPopoverHeaderProps['dismissButton']>> = (
      Component,
      props,
    ) => <Component {...props} data-testid="custom-dismiss" />;

    render(
      <TeachingPopover defaultOpen>
        <TeachingPopoverSurface as="div">
          <form onSubmit={onSubmit}>
            <TeachingPopoverHeader
              icon={null}
              dismissButton={{ ref: dismissRef, className: 'consumer-dismiss', children: renderDismiss }}
            >
              Header
            </TeachingPopoverHeader>
            <TeachingPopoverTitle dismissButton={{ ref: titleDismissRef }}>Title</TeachingPopoverTitle>
          </form>
        </TeachingPopoverSurface>
      </TeachingPopover>,
    );

    const dismissButtons = screen.getAllByRole('button', { name: 'dismiss' });
    expect(dismissButtons).toHaveLength(2);
    expect(dismissRef.current).toBe(screen.getByTestId('custom-dismiss'));
    expect(dismissRef.current?.className.endsWith('consumer-dismiss')).toBe(true);
    expect(titleDismissRef.current).toBe(dismissButtons[1]);
    expect(dismissButtons[0]).toHaveAttribute('type', 'button');
    expect(dismissButtons[1]).toHaveAttribute('type', 'button');

    fireEvent.click(dismissButtons[1]);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('preserves explicit dismiss type, disabled, null and accessibility choices', () => {
    render(
      <TeachingPopover defaultOpen>
        <TeachingPopoverSurface as="div">
          <TeachingPopoverHeader icon={null} dismissButton={{ type: 'submit', disabled: true }}>
            Header
          </TeachingPopoverHeader>
          <TeachingPopoverTitle dismissButton={{ 'aria-hidden': true }}>Hidden dismiss</TeachingPopoverTitle>
          <TeachingPopoverHeader dismissButton={null}>No dismiss</TeachingPopoverHeader>
        </TeachingPopoverSurface>
      </TeachingPopover>,
    );

    const dismiss = screen.getByRole('button', { name: 'dismiss' });
    expect(dismiss).toHaveAttribute('type', 'submit');
    expect(dismiss).toBeDisabled();
    expect(screen.getAllByRole('button', { hidden: true })).toHaveLength(2);
  });

  it('styles public footer slots while preserving navigation, trailing text, refs and form defaults', () => {
    const nextRef = React.createRef<HTMLButtonElement>();
    const onValueChange = jest.fn();
    const onFinish = jest.fn();
    const onSubmit = jest.fn((event: React.FormEvent) => event.preventDefault());
    // Public footer-slot props omit refs; attach one to the forwarded component in the render function.
    const renderNext: SlotRenderFunction<FooterNativeButtonProps> = (_Component, props) => (
      <TeachingPopoverCarouselFooterButton {...props} as="button" ref={nextRef} data-testid="custom-next">
        Advance
      </TeachingPopoverCarouselFooterButton>
    );

    render(
      <form onSubmit={onSubmit}>
        <TeachingPopoverCarousel defaultValue="one" onValueChange={onValueChange} onFinish={onFinish}>
          <TeachingPopoverCarouselCard value="one">First page</TeachingPopoverCarouselCard>
          <TeachingPopoverCarouselCard value="two">Second page</TeachingPopoverCarouselCard>
          <TeachingPopoverCarouselFooter
            previous={null}
            next={{
              as: 'button',
              navType: 'next',
              altText: 'Finish',
              className: 'consumer-next',
              style: { maxWidth: 'none' },
              children: renderNext,
            }}
          />
        </TeachingPopoverCarousel>
      </form>,
    );

    const next = screen.getByRole('button', { name: 'Advance' });
    expect(nextRef.current).toBe(next);
    expect(next).toBe(screen.getByTestId('custom-next'));
    expect(next).toHaveClass('consumer-next');
    expect(next).toHaveStyle({ maxWidth: 'none' });
    expect(next).toHaveAttribute('type', 'button');
    expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull();

    fireEvent.click(next);
    expect(onValueChange).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ value: 'two' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('retains Button disabledFocusable and anchor semantics in the footer adapter', () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const anchorRef = React.createRef<HTMLAnchorElement>();
    const onClick = jest.fn();
    const onValueChange = jest.fn();

    render(
      <ButtonContextProvider value={{ size: 'small' }}>
        <TeachingPopoverCarousel defaultValue="one" onValueChange={onValueChange}>
          <TeachingPopoverCarouselCard value="one">First page</TeachingPopoverCarouselCard>
          <TeachingPopoverCarouselCard value="two">Second page</TeachingPopoverCarouselCard>
          <TeachingPopoverCarouselFooterButton
            navType="next"
            altText="Finish"
            ref={buttonRef}
            disabledFocusable
            onClick={onClick}
          >
            Focusable
          </TeachingPopoverCarouselFooterButton>
          <TeachingPopoverCarouselFooterButton
            navType="next"
            altText="Finish"
            as="a"
            href="#next"
            ref={anchorRef}
            disabled
            onClick={onClick}
          >
            Disabled link
          </TeachingPopoverCarouselFooterButton>
        </TeachingPopoverCarousel>
      </ButtonContextProvider>,
    );

    const button = screen.getByRole('button', { name: 'Focusable' });
    const anchor = screen.getByRole('link', { name: 'Disabled link' });
    expect(buttonRef.current).toBe(button);
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(anchorRef.current).toBe(anchor);
    expect(anchor.tagName).toBe('A');
    expect(anchor).not.toHaveAttribute('href');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(button);
    fireEvent.click(anchor);
    expect(onClick).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('preserves anchor footer-slot render functions, refs and explicit native button types', () => {
    const previousRef = React.createRef<HTMLAnchorElement>();
    const renderPrevious: SlotRenderFunction<FooterAnchorProps> = (_Component, props) => (
      <TeachingPopoverCarouselFooterButton {...props} as="a" ref={previousRef} data-testid="custom-previous" />
    );

    render(
      <TeachingPopoverCarousel defaultValue="one">
        <TeachingPopoverCarouselCard value="one">First page</TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselCard value="two">Second page</TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselFooter
          previous={{
            as: 'a',
            navType: 'prev',
            altText: 'Go back',
            href: '#previous',
            className: 'consumer-previous',
            children: renderPrevious,
          }}
          next={{ navType: 'next', altText: 'Finish', type: 'submit', children: 'Continue' }}
        />
      </TeachingPopoverCarousel>,
    );

    const previous = screen.getByRole('link', { name: 'Go back' });
    expect(previousRef.current).toBe(previous);
    expect(previous).toBe(screen.getByTestId('custom-previous'));
    expect(previous).toHaveClass('fui-Button', 'consumer-previous');
    expect(previous).toHaveAttribute('href', '#previous');
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute('type', 'submit');
  });
});
