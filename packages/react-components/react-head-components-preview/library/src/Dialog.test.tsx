import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Dialog } from './Dialog';
import { DialogActions } from './DialogActions';
import { DialogBody } from './DialogBody';
import { DialogHeader } from './DialogHeader';
import { DialogSurface } from './DialogSurface';
import { DialogTitle } from './DialogTitle';
import { DialogTrigger } from './DialogTrigger';
import { Tooltip } from './Tooltip';

describe('styled native Dialog', () => {
  it('composes the public header/content/actions structure and preserves native refs', async () => {
    const surfaceRef = React.createRef<HTMLDialogElement>();
    const bodyRef = React.createRef<HTMLDivElement>();
    const headerRef = React.createRef<HTMLElement>();

    render(
      <Dialog defaultOpen>
        <DialogSurface ref={surfaceRef} className="consumer-surface" style={{ maxWidth: 'none' }}>
          <DialogHeader ref={headerRef}>
            <DialogTitle>Confirm change</DialogTitle>
            <DialogTrigger>
              <button type="button">Close</button>
            </DialogTrigger>
          </DialogHeader>
          <DialogBody ref={bodyRef} className="consumer-body">
            Content
          </DialogBody>
          <DialogActions position="start" fluid>
            <button type="button">Confirm</button>
          </DialogActions>
        </DialogSurface>
      </Dialog>,
    );

    const surface = screen.getByRole('dialog', { name: 'Confirm change' });
    expect(surfaceRef.current).toBe(surface);
    expect(surface.tagName).toBe('DIALOG');
    expect(surface.className.endsWith('consumer-surface')).toBe(true);
    expect(surface).toHaveStyle({ maxWidth: 'none' });
    expect(headerRef.current?.tagName).toBe('HEADER');
    expect(bodyRef.current?.parentElement).toBe(surface);
    expect(bodyRef.current).toHaveClass('consumer-body');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps controlled close requests and consumer event handlers in the public lifecycle', () => {
    const onOpenChange = jest.fn();
    const onKeyDown = jest.fn();

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogSurface aria-label="Controlled" onKeyDown={onKeyDown}>
          <DialogBody>Content</DialogBody>
        </DialogSurface>
      </Dialog>,
    );

    const surface = screen.getByRole('dialog', { name: 'Controlled' });
    fireEvent.keyDown(surface, { key: 'Escape' });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'escapeKeyDown', open: false }),
    );
    expect(surface).toHaveAttribute('open');
  });

  it('preserves trigger composition through a nested Tooltip', () => {
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <Dialog>
        <Tooltip relationship="label" content="Open confirmation">
          <DialogTrigger>
            <button ref={triggerRef} type="button">
              Open
            </button>
          </DialogTrigger>
        </Tooltip>
        <DialogSurface aria-label="Confirmation">Content</DialogSurface>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open confirmation' });
    expect(triggerRef.current).toBe(trigger);
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Confirmation' })).toHaveAttribute('open');
  });
});
