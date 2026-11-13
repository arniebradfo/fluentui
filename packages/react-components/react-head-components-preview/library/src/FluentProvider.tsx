// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

'use client';

import * as React from 'react';
import { Provider, type ProviderProps } from '@fluentui/react-headless-components-preview/provider';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import { webLightTheme, type PartialTheme } from '@fluentui/react-theme';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import styles from './FluentProvider.module.css';
import './Icon.css';

const ThemeContext = React.createContext<PartialTheme | undefined>(undefined);

export type FluentProviderProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'dir'> &
  Pick<ProviderProps, 'dir' | 'targetDocument'> & {
    /** Fluent CSS variables. Partial nested themes inherit their parent's values. */
    theme?: PartialTheme;
  };

export const fluentProviderClassNames = { root: 'fui-FluentProvider' } as const;

/**
 * Optional theme root. Consumers may instead supply the CSS variables themselves
 * and use the public headless Provider for direction and target-document context.
 */
export const FluentProvider: ForwardRefComponent<FluentProviderProps> = React.forwardRef(
  ({ children, className, dir: dirProp, style, targetDocument, theme, ...props }, ref) => {
    const parentTheme = React.useContext(ThemeContext);
    const parentContext = useFluent_unstable();
    const dir = dirProp ?? parentContext.dir;
    const resolvedTheme = React.useMemo(() => ({ ...(parentTheme ?? webLightTheme), ...theme }), [parentTheme, theme]);
    const variables = React.useMemo(
      () => Object.fromEntries(Object.entries(resolvedTheme).map(([name, value]) => [`--${name}`, value])),
      [resolvedTheme],
    );

    return (
      <Provider dir={dir} targetDocument={targetDocument}>
        <ThemeContext.Provider value={resolvedTheme}>
          <div
            {...props}
            ref={ref}
            dir={dir}
            className={[fluentProviderClassNames.root, styles.FluentProvider, className].filter(Boolean).join(' ')}
            style={{ ...variables, ...style }}
          >
            {children}
          </div>
        </ThemeContext.Provider>
      </Provider>
    );
  },
);

FluentProvider.displayName = 'FluentProvider';
