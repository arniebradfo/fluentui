# Fluent CSS Modules source recipes

Experimental Fluent visuals on public
`@fluentui/react-headless-components-preview@0.4.1` behavior. This package is
private and is not a production-ready v9 replacement.

Copy the [source](./src) into your application and install the public runtime
dependencies listed in [package.json](./package.json), plus React and React DOM.
Retain Microsoft's source attribution and the accompanying MIT license.

```tsx
import { Button, FluentProvider, webLightTheme } from './src';

export const Example = () => (
  <FluentProvider theme={webLightTheme}>
    <Button appearance="primary">Save</Button>
  </FluentProvider>
);
```

These are raw TypeScript/TSX and CSS Modules, not precompiled JavaScript. Keep
referenced sibling components and helpers. Your bundler must support CSS
Modules, nesting, `composes` and cascade layers. TypeScript also needs the usual
`*.module.css` declarations.

The source uses `.js` relative specifiers. Webpack source consumers need:

```js
module.exports = {
  resolve: {
    extensionAlias: { '.js': ['.js', '.ts', '.tsx'] },
  },
};
```

Other bundlers can resolve these specifiers to TypeScript themselves. SSR builds
must use matching server/client CSS Module identifiers.

The optional `FluentProvider` emits theme variables and supplies headless
direction/target-document context. Nested partial themes inherit their parent.
It imports [Icon.css](./src/Icon.css); import that stylesheet yourself if you
provide your own theme root.

Component rules use the `fluent-components` layer. Unlayered consumer CSS
overrides that layer; class-name string order is not CSS precedence.

Initialize focusgroup support before rendering when the browser needs it. See
the public headless [browser support](https://storybooks.fluentui.dev/headless/llms/overview-browser-support.txt)
and [polyfill guidance](https://storybooks.fluentui.dev/headless/llms/overview-polyfills-fallbacks.txt).
The library does not install global polyfills.

Use the current headless contracts, not assumptions about legacy v9 DOM.
Unsupported Table/DataGrid, Carousel, FlatTree and other unpublished headless
families have no old styled fallback. Text preset exports and full motion/arrow
parity are not included. Complete browser, accessibility and design-system
review is still required.
