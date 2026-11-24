import * as React from 'react';
import type { StoryContext, StoryObj } from '@storybook/react';
import * as V9 from '@fluentui/react-components';
import { Calendar as V9Calendar } from '@fluentui/react-calendar-compat';
import { DatePicker as V9DatePicker } from '@fluentui/react-datepicker-compat';
import { bundleIcon, Home20Filled, Home20Regular } from '@fluentui/react-icons';
import { RangeSlider as V9RangeSlider } from '@fluentui/react-range-slider-preview';
import * as Preview from '../../library/src';

export default { title: 'CSS Modules/Primitive comparisons', parameters: { layout: 'fullscreen' } };

const { tokens } = Preview;
const stock = { ...V9, Calendar: V9Calendar, DatePicker: V9DatePicker, RangeSlider: V9RangeSlider };
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

const fruit = ['Apple', 'Pear'];
const fruitOptions = (ui: UI) => fruit.map(name => <ui.Option key={name}>{name}</ui.Option>);
const inputAppearances = ['outline', 'underline', 'filled-lighter', 'filled-darker'] as const;
const inputSizes = ['small', 'medium', 'large'] as const;
const fullWidth = { inlineSize: '100%' };

export const InputAppearances: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Tab to a field, then move the pointer over it without blurring it. Compare the bottom border separately from the animated underline. Try dark mode and RTL."
      examples={[
        ...inputAppearances.map(appearance => ({
          id: `appearance-${appearance}`,
          label: appearance,
          render: (ui: UI) => (
            <>
              <ui.Input appearance={appearance} aria-label="Input" placeholder="Input" />
              <ui.Combobox appearance={appearance} aria-label="Combobox" placeholder="Combobox">
                {fruitOptions(ui)}
              </ui.Combobox>
              <ui.Dropdown appearance={appearance} aria-label="Dropdown" placeholder="Dropdown">
                {fruitOptions(ui)}
              </ui.Dropdown>
              <ui.Select appearance={appearance} aria-label="Select">
                <option>Native Select</option>
                <option>Other value</option>
              </ui.Select>
              {appearance !== 'underline' && (
                <ui.Textarea appearance={appearance} aria-label="Textarea" placeholder="Textarea" resize="both" />
              )}
            </>
          ),
        })),
        {
          id: 'appearance-states',
          label: 'Disabled and invalid',
          render: ui => (
            <>
              <ui.Input disabled appearance="filled-darker" aria-label="Disabled input" placeholder="Disabled input" />
              <ui.Select disabled appearance="underline" aria-label="Disabled select">
                <option>Disabled select</option>
              </ui.Select>
              <ui.Combobox aria-invalid aria-label="Invalid combobox" placeholder="Invalid combobox">
                {fruitOptions(ui)}
              </ui.Combobox>
            </>
          ),
        },
      ]}
    />
  ),
};

function TagPickerActionExample({ ui, size }: { ui: UI; size: 'medium' | 'large' | 'extra-large' }) {
  const [selected, setSelected] = React.useState<string[]>(['Apple']);
  return (
    <ui.TagPicker
      size={size}
      selectedOptions={selected}
      onOptionSelect={(_, data) => setSelected(data.selectedOptions)}
    >
      <ui.TagPickerControl>
        <ui.TagPickerGroup aria-label="Selected fruit">
          {selected.map(value => (
            <ui.Tag key={value} value={value} dismissible>
              {value}
            </ui.Tag>
          ))}
        </ui.TagPickerGroup>
        <ui.TagPickerButton aria-label={`Choose fruit (${size})`} />
      </ui.TagPickerControl>
      <ui.TagPickerList>
        {fruit
          .filter(value => !selected.includes(value))
          .map(value => (
            <ui.TagPickerOption key={value} value={value}>
              {value}
            </ui.TagPickerOption>
          ))}
      </ui.TagPickerList>
    </ui.TagPicker>
  );
}

export const InputSizesAndActions: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Compare heights, glyph sizes, and the space at the end of each control. Clear Apple to switch back to the chevron. Open the tag pickers with the keyboard as well as by clicking the chevron."
      examples={[
        ...inputSizes.map(size => ({
          id: `input-size-${size}`,
          label: `Single-line inputs: ${size}`,
          render: (ui: UI) => (
            <>
              <ui.Input size={size} aria-label="Input" placeholder="Input" />
              <ui.Select size={size} aria-label="Select">
                <option>Native Select</option>
              </ui.Select>
              <ui.Combobox
                size={size}
                clearable
                aria-label="Combobox"
                defaultValue="Apple"
                defaultSelectedOptions={['Apple']}
              >
                {fruitOptions(ui)}
              </ui.Combobox>
              <ui.Dropdown
                size={size}
                clearable
                aria-label="Dropdown"
                defaultValue="Apple"
                defaultSelectedOptions={['Apple']}
              >
                {fruitOptions(ui)}
              </ui.Dropdown>
            </>
          ),
        })),
        {
          id: 'tag-picker-sizes',
          label: 'TagPicker: medium, large, extra-large',
          render: ui => (
            <>
              <TagPickerActionExample ui={ui} size="medium" />
              <TagPickerActionExample ui={ui} size="large" />
              <TagPickerActionExample ui={ui} size="extra-large" />
            </>
          ),
        },
      ]}
    />
  ),
};

const HomeGlyph = bundleIcon(Home20Filled, Home20Regular);
const buttonAppearances = ['secondary', 'primary', 'outline', 'subtle', 'transparent'] as const;

export const SelectedButtons: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Compare the checked toggle with a menu button while its menu is open. Move the pointer off the button to see its resting fill. Test keyboard focus separately, including the accessible toggle."
      examples={[
        ...buttonAppearances.map(appearance => ({
          id: `button-${appearance}`,
          label: appearance,
          render: (ui: UI) => (
            <div style={row}>
              <ui.ToggleButton appearance={appearance} defaultChecked icon={<HomeGlyph />}>
                Pin
              </ui.ToggleButton>
              <ui.Menu>
                <ui.MenuTrigger disableButtonEnhancement>
                  <ui.MenuButton appearance={appearance} icon={<HomeGlyph />}>
                    Actions
                  </ui.MenuButton>
                </ui.MenuTrigger>
                <ui.MenuPopover>
                  <ui.MenuList>
                    <ui.MenuItem>Unpin</ui.MenuItem>
                  </ui.MenuList>
                </ui.MenuPopover>
              </ui.Menu>
            </div>
          ),
        })),
        {
          id: 'button-exceptions',
          label: 'Accessible checked and disabled',
          render: ui => (
            <>
              <ui.ToggleButton appearance="primary" isAccessible defaultChecked>
                Accessible checked
              </ui.ToggleButton>
              <ui.ToggleButton appearance="outline" disabled defaultChecked>
                Disabled checked
              </ui.ToggleButton>
            </>
          ),
        },
      ]}
    />
  ),
};

export const ChoiceRows: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Compare row spacing, label type, divider lines, and the icon lanes. Hover and press each row, then use the arrow keys to see the different menu and listbox focus models."
      examples={[
        {
          id: 'menu-rows',
          label: 'Menu',
          render: ui => (
            <ui.MenuList aria-label="Places" style={fullWidth}>
              <ui.MenuGroup>
                <ui.MenuGroupHeader>Personal</ui.MenuGroupHeader>
                <ui.MenuItem icon={<HomeGlyph />}>Home</ui.MenuItem>
                <ui.MenuItem disabled>Archive</ui.MenuItem>
              </ui.MenuGroup>
              <ui.MenuDivider />
              <ui.MenuGroup>
                <ui.MenuGroupHeader>Shared</ui.MenuGroupHeader>
                <ui.MenuItem>Library</ui.MenuItem>
              </ui.MenuGroup>
            </ui.MenuList>
          ),
        },
        {
          id: 'option-rows',
          label: 'Listbox',
          render: (ui, side) => (
            <ui.Listbox {...(side === 'candidate' ? { popover: undefined } : {})} aria-label="Places" style={fullWidth}>
              <ui.OptionGroup label="Personal">
                <ui.Option>Home</ui.Option>
                <ui.Option disabled>Archive</ui.Option>
              </ui.OptionGroup>
              <ui.OptionGroup label="Shared">
                <ui.Option>Library</ui.Option>
              </ui.OptionGroup>
            </ui.Listbox>
          ),
        },
      ]}
    />
  ),
};

export const NavigationDetails: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Select items and expand the branches. Compare the bundled glyphs, rails, and focus outlines. Switch to RTL to see where chevrons point. Motion follows your system setting."
      examples={[
        {
          id: 'nav-details',
          label: 'Nav: selected glyph, rail, and category chevron',
          render: ui => (
            <ui.Nav aria-label="Places" defaultSelectedValue="home" style={fullWidth}>
              <ui.NavItem value="home" icon={<HomeGlyph />}>
                Home
              </ui.NavItem>
              <ui.NavItem value="other" icon={<HomeGlyph filled />}>
                Other
              </ui.NavItem>
              <ui.NavCategory value="projects">
                <ui.NavCategoryItem>Projects</ui.NavCategoryItem>
                <ui.NavSubItemGroup>
                  <ui.NavSubItem value="north">North</ui.NavSubItem>
                </ui.NavSubItemGroup>
              </ui.NavCategory>
            </ui.Nav>
          ),
        },
        {
          id: 'tab-details',
          label: 'Tab: selected glyph and horizontal or vertical rail',
          render: ui => (
            <>
              <ui.TabList defaultSelectedValue="home" aria-label="Horizontal tabs">
                <ui.Tab value="home" icon={<HomeGlyph />}>
                  Home
                </ui.Tab>
                <ui.Tab value="other" icon={<HomeGlyph filled />}>
                  Other
                </ui.Tab>
              </ui.TabList>
              <ui.TabList vertical defaultSelectedValue="home" aria-label="Vertical tabs">
                <ui.Tab value="home" icon={<HomeGlyph />}>
                  Home
                </ui.Tab>
                <ui.Tab value="other" icon={<HomeGlyph />}>
                  Other
                </ui.Tab>
              </ui.TabList>
            </>
          ),
        },
        {
          id: 'disclosure-details',
          label: 'Accordion and Tree: start and end chevrons',
          render: ui => (
            <>
              <ui.Accordion multiple collapsible style={fullWidth}>
                <ui.AccordionItem value="start">
                  <ui.AccordionHeader>Start chevron</ui.AccordionHeader>
                  <ui.AccordionPanel>Start panel</ui.AccordionPanel>
                </ui.AccordionItem>
                <ui.AccordionItem value="end">
                  <ui.AccordionHeader expandIconPosition="end">End chevron</ui.AccordionHeader>
                  <ui.AccordionPanel>End panel</ui.AccordionPanel>
                </ui.AccordionItem>
              </ui.Accordion>
              <ui.Tree aria-label="Files">
                <ui.TreeItem itemType="branch">
                  <ui.TreeItemLayout>Folder</ui.TreeItemLayout>
                  <ui.Tree>
                    <ui.TreeItem itemType="leaf">
                      <ui.TreeItemLayout>Notes</ui.TreeItemLayout>
                    </ui.TreeItem>
                  </ui.Tree>
                </ui.TreeItem>
              </ui.Tree>
            </>
          ),
        },
      ]}
    />
  ),
};

const comparisonDate = new Date(2026, 10, 13);
const formatLongDate = () => 'Friday, November 13, 2026';
export const FocusAndClippedContent: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Tab through the Calendar buttons and selectable card. The Calendar announcement and card checkbox are not drawn at full size. The narrow DatePicker compares the compat input with the preview's button text."
      examples={[
        {
          id: 'calendar-details',
          label: 'Calendar keyboard focus',
          render: (_, side) =>
            side === 'stock' ? (
              <V9Calendar today={comparisonDate} value={comparisonDate} showGoToToday />
            ) : (
              <Preview.Calendar today={comparisonDate} value={comparisonDate} layout="sideBySide" />
            ),
        },
        {
          id: 'card-details',
          label: 'Selectable card',
          render: ui => (
            <ui.Card defaultSelected={false} aria-label="Project card">
              Project notes
            </ui.Card>
          ),
        },
        {
          id: 'truncated-date',
          label: 'Constrained DatePicker value',
          render: ui => (
            <div style={{ inlineSize: `calc(${tokens.spacingHorizontalXXXL} * 4)` }}>
              <ui.DatePicker
                aria-label="Due date"
                today={comparisonDate}
                value={comparisonDate}
                formatDate={formatLongDate}
              />
            </div>
          ),
        },
        {
          id: 'truncated-text',
          label: 'Text: truncation with and without wrapping',
          render: ui => (
            <div style={{ inlineSize: `calc(${tokens.spacingHorizontalXXXL} * 4)` }}>
              <ui.Text block truncate wrap={false}>
                A long project title that does not wrap
              </ui.Text>
              <ui.Text block truncate>
                A long project title that can still wrap
              </ui.Text>
            </div>
          ),
        },
      ]}
    />
  ),
};

const intents = ['info', 'success', 'warning', 'error'] as const;

function IntentToasts({ ui, side }: { ui: UI; side: 'stock' | 'candidate' }) {
  const toasterId = `intent-toasts-${side}`;
  const { dispatchToast, dismissAllToasts } = V9.useToastController(toasterId);
  return (
    <>
      <ui.Button
        onClick={() => {
          for (const intent of intents) {
            dispatchToast(
              <ui.Toast>
                <ui.ToastTitle>{intent}</ui.ToastTitle>
              </ui.Toast>,
              { intent, toastId: `${toasterId}-${intent}`, timeout: -1 },
            );
          }
        }}
      >
        Show four toasts
      </ui.Button>
      <ui.Button onClick={dismissAllToasts}>Dismiss toasts</ui.Button>
      <ui.Toaster inline toasterId={toasterId} />
    </>
  );
}

export const FeedbackDetails: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Show the toasts in both columns. Compare the glyph shapes, not just their colors. Use your system's reduced-motion setting to compare how each loading indicator changes."
      examples={[
        {
          id: 'status-bars',
          label: 'MessageBar',
          render: ui =>
            intents.map(intent => (
              <ui.MessageBar key={intent} intent={intent}>
                <ui.MessageBarBody>{intent}</ui.MessageBarBody>
              </ui.MessageBar>
            )),
        },
        {
          id: 'status-toasts',
          label: 'Toast',
          render: (ui, side) => <IntentToasts ui={ui} side={side} />,
        },
        {
          id: 'status-motion',
          label: 'Skeleton, ProgressBar, and Spinner keep separate motion',
          render: ui => (
            <div style={{ ...stack, width: '100%' }}>
              <ui.Skeleton aria-label="Loading items" style={fullWidth}>
                <ui.SkeletonItem />
              </ui.Skeleton>
              <ui.ProgressBar aria-label="Importing files" />
              <ui.Spinner label="Syncing files" />
            </div>
          ),
        },
      ]}
    />
  ),
};

export const JoinedAndCompactControls: StoryObj = {
  render: (_, { globals }) => (
    <Comparison
      globals={globals}
      instructions="Tab across the joined actions and try RTL. Compare the seam while hovering each half. Open the two overlays to compare their small controls. These examples keep their styles separate."
      examples={[
        {
          id: 'joined-split-button',
          label: 'SplitButton: primary button draws the seam',
          render: ui => (
            <ui.Menu>
              <ui.MenuTrigger disableButtonEnhancement>
                {menuButton => (
                  <ui.SplitButton appearance="primary" menuButton={menuButton}>
                    Send
                  </ui.SplitButton>
                )}
              </ui.MenuTrigger>
              <ui.MenuPopover>
                <ui.MenuList>
                  <ui.MenuItem>Send tomorrow</ui.MenuItem>
                </ui.MenuList>
              </ui.MenuPopover>
            </ui.Menu>
          ),
        },
        {
          id: 'joined-tag',
          label: 'InteractionTag: secondary button draws the seam',
          render: ui => (
            <ui.InteractionTag shape="circular" appearance="outline">
              <ui.InteractionTagPrimary hasSecondaryAction>Project</ui.InteractionTagPrimary>
              <ui.InteractionTagSecondary aria-label="Remove Project" />
            </ui.InteractionTag>
          ),
        },
        {
          id: 'compact-actions',
          label: 'InfoButton trigger and TeachingPopover dismiss action',
          render: ui => (
            <div style={row}>
              <ui.InfoButton aria-label="Project info" info="Project information" />
              <ui.TeachingPopover>
                <ui.TeachingPopoverTrigger>
                  <ui.Button>Open tip</ui.Button>
                </ui.TeachingPopoverTrigger>
                <ui.TeachingPopoverSurface aria-label="Project tip">
                  <ui.TeachingPopoverHeader dismissButton={{ 'aria-label': 'Dismiss tip' }}>
                    Tips
                  </ui.TeachingPopoverHeader>
                  <ui.TeachingPopoverBody>
                    <ui.TeachingPopoverTitle>Project tip</ui.TeachingPopoverTitle>
                    Review milestones before you start.
                  </ui.TeachingPopoverBody>
                </ui.TeachingPopoverSurface>
              </ui.TeachingPopover>
            </div>
          ),
        },
      ]}
    />
  ),
};
