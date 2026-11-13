import * as React from 'react';
import { render } from '@testing-library/react';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { InfoButton } from './InfoButton.js';
import { InfoButtonBase, type InfoButtonBaseProps } from './InfoButtonBase.js';
import { InfoLabel } from './InfoLabel.js';
import { Label, type LabelProps } from './Label.js';
import { PopoverSurface, type PopoverSurfaceProps } from './PopoverSurface.js';

describe('Fluent information labels', () => {
  it('uses the stock standalone button name without auto-naming primitive content', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { getByRole } = render(<InfoButton ref={ref} info="Helpful details" popover={{ defaultOpen: true }} />);
    const button = getByRole('button', { name: 'information' });
    const info = getByRole('note');

    expect(ref.current).toBe(button);
    expect(info).toHaveTextContent('Helpful details');
    expect(info).not.toHaveAttribute('aria-label');
    expect(info).toHaveClass('fui-PopoverSurface');
  });

  it('preserves explicit names, div-surface rendering and the info slot ref', () => {
    const infoRef = React.createRef<HTMLDivElement>();
    const renderInfo: SlotRenderFunction<Extract<PopoverSurfaceProps, { as: 'div' }>> = (Component, props) => (
      <Component {...props} as="div">
        <strong>Custom content</strong>
      </Component>
    );
    const { getByRole } = render(
      <InfoButton
        aria-label="More details"
        popover={{ defaultOpen: true }}
        info={{
          as: 'div',
          ref: infoRef,
          'aria-label': 'Details',
          children: renderInfo,
        }}
      />,
    );

    expect(getByRole('button', { name: 'More details' })).toBeInTheDocument();
    const info = getByRole('note', { name: 'Details' });
    expect(infoRef.current).toBe(info);
    expect(info).toHaveClass('fui-PopoverSurface');
    expect(info).toHaveTextContent('Custom content');
  });

  it('preserves the dialog info-slot renderer and public dialog naming semantics', () => {
    const infoRef = React.createRef<HTMLDialogElement>();
    let styledSurfaceReceived = false;
    const renderInfo: SlotRenderFunction<Extract<PopoverSurfaceProps, { as?: 'dialog' }>> = (Component, props) => {
      styledSurfaceReceived = Component === PopoverSurface;
      return <Component {...props}>Dialog content</Component>;
    };
    const { getByRole } = render(
      <InfoButton
        aria-label="Help dialog"
        popover={{ defaultOpen: true, inertTrapFocus: true }}
        info={{
          as: 'dialog',
          ref: infoRef,
          children: renderInfo,
        }}
      />,
    );
    const button = getByRole('button', { name: 'Help dialog' });
    const info = getByRole('dialog', { name: 'Help dialog' });

    expect(styledSurfaceReceived).toBe(true);
    expect(infoRef.current).toBe(info);
    expect(info).toHaveAttribute('aria-labelledby', button.id);
  });

  it('composes styled Label and InfoButton renderers while keeping the label ref and association', () => {
    const labelRef = React.createRef<HTMLLabelElement>();
    let styledLabelReceived = false;
    let styledButtonReceived = false;
    const renderLabel: SlotRenderFunction<LabelProps> = (Component, props) => {
      styledLabelReceived = Component === Label;
      return (
        <Component {...props} data-testid="label">
          Setting
        </Component>
      );
    };
    const renderButton: SlotRenderFunction<InfoButtonBaseProps> = (Component, props) => {
      styledButtonReceived = Component === InfoButtonBase;
      return <Component {...props} />;
    };
    const { getByRole, getByTestId } = render(
      <>
        <InfoLabel
          ref={labelRef}
          htmlFor="control"
          size="large"
          required
          info="Details"
          label={{
            children: renderLabel,
          }}
          infoButton={{
            children: renderButton,
          }}
        />
        <input id="control" />
      </>,
    );

    expect(styledLabelReceived).toBe(true);
    expect(styledButtonReceived).toBe(true);
    expect(labelRef.current).toBe(getByTestId('label'));
    expect(labelRef.current).toHaveAttribute('data-size', 'large');
    expect(getByRole('textbox', { name: /Setting/ })).toHaveAttribute('id', 'control');
    expect(getByRole('button', { name: /Setting/ })).toHaveAttribute('data-size', 'large');
  });
});
