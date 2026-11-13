// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useFluent_unstable } from '@fluentui/react-shared-contexts';
import { webDarkTheme, webLightTheme } from '@fluentui/react-theme';
import { renderToString } from 'react-dom/server';
import { FluentProvider } from './FluentProvider';

describe('FluentProvider', () => {
  it('merges nested themes without resetting the parent palette', () => {
    render(
      <FluentProvider theme={webDarkTheme}>
        <FluentProvider theme={{ fontFamilyBase: 'consumer-font' }} data-testid="nested" />
      </FluentProvider>,
    );

    const root = screen.getByTestId('nested');
    expect(root.style.getPropertyValue('--colorNeutralBackground1')).toBe(webDarkTheme.colorNeutralBackground1);
    expect(root.style.getPropertyValue('--fontFamilyBase')).toBe('consumer-font');
  });

  it('preserves the root ref and caller class and style overrides', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FluentProvider
        ref={ref}
        data-testid="root"
        className="consumer"
        style={{ color: webLightTheme.colorBrandForeground1 }}
      />,
    );

    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveClass('consumer');
    expect(ref.current).toHaveStyle({ color: webLightTheme.colorBrandForeground1 });
  });

  it('shares direction and target document with public headless hooks', () => {
    let context: ReturnType<typeof useFluent_unstable> | undefined;
    const ReadContext = () => {
      context = useFluent_unstable();
      return null;
    };
    const { container } = render(<div />);
    const targetDocument = container.ownerDocument.implementation.createHTMLDocument();
    render(
      <FluentProvider dir="rtl" targetDocument={targetDocument} data-testid="root">
        <ReadContext />
        <FluentProvider data-testid="nested" />
      </FluentProvider>,
    );

    expect(context?.dir).toBe('rtl');
    expect(context?.targetDocument).toBe(targetDocument);
    expect(screen.getByTestId('root')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByTestId('nested')).toHaveAttribute('dir', 'rtl');
  });

  it('emits theme variables during server rendering', () => {
    const html = renderToString(<FluentProvider theme={webDarkTheme}>Server content</FluentProvider>);
    expect(html).toContain(`--colorNeutralBackground1:${webDarkTheme.colorNeutralBackground1}`);
    expect(html).toContain('Server content');
  });
});
