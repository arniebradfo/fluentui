import * as React from 'react';
import { useId } from '@fluentui/react-utilities';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  OverlayDrawer,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SplitButton,
  Text,
  Tooltip,
  tokens,
} from '../../library/src';
import type { DialogModalType } from '../../library/src';

export default {
  title: 'CSS Modules/Native overlays',
  parameters: {
    docs: {
      description: {
        component:
          'Candidate-only compositions for native dialog, popover and CSS-anchor behavior. DialogHeader contains the title; DialogBody is the content, not the old v9 layout wrapper. These examples require a browser with the native Popover API and CSS anchor positioning.',
      },
    },
  },
};

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacingVerticalM,
};

function DialogExample({ modalType }: { modalType: DialogModalType }) {
  return (
    <Dialog modalType={modalType}>
      <DialogTrigger>
        <Button>Open {modalType} dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogHeader>
          <DialogTitle>Project details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field label="Project name">
            <Input defaultValue="CSS Modules draft" />
          </Field>
          <Text block>Use Tab to move through the controls. Close returns focus to the trigger.</Text>
        </DialogBody>
        <DialogActions>
          <DialogTrigger action="close">
            <Button>Cancel</Button>
          </DialogTrigger>
          <DialogTrigger action="close">
            <Button appearance="primary">Save</Button>
          </DialogTrigger>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}

export const ModalDialog = () => <DialogExample modalType="modal" />;
export const NonModalDialog = () => <DialogExample modalType="non-modal" />;

function PopoverExample({ modal = false }: { modal?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const titleId = useId('popover-title');
  return (
    <Popover
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
      positioning="below-start"
      withArrow
      inertTrapFocus={modal}
    >
      <PopoverTrigger>
        <Button>Open {modal ? 'modal' : 'anchored'} popover</Button>
      </PopoverTrigger>
      <PopoverSurface aria-labelledby={titleId} style={stack}>
        <Text as="h2" size={500} weight="semibold" id={titleId}>
          Quick settings
        </Text>
        <Field label="Display name">
          <Input defaultValue="Ada" />
        </Field>
        <Button onClick={() => setOpen(false)}>Close popover</Button>
      </PopoverSurface>
    </Popover>
  );
}

export const AnchoredPopover = () => <PopoverExample />;
export const ModalPopover = () => <PopoverExample modal />;

export const Drawer = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <OverlayDrawer
        open={open}
        position="end"
        aria-label="Project settings"
        onOpenChange={(_, data) => setOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle action={<Button onClick={() => setOpen(false)}>Close drawer</Button>}>
            Project settings
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <Field label="Project name">
            <Input defaultValue="CSS Modules draft" />
          </Field>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="primary" onClick={() => setOpen(false)}>
            Save changes
          </Button>
        </DrawerFooter>
      </OverlayDrawer>
    </>
  );
};

export const SplitMenu = () => {
  const [action, setAction] = React.useState('No action yet');
  return (
    <div style={stack}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {triggerProps => (
            <SplitButton menuButton={triggerProps} primaryActionButton={{ onClick: () => setAction('Sent now') }}>
              Send
            </SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => setAction('Scheduled for tomorrow')}>Send tomorrow</MenuItem>
            <MenuItem onClick={() => setAction('Saved as draft')}>Save as draft</MenuItem>
            <MenuItem disabled>Send to everyone</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Text role="status">{action}</Text>
    </div>
  );
};

export const TooltipDescription = () => (
  <Tooltip content="Saves your project settings" relationship="description">
    <Button>Save project</Button>
  </Tooltip>
);
