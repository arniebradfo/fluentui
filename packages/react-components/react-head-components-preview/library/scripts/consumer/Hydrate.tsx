import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { canUseDOM } from '@fluentui/react-utilities';
import { HydrationFixture } from './HydrationFixture';

const root = canUseDOM() ? globalThis.document.getElementById('root') : null;
if (!root) {
  throw new Error('The hydration fixture requires server-rendered markup.');
}
hydrateRoot(root, <HydrationFixture />);
