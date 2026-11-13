import * as React from 'react';
import { render } from '@testing-library/react';
import type { ExtractSlotProps, SlotRenderFunction } from '@fluentui/react-utilities';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbButton, type BreadcrumbButtonSlots } from './BreadcrumbButton';
import { BreadcrumbDivider } from './BreadcrumbDivider';
import { BreadcrumbItem } from './BreadcrumbItem';

describe('Breadcrumb visual wrapper', () => {
  it('inherits parent size without losing list, current-page, ref or slot contracts', () => {
    const navRef = React.createRef<HTMLElement>();
    const buttonRef = React.createRef<HTMLButtonElement>();
    const iconRef = React.createRef<HTMLSpanElement>();
    const renderIcon: SlotRenderFunction<ExtractSlotProps<BreadcrumbButtonSlots['icon']>> = (Icon, props) => (
      <Icon {...props} data-consumer="icon">
        Icon
      </Icon>
    );
    const { getByRole, getByText } = render(
      <Breadcrumb ref={navRef} size="large" list={{ className: 'consumer-list' }} aria-label="Location">
        <BreadcrumbItem size="small">
          <BreadcrumbButton
            ref={buttonRef}
            current
            size="small"
            className="consumer-button"
            style={{ opacity: 0.8 }}
            icon={{
              ref: iconRef,
              children: renderIcon,
            }}
          >
            Current page
          </BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider>Custom divider</BreadcrumbDivider>
      </Breadcrumb>,
    );
    expect(navRef.current).toBe(getByRole('navigation', { name: 'Location' }));
    expect(getByRole('list')).toHaveClass('consumer-list');
    const button = getByRole('button', { name: 'Icon Current page' });
    expect(buttonRef.current).toBe(button);
    expect(button).toHaveAttribute('aria-current', 'page');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button.parentElement).toHaveAttribute('data-size', 'large');
    expect(button).toHaveClass('consumer-button', 'fui-Button', 'fui-BreadcrumbButton');
    expect(button).toHaveStyle({ opacity: 0.8 });
    expect(iconRef.current).toHaveAttribute('data-consumer', 'icon');
    expect(getByText('Custom divider').querySelector('svg')).toBeNull();
  });

  it('does not replace explicitly empty divider content or null button icons', () => {
    const dividerRef = React.createRef<HTMLLIElement>();
    const { getByRole } = render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbButton icon={null}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider ref={dividerRef}>{null}</BreadcrumbDivider>
      </Breadcrumb>,
    );
    expect(dividerRef.current).toBeEmptyDOMElement();
    expect(getByRole('button').querySelector('.fui-BreadcrumbButton__icon')).toBeNull();
  });
});
