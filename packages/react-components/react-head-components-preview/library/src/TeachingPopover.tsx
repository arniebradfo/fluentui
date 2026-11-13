'use client';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import {
  renderTeachingPopover,
  renderTeachingPopoverBody,
  renderTeachingPopoverCarousel,
  renderTeachingPopoverCarouselCard,
  renderTeachingPopoverCarouselFooter,
  renderTeachingPopoverCarouselFooterButton,
  renderTeachingPopoverCarouselNav,
  renderTeachingPopoverCarouselNavButton,
  renderTeachingPopoverCarouselPageCount,
  renderTeachingPopoverFooter,
  renderTeachingPopoverHeader,
  renderTeachingPopoverSurface,
  renderTeachingPopoverTitle,
  useTeachingPopover,
  useTeachingPopoverBody,
  useTeachingPopoverCarousel,
  useTeachingPopoverCarouselCard,
  useTeachingPopoverCarouselContextValues,
  useTeachingPopoverCarouselFooter,
  useTeachingPopoverCarouselFooterButton,
  useTeachingPopoverCarouselNav,
  useTeachingPopoverCarouselNavButton,
  useTeachingPopoverCarouselPageCount,
  useTeachingPopoverContextValues,
  useTeachingPopoverFooter,
  useTeachingPopoverHeader,
  useTeachingPopoverSurface,
  useTeachingPopoverTitle,
  type TeachingPopoverBodyProps,
  type TeachingPopoverCarouselCardProps,
  type TeachingPopoverCarouselFooterButtonProps,
  type TeachingPopoverCarouselFooterProps as HeadlessCarouselFooterProps,
  type TeachingPopoverCarouselNavButtonProps,
  type TeachingPopoverCarouselNavProps,
  type TeachingPopoverCarouselPageCountProps,
  type TeachingPopoverCarouselProps,
  type TeachingPopoverFooterProps,
  type TeachingPopoverHeaderProps,
  type TeachingPopoverProps as HeadlessTeachingPopoverProps,
  type TeachingPopoverSurfaceProps,
  type TeachingPopoverTitleProps,
} from '@fluentui/react-headless-components-preview/teaching-popover';
import { Dismiss12Regular, DismissRegular } from '@fluentui/react-icons/headless/svg/dismiss';
import { Lightbulb16Regular } from '@fluentui/react-icons/headless/svg/lightbulb';
import {
  slot,
  type ExtractSlotProps,
  type ForwardRefComponent,
  type InferredElementRefType,
} from '@fluentui/react-utilities';
import { Button } from './Button.js';
import { popoverSurfaceClassNames } from './PopoverSurface.js';
import { PopoverVisualContext, usePopoverVisualContext, type PopoverVisualOptions } from './PopoverVisualContext.js';
import styles from './TeachingPopover.module.css';

export {
  TeachingPopoverTrigger,
  useTeachingPopoverCarouselContextValues,
  useTeachingPopoverContextValues,
} from '@fluentui/react-headless-components-preview/teaching-popover';
export type {
  NavButtonRenderFunction,
  TeachingPopoverBaseBridgedContextValue,
  TeachingPopoverBodyProps,
  TeachingPopoverBodySlots,
  TeachingPopoverBodyState,
  TeachingPopoverCarouselCardProps,
  TeachingPopoverCarouselCardSlots,
  TeachingPopoverCarouselCardState,
  TeachingPopoverCarouselContextValues,
  TeachingPopoverCarouselFooterButtonProps,
  TeachingPopoverCarouselFooterButtonSlots,
  TeachingPopoverCarouselFooterButtonState,
  TeachingPopoverCarouselFooterSlots,
  TeachingPopoverCarouselFooterState,
  TeachingPopoverCarouselNavButtonProps,
  TeachingPopoverCarouselNavButtonSlots,
  TeachingPopoverCarouselNavButtonState,
  TeachingPopoverCarouselNavProps,
  TeachingPopoverCarouselNavSlots,
  TeachingPopoverCarouselNavState,
  TeachingPopoverCarouselPageCountProps,
  TeachingPopoverCarouselPageCountRenderFunction,
  TeachingPopoverCarouselPageCountSlots,
  TeachingPopoverCarouselPageCountState,
  TeachingPopoverCarouselProps,
  TeachingPopoverCarouselSlots,
  TeachingPopoverCarouselState,
  TeachingPopoverContextValues,
  TeachingPopoverFooterProps,
  TeachingPopoverFooterSlots,
  TeachingPopoverFooterState,
  TeachingPopoverHeaderProps,
  TeachingPopoverHeaderSlots,
  TeachingPopoverHeaderState,
  TeachingPopoverState,
  TeachingPopoverSurfaceProps,
  TeachingPopoverSurfaceSlots,
  TeachingPopoverSurfaceState,
  TeachingPopoverTitleProps,
  TeachingPopoverTitleSlots,
  TeachingPopoverTitleState,
  TeachingPopoverTriggerChildProps,
  TeachingPopoverTriggerProps,
  TeachingPopoverTriggerState,
} from '@fluentui/react-headless-components-preview/teaching-popover';

export type TeachingPopoverProps = HeadlessTeachingPopoverProps & PopoverVisualOptions;

export type TeachingPopoverCarouselFooterProps = HeadlessCarouselFooterProps & {
  /**
   * Visual alignment; the public previous/children/next DOM and Tab order are unchanged.
   * @default 'centered'
   */
  layout?: 'centered' | 'offset';
};

export const teachingPopoverSurfaceClassNames = { root: 'fui-TeachingPopoverSurface' } as const;
export const teachingPopoverHeaderClassNames = {
  root: 'fui-TeachingPopoverHeader',
  icon: 'fui-TeachingPopoverHeader__icon',
  dismissButton: 'fui-TeachingPopoverHeader__dismissButton',
} as const;
export const teachingPopoverTitleClassNames = {
  root: 'fui-TeachingPopoverTitle',
  dismissButton: 'fui-TeachingPopoverTitle__dismissButton',
} as const;
export const teachingPopoverBodyClassNames = {
  root: 'fui-TeachingPopoverBody',
  media: 'fui-TeachingPopoverBody__media',
} as const;
export const teachingPopoverFooterClassNames = { root: 'fui-TeachingPopoverFooter' } as const;
export const teachingPopoverCarouselClassNames = { root: 'fui-TeachingPopoverCarousel' } as const;
export const teachingPopoverCarouselCardClassNames = {
  root: 'fui-TeachingPopoverCarouselCard',
} as const;
export const teachingPopoverCarouselFooterClassNames = {
  root: 'fui-TeachingPopoverCarouselFooter',
  previous: 'fui-TeachingPopoverCarouselFooter__previous',
  next: 'fui-TeachingPopoverCarouselFooter__next',
} as const;
export const teachingPopoverCarouselFooterButtonClassNames = {
  root: 'fui-TeachingPopoverCarouselFooterButton',
} as const;
export const teachingPopoverCarouselNavClassNames = {
  root: 'fui-TeachingPopoverCarouselNav',
} as const;
export const teachingPopoverCarouselNavButtonClassNames = {
  root: 'fui-TeachingPopoverCarouselNavButton',
} as const;
export const teachingPopoverCarouselPageCountClassNames = {
  root: 'fui-TeachingPopoverCarouselPageCount',
} as const;

const styleSlot = <Props extends { className?: string }>(
  resolved: Props,
  marker: string,
  scopedClass: string | undefined,
): Props => ({
  ...resolved,
  className: [marker, scopedClass, resolved.className].filter(Boolean).join(' '),
});

export const TeachingPopover = (props: TeachingPopoverProps): React.ReactElement => {
  const { appearance, size = 'medium', ...behaviorProps } = props;
  const state = useTeachingPopover(behaviorProps);
  const contextValues = useTeachingPopoverContextValues(state);
  const visual = React.useMemo(() => ({ appearance, size }), [appearance, size]);
  return (
    <PopoverVisualContext.Provider value={visual}>
      {renderTeachingPopover(state, contextValues)}
    </PopoverVisualContext.Provider>
  );
};

TeachingPopover.displayName = 'TeachingPopover';

export const TeachingPopoverSurface: ForwardRefComponent<TeachingPopoverSurfaceProps> = React.forwardRef<
  InferredElementRefType<TeachingPopoverSurfaceProps>,
  TeachingPopoverSurfaceProps
>((props, ref) => {
  const { appearance, size } = usePopoverVisualContext();
  const state = useTeachingPopoverSurface(props, ref);
  return renderTeachingPopoverSurface({
    ...state,
    root: styleSlot(
      {
        ...state.root,
        'data-appearance': appearance,
        'data-size': size,
        'data-teaching-popover-surface': '',
      },
      `${popoverSurfaceClassNames.root} ${teachingPopoverSurfaceClassNames.root}`,
      styles.TeachingPopoverSurface,
    ),
  });
});

TeachingPopoverSurface.displayName = 'TeachingPopoverSurface';

export const TeachingPopoverHeader: ForwardRefComponent<TeachingPopoverHeaderProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverHeaderProps
>((props, ref) => {
  const { appearance } = usePopoverVisualContext();
  const state = useTeachingPopoverHeader(props, ref);
  return renderTeachingPopoverHeader({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-appearance': appearance },
      teachingPopoverHeaderClassNames.root,
      styles.TeachingPopoverHeader,
    ),
    icon:
      state.icon &&
      styleSlot(
        {
          ...state.icon,
          'data-appearance': appearance,
          children:
            state.icon.children === undefined ? (
              <Lightbulb16Regular className={styles.TeachingPopover__glyph} />
            ) : (
              state.icon.children
            ),
        },
        teachingPopoverHeaderClassNames.icon,
        styles.TeachingPopoverHeader__icon,
      ),
    dismissButton:
      state.dismissButton &&
      styleSlot(
        {
          ...state.dismissButton,
          type: state.dismissButton.type ?? 'button',
          'data-appearance': appearance,
          children:
            state.dismissButton.children === undefined ? (
              <Dismiss12Regular className={styles.TeachingPopover__glyph} />
            ) : (
              state.dismissButton.children
            ),
        },
        teachingPopoverHeaderClassNames.dismissButton,
        styles.TeachingPopoverHeader__dismissButton,
      ),
  });
});

TeachingPopoverHeader.displayName = 'TeachingPopoverHeader';

export const TeachingPopoverTitle: ForwardRefComponent<TeachingPopoverTitleProps> = React.forwardRef<
  HTMLHeadingElement,
  TeachingPopoverTitleProps
>((props, ref) => {
  const { appearance } = usePopoverVisualContext();
  const state = useTeachingPopoverTitle(props, ref);
  const dismissButtonProps = slot.resolveShorthand<
    ExtractSlotProps<TeachingPopoverTitleProps['dismissButton']> | null | undefined
  >(props.dismissButton);
  return renderTeachingPopoverTitle({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-appearance': appearance },
      teachingPopoverTitleClassNames.root,
      styles.TeachingPopoverTitle,
    ),
    dismissButton:
      state.dismissButton &&
      styleSlot(
        {
          ...state.dismissButton,
          type: state.dismissButton.type ?? 'button',
          'data-appearance': appearance,
          // A visible styled dismiss control is accessible unless the caller explicitly hides it.
          'aria-hidden': dismissButtonProps?.['aria-hidden'],
          children:
            state.dismissButton.children === undefined ? (
              <DismissRegular className={styles.TeachingPopover__glyph} />
            ) : (
              state.dismissButton.children
            ),
        },
        teachingPopoverTitleClassNames.dismissButton,
        styles.TeachingPopoverTitle__dismissButton,
      ),
  });
});

TeachingPopoverTitle.displayName = 'TeachingPopoverTitle';

export const TeachingPopoverBody: ForwardRefComponent<TeachingPopoverBodyProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverBodyProps
>((props, ref) => {
  const state = useTeachingPopoverBody(props, ref);
  return renderTeachingPopoverBody({
    ...state,
    root: styleSlot(state.root, teachingPopoverBodyClassNames.root, styles.TeachingPopoverBody),
    media:
      state.media &&
      styleSlot(
        { ...state.media, 'data-media-length': state.mediaLength },
        teachingPopoverBodyClassNames.media,
        styles.TeachingPopoverBody__media,
      ),
  });
});

TeachingPopoverBody.displayName = 'TeachingPopoverBody';

export const TeachingPopoverFooter: ForwardRefComponent<TeachingPopoverFooterProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverFooterProps
>((props, ref) => {
  const state = useTeachingPopoverFooter(props, ref);
  return renderTeachingPopoverFooter({
    ...state,
    root: styleSlot(
      { ...state.root, 'data-footer-layout': state.footerLayout },
      teachingPopoverFooterClassNames.root,
      styles.TeachingPopoverFooter,
    ),
  });
});

TeachingPopoverFooter.displayName = 'TeachingPopoverFooter';

export const TeachingPopoverCarousel: ForwardRefComponent<TeachingPopoverCarouselProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselProps
>((props, ref) => {
  const state = useTeachingPopoverCarousel(props, ref);
  const contextValues = useTeachingPopoverCarouselContextValues(state);
  return renderTeachingPopoverCarousel(
    { ...state, root: styleSlot(state.root, teachingPopoverCarouselClassNames.root, undefined) },
    contextValues,
  );
});

TeachingPopoverCarousel.displayName = 'TeachingPopoverCarousel';

export const TeachingPopoverCarouselCard: ForwardRefComponent<TeachingPopoverCarouselCardProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselCardProps
>((props, ref) => {
  const state = useTeachingPopoverCarouselCard(props, ref);
  return renderTeachingPopoverCarouselCard({
    ...state,
    root: styleSlot(state.root, teachingPopoverCarouselCardClassNames.root, undefined),
  });
});

TeachingPopoverCarouselCard.displayName = 'TeachingPopoverCarouselCard';

export const TeachingPopoverCarouselFooterButton: ForwardRefComponent<TeachingPopoverCarouselFooterButtonProps> =
  React.forwardRef<HTMLButtonElement | HTMLAnchorElement, TeachingPopoverCarouselFooterButtonProps>((props, ref) => {
    const { appearance: popoverAppearance } = usePopoverVisualContext();
    const { appearance: appearanceProp, size, shape, ...behaviorProps } = props;
    const appearance =
      'appearance' in props
        ? appearanceProp ?? 'secondary'
        : props.navType === 'next'
        ? popoverAppearance === 'brand'
          ? 'secondary'
          : 'primary'
        : popoverAppearance === 'brand'
        ? 'outline'
        : 'secondary';
    const state = useTeachingPopoverCarouselFooterButton(behaviorProps, ref);
    const brandRecipe =
      popoverAppearance === 'brand' &&
      (appearance === 'secondary' || appearance === 'outline') &&
      !props.disabled &&
      !props.disabledFocusable;
    // Keep navigation and trailing-step text from the public footer hook.
    // Button supplies its standard native type, ARIA, disabled and icon semantics.
    return renderTeachingPopoverCarouselFooterButton({
      ...state,
      components: { root: Button },
      root: slot.always(
        styleSlot(
          {
            ...state.root,
            'data-appearance': appearance,
            'data-popover-appearance': popoverAppearance,
            'data-nav-type': state.navType,
            'data-brand-nav': brandRecipe ? state.navType : undefined,
            'data-brand-background': brandRecipe && appearance === 'secondary' ? '' : undefined,
            appearance,
            size,
            shape,
            icon: props.icon,
            iconPosition: props.iconPosition,
            disabled: props.disabled,
            disabledFocusable: props.disabledFocusable,
          },
          teachingPopoverCarouselFooterButtonClassNames.root,
          styles.TeachingPopoverCarouselFooterButton,
        ),
        { elementType: Button },
      ),
    });
  });

TeachingPopoverCarouselFooterButton.displayName = 'TeachingPopoverCarouselFooterButton';

export const TeachingPopoverCarouselFooter: ForwardRefComponent<TeachingPopoverCarouselFooterProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselFooterProps
>(({ layout = 'centered', ...props }, ref) => {
  const state = useTeachingPopoverCarouselFooter(props, ref);
  return renderTeachingPopoverCarouselFooter({
    ...state,
    components: {
      root: 'div',
      previous: TeachingPopoverCarouselFooterButton,
      next: TeachingPopoverCarouselFooterButton,
    },
    root: styleSlot(
      {
        ...state.root,
        'data-layout': layout,
        'data-has-previous': state.previous ? '' : undefined,
      },
      teachingPopoverCarouselFooterClassNames.root,
      styles.TeachingPopoverCarouselFooter,
    ),
    previous:
      state.previous &&
      slot.always<TeachingPopoverCarouselFooterButtonProps>(
        styleSlot(
          state.previous,
          teachingPopoverCarouselFooterClassNames.previous,
          styles.TeachingPopoverCarouselFooter__previous,
        ),
        { elementType: TeachingPopoverCarouselFooterButton },
      ),
    next: slot.always<TeachingPopoverCarouselFooterButtonProps>(
      styleSlot(state.next, teachingPopoverCarouselFooterClassNames.next, styles.TeachingPopoverCarouselFooter__next),
      { elementType: TeachingPopoverCarouselFooterButton },
    ),
  });
});

TeachingPopoverCarouselFooter.displayName = 'TeachingPopoverCarouselFooter';

/** The public headless tablist does not yet wire arrow-key focus navigation. */
export const TeachingPopoverCarouselNav: ForwardRefComponent<TeachingPopoverCarouselNavProps> = React.forwardRef<
  HTMLDivElement,
  TeachingPopoverCarouselNavProps
>((props, ref) => {
  const state = useTeachingPopoverCarouselNav(props, ref);
  return renderTeachingPopoverCarouselNav({
    ...state,
    root: styleSlot(state.root, teachingPopoverCarouselNavClassNames.root, styles.TeachingPopoverCarouselNav),
  });
});

TeachingPopoverCarouselNav.displayName = 'TeachingPopoverCarouselNav';

export const TeachingPopoverCarouselNavButton: ForwardRefComponent<TeachingPopoverCarouselNavButtonProps> =
  React.forwardRef<HTMLButtonElement | HTMLAnchorElement, TeachingPopoverCarouselNavButtonProps>((props, ref) => {
    const { appearance } = usePopoverVisualContext();
    const state = useTeachingPopoverCarouselNavButton(props, ref);
    return renderTeachingPopoverCarouselNavButton({
      ...state,
      root: styleSlot(
        { ...state.root, 'data-appearance': appearance },
        teachingPopoverCarouselNavButtonClassNames.root,
        styles.TeachingPopoverCarouselNavButton,
      ),
    });
  });

TeachingPopoverCarouselNavButton.displayName = 'TeachingPopoverCarouselNavButton';

export const TeachingPopoverCarouselPageCount: ForwardRefComponent<TeachingPopoverCarouselPageCountProps> =
  React.forwardRef<HTMLDivElement, TeachingPopoverCarouselPageCountProps>((props, ref) => {
    const state = useTeachingPopoverCarouselPageCount(props, ref);
    return renderTeachingPopoverCarouselPageCount({
      ...state,
      root: styleSlot(
        state.root,
        teachingPopoverCarouselPageCountClassNames.root,
        styles.TeachingPopoverCarouselPageCount,
      ),
    });
  });

TeachingPopoverCarouselPageCount.displayName = 'TeachingPopoverCarouselPageCount';
