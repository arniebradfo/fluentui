# Fluent CSS Modules on headless components

An experimental, private styled layer on the public
`@fluentui/react-headless-components-preview@0.4.1` APIs. This is a first draft, not
a production release or a claim of complete v9 parity.

The existing v9 components remain unchanged. The new wrappers add Fluent visual
defaults, CSS Modules and default icons to current headless behavior. They do
not restore Griffel, Tabster, legacy portals or the old positioning engine.

The priorities are human-visible similarity to stock v9 and simple, editable
source. Exact pixels, DOM structure and old APIs are not goals when matching
them would add disproportionate complexity. Small visual differences need
review, not increasingly complicated compatibility code.

## Layout

- [library/src](./library/src): source recipes, CSS Modules and focused tests.
- [Public exports](./library/src/index.ts): the supported styled surface.
- [stories](./stories): reused v9 scenarios, comparisons and native-API examples.
- [Runtime dependencies](./library/package.json): public npm version ranges, not
  workspace-only runtime imports.

The source follows the headless layout: kebab-case entrypoints expose a component
family, and its folder groups the implementation, styles, helpers and nested
subcomponents.

```text
library/src/
  button.ts
  tree.ts
  components/
    Button/
      Button.tsx
      Button.module.css
      index.ts
    Tree/
      Tree.tsx
      index.ts
      TreeItem/
        TreeItem.tsx
        TreeItem.module.css
        index.ts
      TreeItemLayout/
        TreeItemLayout.tsx
        TreeItemLayout.module.css
        index.ts
```

For example, [tree.ts](./library/src/tree.ts) re-exports
[components/Tree/index.ts](./library/src/components/Tree/index.ts).
Implementations use concrete sibling imports rather than their own family barrel.
Shared family styles remain at the family root where appropriate.

CSS Module provenance comments link to checked-in Fluent style definitions and
headless component/state/render sources. Applicable modules also link to the
headless Storybook CSS, including the native
[Dialog examples](../react-headless-components-preview/stories/src/Dialog/dialog.module.css).
Those examples help verify current slots, attributes and browser behavior; their
custom appearance is not the Fluent v9 visual specification. Shared styles and
aliases list their actual sources. Native Text and the styled Provider have no
corresponding headless story stylesheet. These are checkout-relative references,
not generated files in `node_modules`.

## Use in this workspace

```tsx
import { Button } from '@fluentui/react-head-components-preview/button';
import { Field } from '@fluentui/react-head-components-preview/field';
import { FluentProvider } from '@fluentui/react-head-components-preview/provider';
import { Input } from '@fluentui/react-head-components-preview/input';
import { webLightTheme } from '@fluentui/react-head-components-preview/theme';

export const Example = () => (
  <FluentProvider theme={webLightTheme}>
    <Field label="Name">
      <Input />
    </Field>
    <Button appearance="primary">Save</Button>
  </FluentProvider>
);
```

There are 60 public family/utility subpaths. The root barrel retains the existing
API. Selective imports rely on both these entrypoints and the package's CSS
`sideEffects` metadata, not on folders alone.
Use family subpaths for CSS isolation: the compatibility root barrel can retain
the catalog's stylesheets even when only one component is used.

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
referenced by a copied component, including any composed
[shared styles](./library/src/styles). These modules follow the component's
imports; do not load them as a global stylesheet. The catalog is deliberately
easy to edit, not a set of dependency-free single-file snippets.

Most component CSS is in the `fluent-components` cascade layer. Ordinary, unlayered
consumer CSS wins over that layer. Putting a class last in a `className` string
does not determine CSS precedence. Inline styles still follow normal CSS rules.
Composition-specific selectors must also retain their intended specificity.
Bundled-icon visibility rules are deliberately unlayered so the icon package's
unlayered display utilities cannot defeat the selected regular/filled variant.
Consumer overrides of those visibility rules must also account for specificity.
Webpack needs `.js` extension aliases for these raw TypeScript sources; see the
[source-consumer guide](./library/README.md). Server/client builds must agree on
their CSS Module identifiers.

### Shared style recipes

- [OverlaySurface](./library/src/styles/OverlaySurface.module.css) separates
  the surface colors and frame from elevation. Popover, MenuPopover, DialogSurface,
  the DatePicker popup, and Toast share the framed surface. Tooltip and
  TeachingPopover inherit it through PopoverSurface. Picker popups use the same
  box shadow without adopting its border, and Drawer uses the surface colors
  without adopting its rounded frame. NavDrawer adds a shadow only in overlay mode.
  Arrow shadows use a filter so they include the arrow; their depth can still differ.
  Layout, visibility, positioning, and backdrops stay local.
- [InputFrame](./library/src/components/Input/InputFrame.module.css) gives Input,
  SearchBox (through Input), and DatePicker the same outer frame, spacing, and
  appearance states. It composes InputFocus. The control slots,
  validation selectors, and DatePicker's easing stay local.
- [InputFocus](./library/src/components/Input/InputFocus.module.css) draws and animates
  the underline without adding a frame. SpinButton, Dropdown, Combobox,
  TagPickerControl, Textarea, and Select use it directly. The line covers the
  root border by default. Exceptions stay local, such as Dropdown's clear-button
  focus and Textarea's resize clearance. Select keeps its native control outline;
  the wrapper's line follows the stroke-width token even with square corners.
  The Input recipes style the control, not the
  [Field](./library/src/components/Field/Field.tsx) wrapper for labels, hints,
  and validation messages.
- [InputText](./library/src/components/Input/InputText.module.css) styles editable
  text and placeholders for Input, SearchBox (through Input), editable
  DatePicker, Combobox, SpinButton, Textarea, and TagPickerInput. The controls
  still own sizing, padding, native focus, and disabled state.
- [ListboxPickerFrame](./library/src/styles/ListboxPickerFrame.module.css) gives Dropdown,
  Combobox, and TagPickerControl one source for appearance and disabled styles.
  Dropdown and Combobox also share `PickerInvalid`. TagPicker keeps its own
  invalid borders, and Select styles the frame on the native `<select>`.
  [ListboxPopupFrame](./library/src/components/Dropdown/Listbox/Listbox.module.css)
  styles the popup itself, not the control that opens it.
- [FocusOutlines](./library/src/styles/FocusOutlines.module.css) distinguishes
  the `FocusBorder` classes, which use `border` on `::after`, from
  `FocusOutline` and `InsetFocusOutline`, which use CSS `outline`. Checkbox,
  Radio, and RatingItem show the border when they or a descendant receive
  visible focus. AccordionHeader and MenuItem use self-focus; Switch,
  sliders, and Option keep their own input or active-option selectors.
- [TagLayout](./library/src/components/Tag/TagLayout.module.css) shares tag
  spacing, text and media slots, and the extra-small hit target. This lets
  InteractionTag reuse those styles without importing Tag's root styles.
  [ColorThumb](./library/src/components/ColorPicker/ColorThumb.module.css)
  shares the thumb outline and geometry for ColorArea and ColorSlider; each
  keeps its own position, fill, and focus policy.
- [DrawerScrollSeparators](./library/src/components/Drawer/DrawerScrollSeparators.module.css)
  shares the rules for the lines that appear at the header and footer as
  the drawer body scrolls. NavDrawer uses the same line color, fade, and
  reduced-motion treatment as Drawer.
- [SliderTrack](./library/src/components/Slider/SliderTrack.module.css) gives Slider
  and RangeSlider the same rail, tick marks, and thumb visuals. Progress fills,
  focus, and overlapping thumbs stay local.
  [SliderInput](./library/src/components/Slider/SliderInput.module.css) gives Slider
  and ColorSlider (including AlphaSlider) the same single-input layout without
  sharing their rails or gradients.
- [Switch](./library/src/components/Switch/Switch.module.css) supplies the track
  geometry, thumb travel, and motion used by MenuItemSwitch. The menu continues
  to use menu state, not a nested Switch input.
- [CheckedListItem](./library/src/components/List/ListItem/CheckedListItem.module.css)
  supplies List and Tree's native selection marker, including the checked and
  mixed glyphs. Tree's radio dot is local. Multiselect Option composes the
  [Checkbox indicator](./library/src/components/Checkbox/Checkbox.module.css)
  on its decorative slot without rendering a checkbox input.
- [Swatch](./library/src/components/SwatchPicker/Swatch.module.css) shares the
  size and shape of ColorSwatch, ImageSwatch, and EmptySwatch. The filled
  swatches also share inset shadows for interaction states; EmptySwatch keeps
  its dashed border and native outline.

Dropdown, Combobox, and TagPicker default to a listbox below the field,
aligned to its start edge and matching its width. Callers can override
those defaults, and the browser can flip the listbox to fit when it is not
pinned.

For manual review, open **CSS Modules → Style primitives** in Storybook.
The [review stories](./stories/src/StylePrimitives.stories.tsx) group the
consumers of each shared stylesheet. Press Tab to review the focus states.
Use **CSS Modules → Primitive comparisons** to compare the preview recipes
with actual v9 components, including the v9 RangeSlider preview and compat
DatePicker. The [comparison stories](./stories/src/PrimitiveComparisons.stories.tsx)
use the same fixtures, theme, and direction on both sides. The drawer story
lets you scroll all four bodies together.

Prefer local selector grouping when it preserves specificity. `:is()` takes the
specificity of its strongest branch, and `:where()` adds none. Use `:has()` for
relationships the rendered DOM actually guarantees, not as a substitute for
headless state. Keep internal variables that feed several slots or change with
state. Don't add a shared alias just because two rules use the same token.
For composed styles, test the affected states with both sheets loaded in
either order. Equal-specificity rules in the same layer can still depend on
bundler output order; keep consumer overrides unlayered.

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

### CSS source review

The source review covers all 58 component folders, 130 CSS Modules and 169
implementation files, plus shared icon and style-free exports. The 128
modules with a corresponding headless example link to 58 actual story
stylesheets. All 803 local provenance targets were checked. Text and Provider
document their lack of a corresponding headless story stylesheet.

Most edits only add references. Styling corrections are confined to eight
modules: Tab, Combobox, Dropdown, DatePicker, Calendar, MenuSplitGroup, Nav and
Toaster. They address effective state-selector precedence, missing inherited
styles, bundled-icon visibility, spacing and forced-colors treatment. Editable
DatePicker also separates its visual `size` type from numeric `input.size`.
No source-proven styling correction was needed for Dialog, Drawer, Popover,
Tooltip, InfoLabel or TeachingPopover.

Focused browser regressions use real stock v9 components as the oracle for
computed colors, visible icon variants, interaction states and geometry.
Calendar measurements cover six five/six-week side-by-side and overlay states.
Root heights, weekday headers and Today placement match; the side-by-side root
retains a one-pixel intrinsic width difference from its explicit panel border.
The native headless footer remains a root sibling rather than recreating the old
DOM structure.

This source review is not a full visual or accessibility certification. Its
computed-style regressions do not expand or rerun the paired screenshot suite
described below.

An intermittent, stackless `AbortError: The user aborted a request.` also seen
in earlier native-layer probes can fail the Nav interaction test's runtime-error
gate after its visual comparisons pass. Its origin remains unresolved. The
exception is not filtered, and no unrelated motion or focus engine is patched.

### Paired v9 visual review

```sh
yarn nx run react-head-components-preview-stories:test-visual
yarn nx run react-head-components-preview-stories:review-visual

# No color threshold, pixel budget or anti-aliasing exclusion
yarn nx run react-head-components-preview-stories:test-visual:exact
yarn nx run react-head-components-preview-stories:review-visual:exact
```

The first command builds the same existing v9 visual-test stories twice: once
with stock components and once with the CSS Modules candidates. It currently
reuses nine modules from `apps/vr-tests-react-components`: all five Button
variants, Checkbox, Input interactions and two Menu modules. These contribute
191 unchanged upstream scenarios. Four local icon-state scenarios cover
combinations missing from those modules: subtle/transparent, disabled,
expanded, checked and high-contrast states across the Button variants and Input.
This is 195 scenarios and 595 paired captures, not proxy coverage for the
remaining component families.

Only reviewed story imports, the shared theme-variant helper and the visual
preview's provider are redirected. Runtime dependency imports are not aliased.
The test-only provider adapter removes `applyStylesToPortals`, which has no
equivalent job for native top-layer surfaces. There is no old-component fallback.
The test-only component facade maps the stock button aggregate and the local
fixture's umbrella imports to explicit candidate family entrypoints. Missing
exports fail the build rather than producing a misleading runtime comparison.

Playwright runs the original StoryWright steps in Chromium at the same viewport,
theme and font environment. Each reference image is captured from stock v9 in
that run, rather than approved from a candidate image. Both sides must expose
the same stories and steps. Browser errors and unsupported steps fail explicitly.
Do not use `--update-snapshots`; candidate snapshot updates are rejected.

The [HTML report](./stories/dist/visual-report/index.html) includes both images
for every captured state, plus Playwright's image differences for failed
comparisons. The review command serves it at `http://127.0.0.1:8102`.
Screenshots, references and traces stay in ignored `stories/dist` directories.

This is a review screen, not a perceptual certification or a requirement for
zero differing pixels. Playwright ignores small per-pixel color differences
with `threshold: 0.2`, then permits at most the smaller of 50 differing pixels
and 1% of the image. Cropped image dimensions must still match. A control test
checks that a one-pixel mark is tolerated but a missing Button is detected.
High-contrast theme stories do not emulate the browser's forced-colors mode.

The exact configuration decodes PNGs with `pngjs` and compares every RGBA
channel and the image dimensions. It does not use Playwright's anti-aliasing
exclusion, which still exists when its color threshold is zero. Any changed
pixel fails, including a one-level color or alpha difference. Red-on-white
exact difference masks and both source images are attached to the separate
[exact report](./stories/dist/visual-exact-report/index.html), served on port 8103. Per-frame counts are recorded in its annotations and
`stories/dist/visual-exact-results/report.json`.

Separate browser contracts compare actual icon colors and regular/filled
visibility with no tolerance, after finite CSS transitions finish. They also
check that keyboard navigation retains visible focus in both implementations.
Small but meaningful icon color changes must not rely on the image budget.

#### Source corrections and focus policy

The original 79-scenario screen flagged eight cases. Its exact baseline had
170 identical captures out of 193 and flagged one additional Circular Button
state: 39 edge pixels differed by only one channel level.

The source audit found literal `transparent` borders and field focus outlines
that had been translated to `colorTransparentStroke`. That token is intentionally
visible in high-contrast themes, so it is not an alias for structural
transparency. Corrections follow the source roles in Button, ToggleButton,
MenuButton, Select, Input, SpinButton, Textarea, Combobox, Dropdown, TagPicker
control, TeachingPopover and the Checkbox/Radio/Switch focus outlines. Existing
token-based strokes in surfaces, sliders and similar components stay themed.
Button composition also carries the shared fix to its other variants, Toolbar
buttons and BreadcrumbButton; this does not certify every composition visually.

Expanded MenuButton styling follows the stock selected-state rules even when
the native button is disabled. The disabled attribute and interaction blocking
remain intact; its background, icon variant and selected foreground are not
necessarily styled like a closed disabled control.

Menu's remaining focus-policy difference is not a missing style declaration.
Both implementations focus the item, but stock v9 paints from Tabster's
`data-fui-focus-visible` marker and the candidate paints from native
`:focus-visible`. The browser can show the latter after programmatic focus
without setting the former. Keyboard focus is retained and tested; no legacy
focus runtime or screenshot mask is added to hide this difference.

#### Latest full comparison

| Check                | Scenarios within the check | Captures within the check |
| -------------------- | -------------------------- | ------------------------- |
| Normal review screen | 191 / 195                  | 587 / 595                 |
| Exact RGBA equality  | 188 / 195                  | 584 / 595                 |

Both runs flag four Menu scenarios (basic and slotted-icon, each LTR/RTL)
because of the focus policy above. Exact mode also flags one frame each in
Button Default RTL, CompoundButton Transparent and ToggleButton Default:
16, 1 and 14 changed pixels, respectively. These small residuals remain
visible in the report rather than being approved or hidden.

The strict icon color/variant, keyboard focus, raw-comparator controls and
primary expanded-disabled MenuButton comparison pass. The latter compares
computed styles with real stock v9 and checks that both controls remain
disabled; it is not an assumption that all disabled backgrounds are identical.
The existing 63 catalog/browser comparisons and 10 public-npm consumer browser
checks also pass after the source corrections.

The command exits nonzero when a comparison exceeds that budget. Inspect the
images before deciding whether a difference warrants a simple style correction
or is an acceptable tradeoff. Do not mask controls, broadly increase tolerances,
or restore old runtime machinery merely to get a green report. The initial
coverage is not a claim about the full catalog, motion or other browsers.

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
dependencies and the local source package with scripts disabled, type-checks without monorepo aliases, and
builds real CSS for normal and reversed foundation import orders. It checks
retained production modules for Griffel/Tabster engines and for workspace
resolution leaks. It uses React 19 for this initial consumer proof.
Separate Button, Tree and NavItem entry bundles check that unused styled
implementations and unrelated component CSS are absent. A root-barrel Button
bundle separately reports its stylesheet cost rather than claiming CSS isolation.

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

The repository MIT license applies to these sources. Exported recipes include
the complete license notice; per-file copyright banners are omitted. The original
product-specific README and infrastructure are not a runbook for this package.
