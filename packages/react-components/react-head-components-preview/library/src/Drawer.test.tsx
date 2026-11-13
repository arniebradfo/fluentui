import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from './Dialog';
import { DialogSurface } from './DialogSurface';
import { Drawer } from './Drawer';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';
import { DrawerHeader } from './DrawerHeader';
import { DrawerHeaderNavigation } from './DrawerHeaderNavigation';
import { DrawerHeaderTitle } from './DrawerHeaderTitle';
import { OverlayDrawer } from './OverlayDrawer';

describe('styled native Drawer', () => {
  it('keeps inline composition, heading slot refs and caller styling', () => {
    const drawerRef = React.createRef<HTMLElement>();
    const headingRef = React.createRef<HTMLHeadingElement>();
    const bodyRef = React.createRef<HTMLDivElement>();

    render(
      <Drawer type="inline" open ref={drawerRef} aria-label="Inline panel" className="consumer-drawer">
        <DrawerHeader>
          <DrawerHeaderNavigation>Navigation</DrawerHeaderNavigation>
          <DrawerHeaderTitle heading={{ ref: headingRef }} action={null}>
            Panel heading
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody ref={bodyRef} style={{ overflow: 'visible' }}>
          Content
        </DrawerBody>
        <DrawerFooter>Footer</DrawerFooter>
      </Drawer>,
    );

    const drawer = screen.getByLabelText('Inline panel');
    expect(drawerRef.current).toBe(drawer);
    expect(drawer.className.endsWith('consumer-drawer')).toBe(true);
    expect(headingRef.current).toBe(screen.getByRole('heading', { name: 'Panel heading' }));
    expect(bodyRef.current).toHaveStyle({ overflow: 'visible' });
    expect(drawer.querySelector('.fui-DrawerHeaderTitle__action')).toBeNull();
  });

  it('marks a nested overlay backdrop without replacing its native dialog or event boundary', () => {
    const drawerRef = React.createRef<HTMLDialogElement>();
    const onOuterOpenChange = jest.fn();
    const onDrawerOpenChange = jest.fn();

    render(
      <Dialog open onOpenChange={onOuterOpenChange}>
        <DialogSurface aria-label="Outer">
          <OverlayDrawer open ref={drawerRef} onOpenChange={onDrawerOpenChange}>
            <DrawerHeader>
              <DrawerHeaderTitle>Nested panel</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>Content</DrawerBody>
          </OverlayDrawer>
        </DialogSurface>
      </Dialog>,
    );

    const drawer = screen.getByRole('dialog', { name: 'Nested panel' });
    expect(drawerRef.current).toBe(drawer);
    expect(drawer.tagName).toBe('DIALOG');
    expect(drawer).toHaveAttribute('open');
    expect(drawer).toHaveAttribute('data-dialog-nested');
    expect(screen.getByRole('dialog', { name: 'Outer' })).not.toHaveAttribute('data-dialog-nested');

    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(onDrawerOpenChange).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'escapeKeyDown', open: false }),
    );
    expect(onOuterOpenChange).not.toHaveBeenCalled();
  });
});
