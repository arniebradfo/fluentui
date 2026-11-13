import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import {
  Nav,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  NavDivider,
  NavSectionHeader,
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavDrawerFooter,
} from './Nav';

describe('styled Nav', () => {
  it('keeps native roots, refs, default selection and item callbacks', () => {
    const navRef = React.createRef<HTMLDivElement>();
    const itemRef = React.createRef<HTMLAnchorElement>();
    const onNavItemSelect = jest.fn();
    const { getByRole } = render(
      <Nav ref={navRef} defaultSelectedValue="home" onNavItemSelect={onNavItemSelect} className="user-nav">
        <NavItem value="home">Home</NavItem>
        <NavItem
          ref={itemRef}
          value="projects"
          href="#projects"
          className="user-item"
          style={{ opacity: 0.8 }}
          icon={{ children: 'P', className: 'user-icon' }}
        >
          Projects
        </NavItem>
      </Nav>,
    );
    const home = getByRole('button', { name: 'Home' });
    const projects = getByRole('link');

    expect(navRef.current).toBe(getByRole('navigation'));
    expect(navRef.current).toHaveClass('Nav', 'user-nav');
    expect(home).toHaveAttribute('data-selected');
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(itemRef.current).toBe(projects);
    expect(projects).toHaveClass('NavItem', 'user-item');
    expect(projects).toHaveStyle({ opacity: '0.8' });
    expect(projects.querySelector('.NavItem__icon')).toHaveClass('user-icon');

    fireEvent.click(projects);
    expect(onNavItemSelect).toHaveBeenCalledTimes(1);
    expect(onNavItemSelect.mock.calls[0][1]).toEqual(expect.objectContaining({ value: 'projects' }));
    expect(projects).toHaveAttribute('data-selected');
    expect(home).not.toHaveAttribute('data-selected');
  });

  it('styles the default expand glyph and preserves category selection and open callbacks', () => {
    const categoryRef = React.createRef<HTMLButtonElement>();
    const subItemRef = React.createRef<HTMLButtonElement>();
    const groupRef = React.createRef<HTMLDivElement>();
    const onNavItemSelect = jest.fn();
    const onNavCategoryItemToggle = jest.fn();
    const { getByRole, queryByRole } = render(
      <Nav
        defaultSelectedCategoryValue="projects"
        defaultSelectedValue="recent"
        onNavItemSelect={onNavItemSelect}
        onNavCategoryItemToggle={onNavCategoryItemToggle}
      >
        <NavCategory value="projects">
          <NavCategoryItem ref={categoryRef}>Projects</NavCategoryItem>
          <NavSubItemGroup ref={groupRef} aria-label="Project items">
            <NavSubItem ref={subItemRef} value="recent">
              Recent
            </NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );
    const category = getByRole('button', { name: 'Projects' });
    expect(categoryRef.current).toBe(category);
    expect(category).toHaveClass('NavCategoryItem');
    expect(category).toHaveAttribute('data-selected');
    expect(category).not.toHaveAttribute('data-expanded');
    expect(category.querySelector('.NavCategoryItem__expandIcon')).toHaveAttribute('aria-hidden', 'true');
    expect(category.querySelector('svg')).toHaveClass('NavCategoryItem__glyph');
    expect(queryByRole('group')).toBeNull();

    fireEvent.click(category);
    expect(category).toHaveAttribute('aria-expanded', 'true');
    expect(category).toHaveAttribute('data-expanded');
    expect(category).not.toHaveAttribute('data-selected');
    expect(onNavCategoryItemToggle).toHaveBeenCalledTimes(1);
    expect(onNavCategoryItemToggle.mock.calls[0][1]).toEqual(expect.objectContaining({ categoryValue: 'projects' }));
    expect(onNavCategoryItemToggle.mock.calls[0][1]).not.toHaveProperty('value');
    expect(onNavItemSelect).not.toHaveBeenCalled();
    expect(groupRef.current).toBe(getByRole('group', { name: 'Project items' }));
    expect(groupRef.current).toHaveClass('NavSubItemGroup');
    expect(subItemRef.current).toBe(getByRole('button', { name: 'Recent' }));
    expect(subItemRef.current).toHaveClass('NavSubItem');
    expect(subItemRef.current).toHaveAttribute('data-selected');

    fireEvent.click(getByRole('button', { name: 'Recent' }));
    expect(onNavItemSelect.mock.calls[0][1]).toEqual(
      expect.objectContaining({ value: 'recent', categoryValue: 'projects' }),
    );
    fireEvent.click(category);
    expect(category).toHaveAttribute('data-selected');
    expect(queryByRole('group')).toBeNull();
  });

  it('honors controlled expansion, default-open categories and explicit null or custom glyphs', () => {
    const renderExpandIcon: SlotRenderFunction<React.ComponentPropsWithRef<'span'>> = (Icon, props) => (
      <Icon {...props} data-testid="custom-expand">
        +
      </Icon>
    );
    const content = (
      <>
        <NavCategory value="first">
          <NavCategoryItem expandIcon={null}>First</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="one">One</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavCategory value="second">
          <NavCategoryItem
            expandIcon={{
              className: 'user-expand',
              children: renderExpandIcon,
            }}
          >
            Second
          </NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="two">Two</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </>
    );
    const onToggle = jest.fn();
    const { getByRole, queryByRole, getByTestId, rerender } = render(
      <Nav multiple={false} defaultOpenCategories={['first']}>
        {content}
      </Nav>,
    );
    expect(getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'First' }).querySelector('svg')).toBeNull();
    expect(getByTestId('custom-expand')).toHaveClass('NavCategoryItem__expandIcon', 'user-expand');
    fireEvent.click(getByRole('button', { name: 'Second' }));
    expect(queryByRole('button', { name: 'One' })).toBeNull();
    expect(getByRole('button', { name: 'Two' })).toBeInTheDocument();

    rerender(
      <Nav key="controlled" openCategories={[]} onNavCategoryItemToggle={onToggle}>
        {content}
      </Nav>,
    );
    fireEvent.click(getByRole('button', { name: 'Second' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(queryByRole('button', { name: 'Two' })).toBeNull();
  });

  it('keeps heading, divider content, slot renderers and disabled native controls', () => {
    const renderIcon: SlotRenderFunction<React.ComponentPropsWithRef<'span'>> = (Icon, props) => (
      <Icon {...props} data-testid="custom-icon" />
    );
    const headingRef = React.createRef<HTMLHeadingElement>();
    const dividerRef = React.createRef<HTMLDivElement>();
    const onSelect = jest.fn();
    const { getByRole, getByTestId } = render(
      <Nav onNavItemSelect={onSelect}>
        <NavSectionHeader as="h2" ref={headingRef}>
          Workspace
        </NavSectionHeader>
        <NavDivider ref={dividerRef} wrapper={{ className: 'user-divider-content' }}>
          More
        </NavDivider>
        <NavItem
          value="disabled"
          disabled
          icon={{
            children: renderIcon,
          }}
        >
          Disabled
        </NavItem>
      </Nav>,
    );
    expect(headingRef.current).toBe(getByRole('heading', { name: 'Workspace', level: 2 }));
    expect(headingRef.current).toHaveClass('NavSectionHeader');
    expect(dividerRef.current).toBe(getByRole('separator'));
    expect(dividerRef.current).toHaveClass('NavDivider');
    expect(dividerRef.current?.querySelector('.NavDivider__wrapper')).toHaveClass('user-divider-content');
    expect(dividerRef.current).toHaveTextContent('More');
    expect(getByTestId('custom-icon')).toHaveClass('NavItem__icon');
    expect(getByRole('button', { name: 'Disabled' })).toHaveAttribute('data-disabled');
    fireEvent.click(getByRole('button', { name: 'Disabled' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('styles native inline drawer members, forwards refs and retains drawer selection', () => {
    const drawerRef = React.createRef<HTMLDivElement>();
    const headerRef = React.createRef<HTMLDivElement>();
    const bodyRef = React.createRef<HTMLDivElement>();
    const footerRef = React.createRef<HTMLDivElement>();
    const onSelect = jest.fn();
    const { getByRole, getByText, rerender } = render(
      <NavDrawer
        type="inline"
        open
        ref={drawerRef}
        defaultSelectedValue="home"
        onNavItemSelect={onSelect}
        className="user-drawer"
        style={{ opacity: 0.8 }}
      >
        <NavDrawerHeader ref={headerRef}>Header</NavDrawerHeader>
        <NavDrawerBody ref={bodyRef}>
          <NavItem value="home">Home</NavItem>
          <NavItem value="settings">Settings</NavItem>
        </NavDrawerBody>
        <NavDrawerFooter ref={footerRef}>Footer</NavDrawerFooter>
      </NavDrawer>,
    );
    expect(drawerRef.current).toHaveClass('NavDrawer', 'user-drawer');
    expect(drawerRef.current).toHaveAttribute('data-type', 'inline');
    expect(drawerRef.current).toHaveStyle({ opacity: '0.8' });
    expect(headerRef.current).toBe(getByText('Header'));
    expect(headerRef.current).toHaveClass('NavDrawerHeader');
    expect(bodyRef.current).toBe(getByRole('navigation'));
    expect(bodyRef.current).toHaveClass('NavDrawerBody');
    expect(footerRef.current).toBe(getByText('Footer'));
    expect(footerRef.current).toHaveClass('NavDrawerFooter');
    expect(getByRole('button', { name: 'Home' })).toHaveAttribute('data-selected');
    fireEvent.click(getByRole('button', { name: 'Settings' }));
    expect(onSelect.mock.calls[0][1]).toEqual(expect.objectContaining({ value: 'settings' }));

    rerender(<NavDrawer type="inline" open={false} />);
    expect(drawerRef.current).toBeNull();
  });

  it('keeps the native overlay dialog, root ref and close callback', () => {
    const ref = React.createRef<HTMLDialogElement>();
    const onOpenChange = jest.fn();
    const { getByRole } = render(
      <NavDrawer ref={ref} open onOpenChange={onOpenChange} aria-label="Navigation">
        <NavDrawerBody>
          <NavItem value="home">Home</NavItem>
        </NavDrawerBody>
      </NavDrawer>,
    );
    const dialog = getByRole('dialog', { name: 'Navigation' });
    expect(ref.current).toBe(dialog);
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog).toHaveClass('NavDrawer');
    expect(dialog).toHaveAttribute('data-type', 'overlay');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    const cancelEvent = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancelEvent);
    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][1]).toEqual(expect.objectContaining({ open: false }));
  });

  it('retains non-modal drawer popover behavior without requiring a dialog open attribute', () => {
    const ref = React.createRef<HTMLDialogElement>();
    const onOpenChange = jest.fn();
    const { container } = render(
      <NavDrawer ref={ref} open modalType="non-modal" onOpenChange={onOpenChange}>
        <NavDrawerBody>
          <NavItem value="home">Home</NavItem>
        </NavDrawerBody>
      </NavDrawer>,
    );
    const dialog = container.querySelector('dialog');
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('NavDrawer');
    expect(dialog).toHaveAttribute('popover', 'manual');
    expect(dialog).not.toHaveAttribute('open');
    if (!dialog) {
      throw new Error('Expected the native non-modal drawer surface');
    }
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onOpenChange.mock.calls[0][1]).toEqual(expect.objectContaining({ open: false }));
  });
});
