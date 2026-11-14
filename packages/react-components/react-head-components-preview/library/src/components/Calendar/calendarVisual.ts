'use client';

import * as React from 'react';

export type CalendarMonthVisualProps = {
  /** Highlight today's month, and today's year in the nested year picker. @default false */
  highlightCurrentMonth?: boolean;
  /** Highlight the selected month, and selected year in the nested year picker. @default false */
  highlightSelectedMonth?: boolean;
};

type CalendarVisualContextValue = {
  highlightCurrent: boolean;
  highlightSelected: boolean;
};

export const CalendarVisualContext = React.createContext<CalendarVisualContextValue | undefined>(undefined);

type ClassNameSlot = { className?: string; children?: React.ReactNode } | null | undefined;

export function compose(slotProps: ClassNameSlot, ...classNames: (string | false | undefined)[]): void {
  if (slotProps) {
    slotProps.className = [...classNames, slotProps.className].filter(Boolean).join(' ');
  }
}

// Upstream navigation buttons are unlabeled visually; supply the v9 glyph only when consumers did not.
export function withDefaultIcon(slotProps: ClassNameSlot, icon: React.ReactNode): void {
  if (slotProps && slotProps.children === undefined) {
    slotProps.children = icon;
  }
}
