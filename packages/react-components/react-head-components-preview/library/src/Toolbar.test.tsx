import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Toolbar } from './Toolbar.js';
import { ToolbarButton } from './ToolbarButton.js';
import { ToolbarDivider } from './ToolbarDivider.js';
import { ToolbarRadioButton } from './ToolbarRadioButton.js';
import { ToolbarRadioGroup } from './ToolbarRadioGroup.js';
import { ToolbarToggleButton } from './ToolbarToggleButton.js';

describe('Toolbar', () => {
  it('retains native focusgroup, stock button sizing, separator orientation, and selection callbacks', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onCheckedValueChange = jest.fn();
    const { getByRole } = render(
      <Toolbar ref={ref} size="small" vertical onCheckedValueChange={onCheckedValueChange}>
        <ToolbarButton>Action</ToolbarButton>
        <ToolbarToggleButton name="format" value="bold">
          Bold
        </ToolbarToggleButton>
        <ToolbarRadioGroup>
          <ToolbarRadioButton name="align" value="start" size="large">
            Start
          </ToolbarRadioButton>
        </ToolbarRadioGroup>
        <ToolbarDivider />
      </Toolbar>,
    );
    const toolbar = getByRole('toolbar');
    const toggle = getByRole('button', { name: 'Bold' });
    const radio = getByRole('radio', { name: 'Start' });

    expect(ref.current).toBe(toolbar);
    expect(toolbar).toHaveAttribute('focusgroup', 'toolbar block wrap');
    expect(getByRole('button', { name: 'Action' })).toHaveAttribute('data-size', 'medium');
    expect(toggle).toHaveAttribute('data-size', 'small');
    expect(radio).toHaveAttribute('data-size', 'large');
    expect(toggle).toHaveAttribute('data-shape', 'rounded');
    expect(getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-checked');
    expect(onCheckedValueChange).toHaveBeenCalledTimes(1);
    expect(onCheckedValueChange).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'format', checkedItems: ['bold'] }),
    );
  });
});
