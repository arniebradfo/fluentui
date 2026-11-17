# Fluent CSS Modules source recipes

Experimental Fluent visuals on public
`@fluentui/react-headless-components-preview@0.4.1` behavior. This package is
private and is not a production-ready v9 replacement.

The goals are a stock-v9 appearance that looks the same to a person and simple,
editable source. Small reviewed visual differences are acceptable when exact
matching would add complexity. Keep API changes small where practical, without
recreating obsolete behavior or styling engines.

Copy the [source](./src) into your application and install the public runtime
dependencies listed in [package.json](./package.json), plus React and React DOM.
Retain the accompanying repository MIT license, including its copyright and
permission notice, when copying or adapting the source.

```tsx
import { Button } from './src/button';
import { FluentProvider } from './src/provider';
import { webLightTheme } from './src/theme';

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

Each kebab-case entrypoint re-exports an indexed family under
`src/components/<Family>/`. Subcomponents have their own folders and indexes;
their implementation, CSS and adjacent tests stay together. Shared family CSS
and helpers can remain at the family root.

Copy the relevant entrypoint and family folders, including referenced shared
dependencies. The root entrypoint remains compatible with existing imports.
For a copied package, preserve `sideEffects: ["**/*.css"]` from the manifest so
bundlers can remove unused implementation modules without discarding used CSS.
Family isolation does not imply declaration-level pruning inside shared CSS.
Prefer the family entrypoints: a compatibility-root import can retain the
catalog's stylesheets even when only one component is used.

CSS provenance comments point to the checked-in Fluent style, headless behavior
and applicable headless Storybook CSS sources in the original workspace.
The story styles demonstrate current DOM and native-browser requirements, not
necessarily the stock v9 appearance. Those source-reference links are for working
in that checkout; they are not runtime imports or additional files to copy.
Preserve the source's structural `transparent` values. In particular,
`colorTransparentStroke` becomes visible in high-contrast themes and is not an
alias for an always-transparent border or focus outline.

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
Bundled-icon visibility rules are unlayered to override the icon package's
unlayered display utilities. Custom visibility overrides must also account for
their selector specificity.

Initialize focusgroup support before rendering when the browser needs it. See
the public headless [browser support](https://storybooks.fluentui.dev/headless/llms/overview-browser-support.txt)
and [polyfill guidance](https://storybooks.fluentui.dev/headless/llms/overview-polyfills-fallbacks.txt).
The library does not install global polyfills.

DatePicker's `size` selects its Fluent visual size, including editable mode.
Use numeric `input.size` for the editable input's native character-width hint.

Use the current headless contracts, not assumptions about legacy v9 DOM.
Focus indicators use native `:focus-visible`, not v9's Tabster visibility marker.
Programmatically focused native overlays can therefore show an indicator in
states where stock v9 does not. Do not remove visible keyboard focus to force
identical screenshots.
Unsupported Table/DataGrid, Carousel, FlatTree and other unpublished headless
families have no old styled fallback. Text preset exports and full motion/arrow
parity are not included. Complete browser, accessibility and design-system
review is still required.
