import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Tab, type TabSlots } from './Tab';
import { TabList } from './TabList';

describe('Tab visual wrapper', () => {
  it('preserves native focusgroup selection, root identity and content refs while reserving label width', () => {
    const firstRef = React.createRef<HTMLButtonElement>();
    const secondRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLSpanElement>();
    const onSelect = jest.fn();
    const renderContent: SlotRenderFunction<ExtractSlotProps<TabSlots['content']>> = (Content, props) => (
      <Content {...props} data-consumer="content" />
    );
    const { getByRole } = render(
      <TabList defaultSelectedValue="first" onTabSelect={onSelect}>
        <Tab value="first" ref={firstRef}>
          First
        </Tab>
        <Tab
          value="second"
          ref={secondRef}
          className="consumer-tab"
          style={{ opacity: 0.8 }}
          content={{
            ref: contentRef,
            className: 'consumer-content',
            children: renderContent,
          }}
        >
          Second
        </Tab>
      </TabList>,
    );
    const second = getByRole('tab', { name: 'Second' });
    const content = contentRef.current;
    expect(getByRole('tablist')).toHaveAttribute('focusgroup', 'tablist inline wrap nomemory');
    expect(firstRef.current).toHaveAttribute('focusgroupstart', '');
    expect(secondRef.current).toBe(second);
    expect(second).toHaveClass('consumer-tab', 'fui-Tab');
    expect(second).toHaveStyle({ opacity: 0.8 });
    expect(content).toHaveAttribute('data-consumer', 'content');
    expect(content).toHaveClass('consumer-content', 'fui-Tab__content');
    expect(second.querySelectorAll('.fui-Tab__content--reserved-space')).toHaveLength(1);

    fireEvent.click(second);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(secondRef.current).toBe(second);
    expect(contentRef.current).toBe(content);
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(second).toHaveAttribute('focusgroupstart', '');
    expect(firstRef.current).not.toHaveAttribute('focusgroupstart');
  });

  it('uses public visual context for circular vertical tabs without a product appearance', () => {
    const { getByRole } = render(
      <TabList vertical appearance="filled-circular" size="large" reserveSelectedTabSpace={false}>
        <Tab value="one" icon={null}>
          One
        </Tab>
      </TabList>,
    );
    const tab = getByRole('tab', { name: 'One' });
    expect(getByRole('tablist')).toHaveAttribute('focusgroup', 'tablist block wrap nomemory');
    expect(tab).toHaveAttribute('data-appearance', 'filled-circular');
    expect(tab).toHaveAttribute('data-size', 'large');
    expect(tab).toHaveAttribute('data-orientation', 'vertical');
    expect(tab.querySelector('.fui-Tab__icon')).toBeNull();
    expect(tab.querySelector('.fui-Tab__content--reserved-space')).toBeNull();
  });

  it('keeps caller root render functions and disabled tab selection semantics', () => {
    const onSelect = jest.fn();
    const ref = React.createRef<HTMLButtonElement>();
    const renderRoot: SlotRenderFunction<ExtractSlotProps<TabSlots['root']>> = (Button, props) => (
      <Button {...props} data-consumer="root" />
    );
    const { getByRole } = render(
      <TabList onTabSelect={onSelect}>
        <Tab ref={ref} value="one" disabled content={{ children: 'One' }}>
          {renderRoot}
        </Tab>
      </TabList>,
    );
    const tab = getByRole('tab', { name: 'One' });
    expect(ref.current).toBe(tab);
    expect(tab).toHaveAttribute('data-consumer', 'root');
    expect(tab).toBeDisabled();
    fireEvent.click(tab);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
