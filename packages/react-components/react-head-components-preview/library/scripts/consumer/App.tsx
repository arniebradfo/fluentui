import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { polyfillBodyAndObserve } from '@microsoft/focusgroup-polyfill/shadowless';
import { canUseDOM } from '@fluentui/react-utilities';
import * as Catalog from './components/index';

const {
  Avatar,
  Button,
  Calendar,
  Checkbox,
  DatePicker,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  FluentProvider,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Nav,
  NavCategory,
  NavCategoryItem,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Rating,
  Select,
  Slider,
  Text,
  Tree,
  TreeItem,
  TreeItemLayout,
  tokens,
  webDarkTheme,
  webLightTheme,
} = Catalog;

polyfillBodyAndObserve();

function App() {
  const [submitted, setSubmitted] = React.useState('');
  const [selected, setSelected] = React.useState('');
  const layout: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
  };

  return (
    <FluentProvider theme={webLightTheme} style={layout} data-testid="light">
      <Text as="h1" size={600} weight="semibold">
        Fluent CSS Modules draft
      </Text>
      <Text data-testid="export-count">{Object.keys(Catalog).length} public runtime exports</Text>
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, alignItems: 'center' }}>
        <Button data-testid="default-button">Default button</Button>
        <Button className="consumerButton" data-testid="override-button">
          Consumer override
        </Button>
        <Avatar name="Ada Lovelace" size={16} data-testid="avatar16" />
      </div>
      <form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('name')));
        }}
        style={layout}
      >
        <Field label="Name" required>
          <Input name="name" defaultValue="Ada" />
        </Field>
        <Checkbox label="Mixed option" defaultChecked="mixed" />
        <Select aria-label="Native select" defaultValue="second">
          <option value="first">First</option>
          <option value="second">Second</option>
        </Select>
        <Button type="submit">Submit form</Button>
        <Text role="status" data-testid="submitted">
          {submitted}
        </Text>
      </form>
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton>Open action menu</MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => setSelected('Action selected')}>Run action</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Menu open={false}>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton appearance="primary" disabled data-testid="disabled-closed">
              Closed disabled
            </MenuButton>
          </MenuTrigger>
        </Menu>
        <Menu open>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton appearance="primary" disabled data-testid="disabled-open">
              Open disabled
            </MenuButton>
          </MenuTrigger>
        </Menu>
        <Popover>
          <PopoverTrigger disableButtonEnhancement>
            <Button>Open popover</Button>
          </PopoverTrigger>
          <PopoverSurface>Native popover content</PopoverSurface>
        </Popover>
        <Dialog>
          <DialogTrigger>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogHeader>
              <DialogTitle>Native dialog</DialogTitle>
            </DialogHeader>
            <DialogBody>Native dialog content</DialogBody>
            <DialogActions>
              <DialogTrigger action="close">
                <Button>Close dialog</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogSurface>
        </Dialog>
      </div>
      <Text data-testid="selected">{selected}</Text>
      <Field label="Invalid date" validationState="error" validationMessage="Choose a valid date">
        <DatePicker />
      </Field>
      <Calendar />
      <Slider aria-label="Amount" defaultValue={30} />
      <Rating aria-label="Rating" defaultValue={3} />
      <Tree aria-label="Files" selectionMode="multiselect">
        <TreeItem itemType="leaf" value="readme">
          <TreeItemLayout>Readme</TreeItemLayout>
        </TreeItem>
      </Tree>
      <Nav defaultSelectedValue="home" aria-label="Main navigation">
        <NavItem value="home">Home</NavItem>
        <NavCategory value="work">
          <NavCategoryItem>Work</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="projects">Projects</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>
      <FluentProvider theme={webDarkTheme} dir="rtl" data-testid="dark" style={layout}>
        <Button appearance="primary">Dark RTL button</Button>
        <Field label="Dark input">
          <Input />
        </Field>
        <Checkbox label="Dark checkbox" defaultChecked />
      </FluentProvider>
    </FluentProvider>
  );
}

const host = canUseDOM() ? globalThis.document.getElementById('root') : null;
if (!host) {
  throw new Error('The consumer fixture requires a root element.');
}
createRoot(host).render(<App />);
