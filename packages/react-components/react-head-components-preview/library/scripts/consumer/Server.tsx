import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { HydrationFixture } from './HydrationFixture';

export function renderFixture() {
  return renderToString(<HydrationFixture />);
}
