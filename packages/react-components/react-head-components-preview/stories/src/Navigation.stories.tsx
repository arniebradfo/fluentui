import * as React from 'react';
import {
  Button,
  Nav,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
  Text,
  tokens,
} from '../../library/src';
import type { NavItemValue } from '../../library/src';

export default {
  title: 'CSS Modules/Navigation',
  parameters: {
    docs: {
      description: {
        component:
          'Local examples for the new Nav API. They cover controlled selection, category expansion and native inline/overlay NavDrawer composition. No unsupported specialized Nav exports are substituted.',
      },
    },
  },
};

function NavigationItems() {
  return (
    <>
      <NavSectionHeader>Workspace</NavSectionHeader>
      <NavItem value="home">Home</NavItem>
      <NavCategory value="projects">
        <NavCategoryItem>Projects</NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value="active">Active projects</NavSubItem>
          <NavSubItem value="archived">Archived projects</NavSubItem>
          <NavSubItem value="restricted" disabled>
            Restricted projects
          </NavSubItem>
        </NavSubItemGroup>
      </NavCategory>
      <NavDivider />
      <NavItem value="settings">Settings</NavItem>
    </>
  );
}

export const SelectionAndCategories = () => {
  const [selectedValue, setSelectedValue] = React.useState<NavItemValue>('home');
  const [selectedCategoryValue, setSelectedCategoryValue] = React.useState<NavItemValue | undefined>();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL }}>
      <Nav
        aria-label="Workspace"
        selectedValue={selectedValue}
        selectedCategoryValue={selectedCategoryValue}
        defaultOpenCategories={['projects']}
        onNavItemSelect={(_, data) => {
          setSelectedValue(data.value);
          setSelectedCategoryValue(data.categoryValue);
        }}
      >
        <NavigationItems />
      </Nav>
      <Text role="status">Selected: {selectedValue}</Text>
    </div>
  );
};

export const InlineNavigationDrawer = () => (
  <NavDrawer
    type="inline"
    open
    aria-label="Inline workspace navigation"
    defaultSelectedValue="home"
    style={{ minBlockSize: `calc(${tokens.spacingVerticalXXXL} * 10)` }}
  >
    <NavDrawerHeader>
      <Text as="h2" size={500} weight="semibold">
        Workspace
      </Text>
    </NavDrawerHeader>
    <NavDrawerBody>
      <NavigationItems />
    </NavDrawerBody>
    <NavDrawerFooter>
      <Text size={200}>Signed in as Ada Lovelace</Text>
    </NavDrawerFooter>
  </NavDrawer>
);

export const OverlayNavigationDrawer = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open navigation</Button>
      <NavDrawer
        type="overlay"
        open={open}
        aria-label="Workspace navigation"
        defaultSelectedValue="home"
        onOpenChange={(_, data) => setOpen(data.open)}
      >
        <NavDrawerHeader>
          <Button onClick={() => setOpen(false)}>Close navigation</Button>
        </NavDrawerHeader>
        <NavDrawerBody>
          <NavigationItems />
        </NavDrawerBody>
        <NavDrawerFooter>
          <Text size={200}>Signed in as Ada Lovelace</Text>
        </NavDrawerFooter>
      </NavDrawer>
    </>
  );
};
