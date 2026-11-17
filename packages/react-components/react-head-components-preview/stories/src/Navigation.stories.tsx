import * as React from 'react';
import {
  Button as StockButton,
  FluentProvider as StockProvider,
  Nav as StockNav,
  NavCategory as StockNavCategory,
  NavCategoryItem as StockNavCategoryItem,
  NavDivider as StockNavDivider,
  NavDrawer as StockNavDrawer,
  NavDrawerBody as StockNavDrawerBody,
  NavDrawerFooter as StockNavDrawerFooter,
  NavDrawerHeader as StockNavDrawerHeader,
  NavItem as StockNavItem,
  NavSubItem as StockNavSubItem,
  NavSubItemGroup as StockNavSubItemGroup,
} from '@fluentui/react-components';
import { bundleIcon, Home20Filled, Home20Regular } from '@fluentui/react-icons';
import {
  Button,
  FluentProvider,
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
  webLightTheme,
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

const NavigationGlyph = bundleIcon(Home20Filled, Home20Regular);
const regressionLayout: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacingVerticalL,
  fontWeight: tokens.fontWeightSemibold,
};
const regressionDrawer: React.CSSProperties = {
  height: `calc(${tokens.spacingVerticalXXXL} * 6)`,
};

export const StockStyleRegressions = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: tokens.spacingHorizontalXXL,
    }}
  >
    <StockProvider theme={webLightTheme} style={regressionLayout} data-testid="stock-navigation">
      <StockNav aria-label="Icon switching" defaultSelectedValue="other">
        <StockNavItem value="home" icon={<NavigationGlyph filled />}>
          Icon target
        </StockNavItem>
        <StockNavItem value="other">Other item</StockNavItem>
        <StockNavCategory value="category">
          <StockNavCategoryItem icon={<NavigationGlyph />}>Icon category</StockNavCategoryItem>
          <StockNavSubItemGroup>
            <StockNavSubItem value="nested">Nested item</StockNavSubItem>
          </StockNavSubItemGroup>
        </StockNavCategory>
        <StockNavDivider>Section</StockNavDivider>
        <StockNavDivider />
      </StockNav>
      <StockNavDrawer type="inline" open style={regressionDrawer} data-testid="body-only">
        <StockNavDrawerBody>
          <StockNavItem value="only">Body only</StockNavItem>
        </StockNavDrawerBody>
      </StockNavDrawer>
      <StockNavDrawer type="inline" open style={regressionDrawer} data-testid="header-body">
        <StockNavDrawerHeader>Header</StockNavDrawerHeader>
        <StockNavDrawerBody>
          <StockNavItem value="last">Body after header</StockNavItem>
        </StockNavDrawerBody>
      </StockNavDrawer>
      <StockNavDrawer type="inline" open style={regressionDrawer} data-testid="body-footer">
        <StockNavDrawerBody>
          <StockNavItem value="first">Body before footer</StockNavItem>
        </StockNavDrawerBody>
        <StockNavDrawerFooter>
          <StockButton>Footer action</StockButton>
          <StockNavItem value="footer">Full-width footer item</StockNavItem>
        </StockNavDrawerFooter>
      </StockNavDrawer>
    </StockProvider>
    <FluentProvider theme={webLightTheme} style={regressionLayout} data-testid="candidate-navigation">
      <Nav aria-label="Icon switching" defaultSelectedValue="other">
        <NavItem value="home" icon={<NavigationGlyph filled />}>
          Icon target
        </NavItem>
        <NavItem value="other">Other item</NavItem>
        <NavCategory value="category">
          <NavCategoryItem icon={<NavigationGlyph />}>Icon category</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="nested">Nested item</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavDivider>Section</NavDivider>
        <NavDivider />
      </Nav>
      <NavDrawer type="inline" open style={regressionDrawer} data-testid="body-only">
        <NavDrawerBody>
          <NavItem value="only">Body only</NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <NavDrawer type="inline" open style={regressionDrawer} data-testid="header-body">
        <NavDrawerHeader>Header</NavDrawerHeader>
        <NavDrawerBody>
          <NavItem value="last">Body after header</NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <NavDrawer type="inline" open style={regressionDrawer} data-testid="body-footer">
        <NavDrawerBody>
          <NavItem value="first">Body before footer</NavItem>
        </NavDrawerBody>
        <NavDrawerFooter>
          <Button>Footer action</Button>
          <NavItem value="footer">Full-width footer item</NavItem>
        </NavDrawerFooter>
      </NavDrawer>
    </FluentProvider>
  </div>
);
