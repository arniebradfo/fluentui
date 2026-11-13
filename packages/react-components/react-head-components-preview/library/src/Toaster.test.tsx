import * as React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import { Toaster, useToastController } from './Toaster';
import { Toast, type ToastImperativeRef } from './Toast';
import { ToastTitle } from './ToastTitle';
import { ToastBody } from './ToastBody';
import { ToastContainer, type ToastContainerProps } from './ToastContainer';

describe('styled headless Toaster', () => {
  it('styles generated containers through the direct-child bridge without replacing controller composition', () => {
    let controller: ReturnType<typeof useToastController>;
    const containerRef = React.createRef<HTMLDivElement>();
    const onStatusChange = jest.fn();
    const announce = jest.fn();
    const Test = () => {
      controller = useToastController('composition');
      return (
        <Provider dir="rtl">
          <Toaster
            toasterId="composition"
            className="caller-stack"
            style={{ opacity: 0.9 }}
            position="top-start"
            offset={{ 'top-start': { horizontal: 0, vertical: 24 } }}
            announce={announce}
          />
        </Provider>
      );
    };
    const { getByRole, getByText, queryByText } = render(<Test />);
    act(() => {
      controller.dispatchToast(
        <Toast appearance="inverted">
          <ToastTitle>Saved</ToastTitle>
          <ToastBody subtitle="Just now">Changes are synced.</ToastBody>
        </Toast>,
        {
          toastId: 'saved',
          intent: 'success',
          timeout: -1,
          onStatusChange,
          root: { ref: containerRef, className: 'caller-container', role: 'group', style: { opacity: 0.8 } },
        },
      );
    });

    const stack = getByRole('list');
    const container = getByRole('group');
    expect(stack).toHaveAttribute('popover', 'manual');
    expect(stack).toHaveAttribute('focusgroup', 'toolbar block itemcontrols');
    expect(stack).toHaveAttribute('data-toaster-position', 'top-start');
    expect(stack).toHaveAttribute('dir', 'rtl');
    expect(stack).toHaveClass('Toaster', 'Toaster__containers', 'caller-stack');
    expect(stack.style.getPropertyValue('--fui-toast-offset-horizontal')).toBe('0px');
    expect(stack.style.getPropertyValue('--fui-toast-offset-vertical')).toBe('24px');
    expect(stack).toHaveStyle({ opacity: '0.9' });
    expect(container.parentElement).toBe(stack);
    expect(containerRef.current).toBe(container);
    expect(container).toHaveClass('caller-container');
    expect(container).toHaveStyle({ opacity: '0.8' });
    expect(container).toHaveAttribute('aria-labelledby', getByText('Saved').id);
    expect(container.querySelector('.fui-ToastTitle__media')).toHaveAttribute('data-intent', 'success');
    expect(container.querySelector('.fui-ToastTitle__media svg')).not.toBeNull();
    expect(container.querySelector('.fui-ToastBody__subtitle')).toHaveAttribute('data-appearance', 'inverted');
    expect(onStatusChange).toHaveBeenCalledWith(null, expect.objectContaining({ status: 'visible' }));

    act(() => {
      controller.updateToast({
        toastId: 'saved',
        content: (
          <Toast>
            <ToastTitle>Updated</ToastTitle>
          </Toast>
        ),
      });
    });
    expect(getByText('Updated')).toBeInTheDocument();
    act(() => {
      controller.dismissToast('saved');
    });
    expect(queryByText('Updated')).toBeNull();
    expect(onStatusChange).toHaveBeenCalledWith(null, expect.objectContaining({ status: 'dismissed' }));
    expect(onStatusChange).toHaveBeenCalledWith(null, expect.objectContaining({ status: 'unmounted' }));
  });

  it('keeps caller hover handlers and public Delete-key dismissal on generated containers', () => {
    let controller: ReturnType<typeof useToastController>;
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const onKeyDown = jest.fn();
    const Test = () => {
      controller = useToastController('timer');
      return <Toaster toasterId="timer" timeout={-1} pauseOnHover announce={jest.fn()} />;
    };
    const { getByRole, queryByText } = render(<Test />);
    act(() => {
      controller.dispatchToast(
        <Toast>
          <ToastTitle>Timed toast</ToastTitle>
        </Toast>,
        {
          toastId: 'timed',
          root: { onMouseEnter, onMouseLeave, onKeyDown },
        },
      );
    });
    fireEvent.mouseEnter(getByRole('listitem'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(queryByText('Timed toast')).not.toBeNull();
    fireEvent.mouseLeave(getByRole('listitem'));
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(getByRole('listitem'), { key: 'Delete' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(queryByText('Timed toast')).toBeNull();
  });

  it('styles exported containers too, preserving media nulls and imperative focus', () => {
    const containerRef = React.createRef<HTMLDivElement>();
    const imperativeRef = React.createRef<ToastImperativeRef>();
    const announce = jest.fn();
    const props: ToastContainerProps = {
      toastId: 'manual',
      toasterId: undefined,
      position: 'bottom-end',
      content: undefined,
      timeout: -1,
      pauseOnWindowBlur: false,
      pauseOnHover: false,
      priority: 0,
      data: {},
      onStatusChange: undefined,
      close: jest.fn(),
      remove: jest.fn(),
      updateId: 0,
      order: 0,
      visible: true,
      tryRestoreFocus: jest.fn(),
      imperativeRef,
      announce,
    };
    const { getByRole, getByText } = render(
      <ToastContainer {...props} ref={containerRef} className="caller-container">
        <Toast>
          <ToastTitle media={null}>Manual toast</ToastTitle>
        </Toast>
      </ToastContainer>,
    );
    const container = getByRole('listitem');
    expect(containerRef.current).toBe(container);
    expect(container).toHaveClass('fui-ToastContainer', 'ToastContainer', 'caller-container');
    expect(container).toHaveAttribute('aria-labelledby', getByText('Manual toast').id);
    expect(container.querySelector('.fui-ToastTitle__media')).toBeNull();
    expect(announce).toHaveBeenCalledWith('Manual toast', { politeness: 'polite' });
    act(() => {
      imperativeRef.current?.focus();
    });
    expect(container).toHaveFocus();
  });
});
