import * as React from 'react';
import type { StoryContext, StoryObj } from '@storybook/react';
import * as V9 from '@fluentui/react-components';
import { DatePicker as V9DatePicker } from '@fluentui/react-datepicker-compat';
import { RangeSlider as V9RangeSlider } from '@fluentui/react-range-slider-preview';
import * as Preview from '../../library/src';

export default { title: 'CSS Modules/Primitive comparisons', parameters: { layout: 'fullscreen' } };

const { tokens } = Preview;
const stock = { ...V9, DatePicker: V9DatePicker, RangeSlider: V9RangeSlider };
const columns = [
  { id: 'stock', title: 'Fluent v9 (Griffel)', ui: stock },
  { id: 'candidate', title: 'Head preview (CSS Modules)', ui: Preview },
] as const;
type UI = (typeof columns)[number]['ui'];
type Globals = StoryContext['globals'];
type Example = { id: string; label: string; render: (ui: UI, side: 'stock' | 'candidate') => React.ReactNode };

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacingVerticalS,
};
const row: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: tokens.spacingHorizontalL };
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
  minInlineSize: `calc(${tokens.spacingHorizontalXXXL} * 23)`,
};
const panel: React.CSSProperties = {
  ...stack,
  minInlineSize: 0,
  padding: tokens.spacingVerticalM,
  border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  borderRadius: tokens.borderRadiusMedium,
};

function Comparison({
  globals,
  instructions,
  examples,
  children,
}: React.PropsWithChildren<{ globals: Globals; instructions: string; examples: Example[] }>) {
  const theme = globals.theme === 'dark' ? V9.webDarkTheme : V9.webLightTheme;
  const dir = globals.direction === 'rtl' ? 'rtl' : 'ltr';

  return (
    <>
      <p>{instructions}</p>
      {children}
      {/* Keep the columns in place when both examples switch to RTL. */}
      <div dir="ltr" style={{ overflowX: 'auto', padding: tokens.spacingVerticalXXS }}>
        <div style={grid}>
          {columns.map(({ id, title }) => (
            <strong key={id}>{title}</strong>
          ))}
          {examples.map(({ id, label, render }) => (
            <React.Fragment key={id}>
              <h2 style={{ gridColumn: '1 / -1', marginBlockEnd: 0, fontSize: tokens.fontSizeBase400 }}>{label}</h2>
              {columns.map(({ id: side, ui }) => (
                <ui.FluentProvider key={side} theme={theme} dir={dir} style={panel} data-testid={`${id}-${side}`}>
                  {render(ui, side)}
                </ui.FluentProvider>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

const sliderWidth = { inlineSize: `calc(${tokens.spacingHorizontalXXXL} * 5)` };
const rangeInputs = { startInput: { 'aria-label': 'Minimum' }, endInput: { 'aria-label': 'Maximum' } };

function ColorSliders({ ui }: { ui: UI }) {
  const [color, setColor] = React.useState({ h: 320, s: 0.7, v: 0.8, a: 0.75 });
  return (
    <div style={row}>
      <div style={stack}>
        <ui.ColorSlider
          color={color}
          aria-label="Hue"
          onChange={(_, data) => setColor({ ...data.color, a: data.color.a ?? 1 })}
        />
        <ui.AlphaSlider
          color={color}
          aria-label="Opacity"
          onChange={(_, data) => setColor({ ...data.color, a: data.color.a ?? 1 })}
        />
      </div>
      <ui.ColorSlider
        vertical
        color={color}
        aria-label="Vertical hue"
        onChange={(_, data) => setColor({ ...data.color, a: data.color.a ?? 1 })}
      />
    </div>
  );
}

export const Sliders: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Drag the thumbs or use the arrow keys. Compare tick marks, the filled range, and keyboard focus. Use the direction toolbar to try RTL."
      examples={[
        {
          id: 'sliders',
          label: 'Slider and RangeSlider',
          render: ui => (
            <>
              <ui.Slider aria-label="Volume" defaultValue={40} step={10} style={sliderWidth} />
              <ui.RangeSlider {...rangeInputs} defaultValue={{ start: 20, end: 70 }} step={10} style={sliderWidth} />
              <ui.Slider aria-label="Disabled volume" defaultValue={40} disabled size="small" style={sliderWidth} />
              <ui.RangeSlider
                startInput={{ ...rangeInputs.startInput, disabled: true }}
                endInput={rangeInputs.endInput}
                defaultValue={{ start: 50, end: 50 }}
                size="small"
                style={sliderWidth}
              />
              <div style={row}>
                <ui.Slider aria-label="Vertical volume" vertical defaultValue={40} step={10} />
                <ui.RangeSlider {...rangeInputs} vertical defaultValue={{ start: 20, end: 70 }} step={10} />
              </div>
            </>
          ),
        },
        { id: 'color-sliders', label: 'ColorSlider and AlphaSlider', render: ui => <ColorSliders ui={ui} /> },
      ]}
    />
  ),
};

export const Switches: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Toggle the standalone and menu switches. Compare thumb travel, keyboard focus, disabled states, and RTL. The menu lists stay visible for comparison."
      examples={[
        {
          id: 'switches',
          label: 'Switch',
          render: ui => (
            <>
              <ui.Switch label="Alerts" defaultChecked />
              <ui.Switch label="Compact alerts" size="small" />
              <ui.Switch label="Disabled alerts" disabled defaultChecked />
            </>
          ),
        },
        {
          id: 'menu-switches',
          label: 'Menu item switch',
          render: ui => (
            <ui.MenuList aria-label="View options" defaultCheckedValues={{ view: ['grid', 'locked'] }}>
              <ui.MenuItemSwitch name="view" value="grid">
                Grid view
              </ui.MenuItemSwitch>
              <ui.MenuItemSwitch name="view" value="hidden">
                Show hidden files
              </ui.MenuItemSwitch>
              <ui.MenuItemSwitch name="view" value="locked" disabled>
                Locked view
              </ui.MenuItemSwitch>
            </ui.MenuList>
          ),
        },
      ]}
    />
  ),
};

function CheckedTree({ ui }: { ui: UI }) {
  const [checked, setChecked] = React.useState<NonNullable<Preview.TreeProps['checkedItems']>>([
    ['folder', 'mixed'],
    'report',
  ]);
  return (
    <ui.Tree
      aria-label="Documents"
      selectionMode="multiselect"
      defaultOpenItems={['folder']}
      checkedItems={checked}
      onCheckedChange={(_, data) => setChecked(data.checkedItems)}
    >
      <ui.TreeItem itemType="branch" value="folder">
        <ui.TreeItemLayout>Folder</ui.TreeItemLayout>
        <ui.Tree>
          <ui.TreeItem itemType="leaf" value="report">
            <ui.TreeItemLayout>Report</ui.TreeItemLayout>
          </ui.TreeItem>
          <ui.TreeItem itemType="leaf" value="notes">
            <ui.TreeItemLayout>Notes</ui.TreeItemLayout>
          </ui.TreeItem>
        </ui.Tree>
      </ui.TreeItem>
    </ui.Tree>
  );
}

export const CheckedListItems: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Select and clear rows. The open tree branch starts mixed. Compare the marker separately from the row's focus outline."
      examples={[
        {
          id: 'checked-list',
          label: 'List item selection',
          render: ui => (
            <ui.List aria-label="Documents" selectionMode="multiselect" defaultSelectedItems={['report', 'locked']}>
              <ui.ListItem value="report">Report</ui.ListItem>
              <ui.ListItem value="notes">Notes</ui.ListItem>
              <ui.ListItem value="locked" disabledSelection>
                Locked selection
              </ui.ListItem>
            </ui.List>
          ),
        },
        { id: 'checked-tree', label: 'Tree item selection', render: ui => <CheckedTree ui={ui} /> },
      ]}
    />
  ),
};

export const CheckboxAndOption: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Hover Apple (checked) and Pear (unchecked). The v9 option uses the row text color for its border. The preview uses Checkbox's hover and press colors. The options keep their own selection and keyboard focus."
      examples={[
        {
          id: 'checkboxes',
          label: 'Checkbox',
          render: ui => (
            <>
              <ui.Checkbox label="Apple" defaultChecked />
              <ui.Checkbox label="Pear" />
              <ui.Checkbox label="Plum" defaultChecked disabled />
              <ui.Checkbox label="Mixed fruit" defaultChecked="mixed" />
            </>
          ),
        },
        {
          id: 'multiselect-options',
          label: 'Multiselect listbox option',
          render: ui => (
            <ui.Listbox
              aria-label="Fruit"
              multiselect
              defaultSelectedOptions={['apple', 'plum']}
              disableAutoFocus
              popover={undefined}
            >
              <ui.Option value="apple">Apple</ui.Option>
              <ui.Option value="pear">Pear</ui.Option>
              <ui.Option value="plum" disabled>
                Plum
              </ui.Option>
            </ui.Listbox>
          ),
        },
      ]}
    />
  ),
};

const swatchImage = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="${V9.webLightTheme.colorBrandBackground}" d="M0 0h2v2H0z"/><path fill="${V9.webLightTheme.colorNeutralBackground1}" d="M0 0h1v1H0zm1 1h1v1H1z"/></svg>`,
)}`;
const swatchVariants = [
  { size: 'medium', shape: 'square' },
  { size: 'extra-small', shape: 'rounded' },
  { size: 'small', shape: 'circular' },
  { size: 'large', shape: 'rounded' },
] as const;

export const Swatches: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Select a color or image swatch. Use Tab and the arrow keys to compare focus and selection rings. The empty swatch is disabled in this fixture."
      examples={swatchVariants.map(({ size, shape }) => ({
        id: `swatches-${size}`,
        label: `${size}, ${shape}`,
        render: ui => (
          <ui.SwatchPicker
            aria-label={`${size} ${shape} swatches`}
            defaultSelectedValue="color"
            size={size}
            shape={shape}
          >
            <ui.ColorSwatch aria-label="Brand color" color={V9.webLightTheme.colorBrandBackground} value="color" />
            <ui.ImageSwatch aria-label="Checker image" src={swatchImage} value="image" />
            <ui.EmptySwatch aria-label="Empty swatch" disabled />
          </ui.SwatchPicker>
        ),
      }))}
    />
  ),
};

function DrawerComparison({ globals }: { globals: Globals }) {
  const bodies = React.useRef(new Map<string, HTMLDivElement>());
  const bodyRef = (id: string) => (node: HTMLDivElement | null) => {
    if (node) {
      bodies.current.set(id, node);
    } else {
      bodies.current.delete(id);
    }
  };
  const drawerSize: React.CSSProperties = {
    height: `calc(${tokens.spacingVerticalXXXL} * 5)`,
    width: '100%',
  };
  const items = Array.from({ length: 12 }, (_, index) => `Page ${index + 1}`);

  return (
    <Comparison
      globals={globals}
      instructions="Use the buttons to scroll all four bodies together, or scroll one by hand. The preview NavDrawer now uses the preview Drawer line color and fade. Stock NavDrawer is unchanged."
      examples={[
        {
          id: 'drawer',
          label: 'Inline Drawer',
          render: (ui, side) => (
            <ui.InlineDrawer open aria-label="Pages drawer" style={drawerSize}>
              <ui.DrawerHeader>Pages</ui.DrawerHeader>
              <ui.DrawerBody ref={bodyRef(`drawer-${side}`)} tabIndex={0} aria-label="Drawer pages">
                {items.map(item => (
                  <p key={item}>{item}</p>
                ))}
              </ui.DrawerBody>
              <ui.DrawerFooter>End of pages</ui.DrawerFooter>
            </ui.InlineDrawer>
          ),
        },
        {
          id: 'nav-drawer',
          label: 'Inline NavDrawer',
          render: (ui, side) => (
            <ui.NavDrawer type="inline" open aria-label="Pages navigation" style={drawerSize}>
              <ui.NavDrawerHeader>Pages</ui.NavDrawerHeader>
              <ui.NavDrawerBody ref={bodyRef(`nav-drawer-${side}`)} tabIndex={0} aria-label="Navigation pages">
                {items.map(item => (
                  <ui.NavItem key={item} value={item}>
                    {item}
                  </ui.NavItem>
                ))}
              </ui.NavDrawerBody>
              <ui.NavDrawerFooter>End of pages</ui.NavDrawerFooter>
            </ui.NavDrawer>
          ),
        },
      ]}
    >
      <div style={row}>
        {['Top', 'Middle', 'Bottom'].map((label, index) => (
          <Preview.Button
            key={label}
            onClick={() => {
              for (const body of bodies.current.values()) {
                body.scrollTop = ((body.scrollHeight - body.clientHeight) * index) / 2;
              }
            }}
          >
            Scroll to {label.toLowerCase()}
          </Preview.Button>
        ))}
      </div>
    </Comparison>
  );
}

export const DrawerScrollSeparators: StoryObj = { render: (_, { globals }) => <DrawerComparison globals={globals} /> };

const inputExamples: Example[] = [
  {
    id: 'input',
    label: 'Input and SearchBox',
    render: ui => (
      <>
        <ui.Input aria-label="Project name" placeholder="Enter a project name" />
        <ui.Input aria-label="Disabled project name" placeholder="Enter a project name" disabled />
        <ui.SearchBox aria-label="Search projects" placeholder="Search projects" />
      </>
    ),
  },
  {
    id: 'pickers',
    label: 'Combobox and TagPickerInput',
    render: ui => (
      <>
        <ui.Combobox aria-label="Choose a fruit" placeholder="Choose a fruit">
          <ui.Option>Apple</ui.Option>
          <ui.Option>Pear</ui.Option>
        </ui.Combobox>
        <ui.TagPicker>
          <ui.TagPickerControl>
            <ui.TagPickerInput aria-label="Add a fruit" placeholder="Add a fruit" />
          </ui.TagPickerControl>
          <ui.TagPickerList>
            <ui.TagPickerOption value="apple">Apple</ui.TagPickerOption>
            <ui.TagPickerOption value="pear">Pear</ui.TagPickerOption>
          </ui.TagPickerList>
        </ui.TagPicker>
      </>
    ),
  },
  {
    id: 'textarea-date-number',
    label: 'Textarea, editable DatePicker, and SpinButton',
    render: ui => (
      <>
        <ui.Textarea aria-label="Project notes" placeholder="Add notes" />
        <ui.DatePicker allowTextInput aria-label="Due date" placeholder="Enter a date" today={new Date(2026, 10, 13)} />
        <ui.SpinButton aria-label="Quantity" placeholder="Enter a quantity" defaultValue={null} />
      </>
    ),
  },
];

export const InputPlaceholders: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Compare the empty fields, then type to see the text color and focus treatment. Try the dark theme and RTL from the toolbar."
      examples={inputExamples}
    />
  ),
};
