# Fluent CSS Modules on headless components

An experimental, private styled layer on the public
`@fluentui/react-headless-components-preview@0.4.1` APIs. This is a first draft, not
a production release or a claim of complete v9 parity.

The existing v9 components remain unchanged. The new wrappers add Fluent visual
defaults, CSS Modules and default icons to current headless behavior. They do
not restore Griffel, Tabster, legacy portals or the old positioning engine.

## Layout

- [library/src](./library/src): source recipes, CSS Modules and focused tests.
- [Public exports](./library/src/index.ts): the supported styled surface.
- [stories](./stories): reused v9 scenarios, comparisons and native-API examples.
- [Runtime dependencies](./library/package.json): public npm version ranges, not
  workspace-only runtime imports.

## Use in this workspace

```tsx
import { Button, Field, FluentProvider, Input, webLightTheme } from '@fluentui/react-head-components-preview';

export const Example = () => (
  <FluentProvider theme={webLightTheme}>
    <Field label="Name">
      <Input />
    </Field>
    <Button appearance="primary">Save</Button>
  </FluentProvider>
);
```

`FluentProvider` is an optional DOM theme root. It supplies Fluent CSS variables,
direction and target-document context. Partial nested themes merge with their
parent. Caller classes and inline styles are retained.

You can instead provide the CSS variables yourself and use the unstyled public
headless `Provider` for direction and target-document context. Native top-layer
surfaces retain their actual DOM ancestry and inherit those variables.

The theme root imports [Icon.css](./library/src/Icon.css). If you omit it, import
that stylesheet explicitly when using default headless icons.

## Copy into another design system

1. Copy [library/src](./library/src), excluding tests, into your application.
   Retain the repository MIT license. The build command below creates a filtered
   copy with its own [source-consumer guide](./library/README.md) and license.
2. Install the public runtime dependencies listed in
   [library/package.json](./library/package.json), plus React and React DOM.
3. Use a bundler with CSS Modules, CSS nesting, `composes` and cascade-layer
   support. Import the copied source directly. TypeScript consumers need the
   usual `*.module.css` declarations.
4. Provide a theme root or the equivalent Fluent CSS variables. Import the icon
   stylesheet if you do not use the supplied theme root.
5. Customize the local source, tokens or slot classes.

This package is not published. Do not replace its local source import with an
npm import of `@fluentui/react-head-components-preview`. Its **headless and
foundation dependencies** are the public packages.

The build produces raw source recipes under `library/dist/source`; it does not
produce compiled JavaScript or an aggregate `styles.css`. Keep sibling files
referenced by a copied component. The catalog is deliberately easy to edit,
not a set of dependency-free single-file snippets.

Component CSS is in the `fluent-components` cascade layer. Ordinary, unlayered
consumer CSS wins over that layer. Putting a class last in a `className` string
does not determine CSS precedence. Inline styles still follow normal CSS rules.
Composition-specific selectors must also retain their intended specificity.
Webpack needs `.js` extension aliases for these raw TypeScript sources; see the
[source-consumer guide](./library/README.md). Server/client builds must agree on
their CSS Module identifiers.

## Browser and API contract

Headless uses native dialog/popover, CSS anchor positioning and native form
controls. Follow its current
[browser-support](https://storybooks.fluentui.dev/headless/llms/overview-browser-support.txt)
and [polyfill](https://storybooks.fluentui.dev/headless/llms/overview-polyfills-fallbacks.txt)
guidance. The documented native-overlay floor is Chrome/Edge 129, Firefox 147
and Safari 26. This is not a claim that every feature works without setup.

Consumers must initialize focusgroup support where it is not native. The demos
and public-npm consumer explicitly initialize
`@microsoft/focusgroup-polyfill/shadowless`; the component library does not
silently install global polyfills.

Keep the current public headless APIs where they differ from v9. In particular:

- `DialogBody` contains the dialog content; do not assume the old v9 grid or a
  `DialogContent` alias.
- Calendar native-element refs and imperative handles remain separate.
- Tree does not calculate hierarchical checked state or offer
  `defaultCheckedItems`. Mixed state is supported when supplied by the consumer.
- Card's nested-control selection restriction remains consumer-owned through
  `shouldRestrictTriggerAction`. No hidden Tabster-based default is added.

## Scope and known differences

The draft includes the supported button, form, picker, identity, status, color,
rating, calendar/date, overlay, notification, collection, tag, tree and toolbar
families. It also adds the twelve currently supported standard Nav members and
passes through the useful style-free Overflow APIs.

There are no old styled fallbacks for unavailable headless components:

- Table/DataGrid and the standard Carousel family.
- FlatTree, FlatTreeItem, TreeItemPersonaLayout and TreeRootReset.
- ToastTrigger and MessageBarGroup.
- Specialized Nav Hamburger, AppItem, AppItemStatic and SplitNavItem.

Portal, PresenceGroup and a general live-announcer facade are not added as
compatibility shims. Text is a small local native typography component.
Standard Text preset exports are not included yet.
Product-only CodeBlock, Markdown, DateTimePicker, CopyButton, LinkButton,
FileUpload and DropdownButton APIs are not part of this layer. Standard Divider
support remains, including its content.

Remaining differences include approximate overlay arrows, local rather than
cross-tab indicator transitions, and incomplete surface/calendar motion parity.
Some behavior gaps are inherited from headless: teaching-carousel arrow
navigation, virtual pointer-target positioning, and browser-dependent native
close behavior cannot be fixed by CSS.

Preview dependencies can retain old styling/focus code in development, including
Tree's development-only styled-hook name reference. The isolation check measures
retained production modules; it does not certify a Griffel-free development bundle.

Esbuild still emits composition-order warnings for overlapping inherited
properties. These remain visible. Explicit state/specificity ordering and the
browser checks cover representative cases, not every composition/state axis.

Do not treat passing unit tests or a successful screenshot build as full visual
or accessibility certification. Firefox/Safari, screen readers, forced colors,
reduced motion and the complete state/theme matrix still need dedicated review.

## Development and verification

Run commands from the repository root:

```sh
yarn nx run react-head-components-preview:test --runInBand
yarn nx run react-head-components-preview:type-check
yarn nx run react-head-components-preview:lint
yarn nx run react-head-components-preview:verify-css
yarn nx run react-head-components-preview:build
yarn nx run react-head-components-preview-stories:verify-catalog
yarn nx run react-head-components-preview-stories:type-check
yarn nx run react-head-components-preview-stories:build-storybook
yarn nx run react-head-components-preview-stories:storybook
```

As with other workspace libraries, local type checks require prepared dependency
declarations. The separate consumer proof below checks the copied source against
actual public npm declarations without workspace aliases.

Tests use the existing Jest/Testing Library infrastructure and headless browser
API shims. Shared native contracts run against stock v9, public headless and the
new styled implementations. Family regressions cover visual defaults,
controlled values, refs, slot composition and correction targets.

Jest's CSS shim is only for semantic tests. `verify-css` separately compiles real
CSS Modules and checks static class-map accesses against actual exports.

Storybook reuses reviewed v9 story bodies through an explicit importer allowlist
and test-only facade. It never globally aliases component packages or silently
falls back to old styled components. Griffel used for reference demos or demo
layout is not evidence that the copied runtime requires it.

### Public-npm consumer

```sh
yarn nx run react-head-components-preview:verify-consumer
yarn nx run react-head-components-preview:test-browser
yarn nx run react-head-components-preview-stories:test-browser
yarn nx run react-head-components-preview:preview-consumer
```

Install the existing Playwright runner's browser when needed:

```sh
yarn playwright install chromium
```

The verifier copies the source into `library/dist/consumer`, installs public npm
dependencies with scripts disabled, type-checks without monorepo aliases, and
builds real CSS for normal and reversed foundation import orders. It checks
retained production modules for Griffel/Tabster engines and for workspace
resolution leaks. It uses React 19 for this initial consumer proof.

The preview serves that result at `http://127.0.0.1:8098`; `/reverse.html` uses the
reversed import order. This fixture is for browser rendering, keyboard, forms,
overlays, overrides and combined-state checks. Generated files are not source
and are not committed.

### Verified first-draft checks

- 39 Jest suites / 165 tests; strict source/test types and ESLint.
- 130 real CSS Modules and 358 static class-map accesses.
- Public-npm consumer with no workspace resolution or retained production
  Griffel/Tabster engine modules.
- 10 Playwright Chromium 141 checks, including import order, native forms,
  focusgroup menus, native popover/dialog dismissal, Tree focus, DatePicker
  invalidity, consumer overrides and real-CSS SSR hydration.
- All 60 Storybook scenarios mount in Chromium. Three additional comparisons
  match selected stock v9 computed styles in light, dark and RTL.

The SSR fixture covers Provider, Button, Field, Input and Checkbox. These checks
are not an exhaustive pixel, browser or assistive-technology certification.

All source retains Microsoft's MIT attribution. The original product-specific
README and infrastructure are not a runbook for this package.
