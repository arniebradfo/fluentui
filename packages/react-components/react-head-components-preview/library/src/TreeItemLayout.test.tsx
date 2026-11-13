import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ButtonContextProvider, useButtonContext } from '@fluentui/react-headless-components-preview/button';
import type { SlotRenderFunction } from '@fluentui/react-utilities';
import { Tree } from './Tree';
import { TreeItem } from './TreeItem';
import { TreeItemLayout, type TreeItemLayoutActionSlotProps } from './TreeItemLayout';

const ButtonSize = ({ name }: { name: string }): React.ReactElement => {
  const { size } = useButtonContext();
  return <button data-size={size}>{name}</button>;
};

describe('TreeItemLayout native visual bridges', () => {
  it('provides small action buttons without changing main-content context, refs or native treegrid navigation', () => {
    const actionsRef = React.createRef<HTMLDivElement>();
    const layoutRef = React.createRef<HTMLDivElement>();
    const renderActions: SlotRenderFunction<TreeItemLayoutActionSlotProps> = (Actions, props) => (
      <Actions {...props} data-consumer="actions">
        <ButtonSize name="Rename" />
      </Actions>
    );
    const { getByRole } = render(
      <ButtonContextProvider value={{ size: 'large' }}>
        <Tree aria-label="Files" navigationMode="treegrid" size="small">
          <TreeItem itemType="leaf" value="one">
            <TreeItemLayout
              ref={layoutRef}
              actions={{
                ref: actionsRef,
                visible: true,
                className: 'consumer-actions',
                style: { opacity: 0.8 },
                children: renderActions,
              }}
            >
              <ButtonSize name="Main control" />
            </TreeItemLayout>
          </TreeItem>
        </Tree>
      </ButtonContextProvider>,
    );
    const actions = getByRole('toolbar');
    expect(actionsRef.current).toBe(actions);
    expect(actions).toHaveAttribute('focusgroup', 'toolbar inline');
    expect(actions).not.toHaveAttribute('data-tabster');
    expect(actions).toHaveAttribute('data-consumer', 'actions');
    expect(actions).toHaveClass('consumer-actions', 'fui-TreeItemLayout__actions');
    expect(actions).toHaveStyle({ opacity: 0.8 });
    expect(getByRole('button', { name: 'Rename' })).toHaveAttribute('data-size', 'small');
    expect(getByRole('button', { name: 'Main control' })).toHaveAttribute('data-size', 'large');
    expect(layoutRef.current).toHaveAttribute('data-size', 'small');
  });

  it('also supplies small buttons to the visible aside', () => {
    const { getByRole } = render(
      <Tree aria-label="Files">
        <TreeItem itemType="leaf" value="one">
          <TreeItemLayout aside={<ButtonSize name="More" />}>One</TreeItemLayout>
        </TreeItem>
      </Tree>,
    );
    expect(getByRole('button', { name: 'More' })).toHaveAttribute('data-size', 'small');
  });

  it('preserves the native mixed selector, ref and focus cancellation without rewriting checked items', () => {
    const selectorRef = React.createRef<HTMLInputElement>();
    const onCheckedChange = jest.fn();
    const preventFocus: React.MouseEventHandler<HTMLInputElement> = event => event.preventDefault();
    const { getByRole } = render(
      <Tree
        aria-label="Files"
        selectionMode="multiselect"
        checkedItems={[['one', 'mixed']]}
        onCheckedChange={onCheckedChange}
      >
        <TreeItem itemType="branch" value="one">
          <TreeItemLayout
            selector={{
              ref: selectorRef,
              className: 'consumer-selector',
              style: { opacity: 0.8 },
              name: 'selection',
              onClick: preventFocus,
            }}
          >
            One
          </TreeItemLayout>
        </TreeItem>
      </Tree>,
    );
    const selector = getByRole('checkbox', { name: 'One' });
    expect(selectorRef.current).toBe(selector);
    expect(selectorRef.current?.indeterminate).toBe(true);
    expect(selector).toHaveClass('consumer-selector', 'fui-TreeItemLayout__selector');
    expect(selector.tagName).toBe('INPUT');
    expect(selector).toHaveStyle({ opacity: 0.8 });
    expect(selector).toHaveAttribute('name', 'selection');
    selector.focus();
    fireEvent.click(selector);
    expect(selector).toHaveFocus();
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(getByRole('treeitem')).toHaveAttribute('data-checked', 'mixed');
    expect(selectorRef.current?.indeterminate).toBe(true);
  });

  it('keeps null native selectors and expand icons absent', () => {
    const { queryByRole, container } = render(
      <Tree aria-label="Files" selectionMode="single">
        <TreeItem itemType="branch" value="one">
          <TreeItemLayout selector={null} expandIcon={null}>
            One
          </TreeItemLayout>
        </TreeItem>
      </Tree>,
    );
    expect(queryByRole('radio')).toBeNull();
    expect(container.querySelector('.fui-TreeItemLayout__expandIcon')).toBeNull();
  });
});
