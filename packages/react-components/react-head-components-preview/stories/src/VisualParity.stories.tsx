import * as React from 'react';
import {
  Avatar as StockAvatar,
  Button as StockButton,
  Checkbox as StockCheckbox,
  Field as StockField,
  FluentProvider as StockProvider,
  Input as StockInput,
  Tab as StockTab,
  TabList as StockTabList,
  Toast as StockToast,
  Toaster as StockToaster,
  ToastTitle as StockToastTitle,
  useToastController as useStockToastController,
} from '@fluentui/react-components';
import {
  Avatar,
  Button,
  Checkbox,
  Field,
  FluentProvider,
  Input,
  Tab,
  TabList,
  Toast,
  Toaster,
  ToastTitle,
  tokens,
  webDarkTheme,
  webLightTheme,
  useToastController,
} from '../../library/src';
import type { ToasterProps, ToastPosition } from '../../library/src';

export default { title: 'CSS Modules/Visual comparison' };

function Comparison({ dark = false, dir = 'ltr' }: { dark?: boolean; dir?: 'ltr' | 'rtl' }) {
  const theme = dark ? webDarkTheme : webLightTheme;
  const layout: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <StockProvider theme={theme} dir={dir} style={layout} data-testid="stock">
        <StockButton appearance="primary">Primary button</StockButton>
        <StockButton appearance="primary" disabled>
          Disabled primary
        </StockButton>
        <StockField label="Name" validationState="error" validationMessage="Enter a name">
          <StockInput />
        </StockField>
        <StockCheckbox label="Mixed option" defaultChecked="mixed" />
        <StockAvatar name="Ada Lovelace" size={16} />
        <StockTabList appearance="filled-circular" defaultSelectedValue="selected">
          <StockTab value="selected" icon={<span aria-hidden="true">+</span>}>
            Selected tab
          </StockTab>
          <StockTab value="other">Other tab</StockTab>
        </StockTabList>
        <StockTabList appearance="filled-circular" defaultSelectedValue="disabled">
          <StockTab value="disabled" disabled icon={<span aria-hidden="true">+</span>}>
            Disabled selected tab
          </StockTab>
          <StockTab value="other">Other tab</StockTab>
        </StockTabList>
      </StockProvider>
      <FluentProvider theme={theme} dir={dir} style={layout} data-testid="candidate">
        <Button appearance="primary">Primary button</Button>
        <Button appearance="primary" disabled>
          Disabled primary
        </Button>
        <Field label="Name" validationState="error" validationMessage="Enter a name">
          <Input />
        </Field>
        <Checkbox label="Mixed option" defaultChecked="mixed" />
        <Avatar name="Ada Lovelace" size={16} />
        <TabList appearance="filled-circular" defaultSelectedValue="selected">
          <Tab value="selected" icon={<span aria-hidden="true">+</span>}>
            Selected tab
          </Tab>
          <Tab value="other">Other tab</Tab>
        </TabList>
        <TabList appearance="filled-circular" defaultSelectedValue="disabled">
          <Tab value="disabled" disabled icon={<span aria-hidden="true">+</span>}>
            Disabled selected tab
          </Tab>
          <Tab value="other">Other tab</Tab>
        </TabList>
      </FluentProvider>
    </div>
  );
}

export const Light = () => <Comparison />;
export const Dark = () => <Comparison dark />;
export const RightToLeft = () => <Comparison dir="rtl" />;

const toastPositions: ToastPosition[] = ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'];
type ToastOffsetMode = 'default' | 'zero' | 'per-position' | 'caller';

export const ToastPositionOffsets = () => {
  const [rtl, setRtl] = React.useState(false);
  const [mode, setMode] = React.useState<ToastOffsetMode>('default');
  const stock = useStockToastController('css-audit-stock-offsets');
  const candidate = useToastController('css-audit-candidate-offsets');
  const customOffset = {
    horizontal: Number.parseFloat(webLightTheme.spacingHorizontalXXL),
    vertical: Number.parseFloat(webLightTheme.spacingVerticalXXXL),
  };
  const offset: ToasterProps['offset'] =
    mode === 'zero'
      ? { horizontal: 0, vertical: 0 }
      : mode === 'per-position'
      ? {
          'top-start': { horizontal: 0, vertical: customOffset.vertical },
          'bottom-end': { horizontal: customOffset.horizontal, vertical: 0 },
        }
      : undefined;
  // Stock overwrites positional styles, so its equivalent offset prop is the oracle.
  const stockOffset = mode === 'caller' ? customOffset : offset;
  const positions = mode === 'caller' ? (['top-start'] as const) : toastPositions;
  const showToasts = (implementation: 'stock' | 'candidate') => {
    const controller = implementation === 'stock' ? stock : candidate;
    const ToastRoot = implementation === 'stock' ? StockToast : Toast;
    const Title = implementation === 'stock' ? StockToastTitle : ToastTitle;
    for (const position of positions) {
      controller.dispatchToast(
        <ToastRoot>
          <Title>{position}</Title>
        </ToastRoot>,
        { position, toastId: `${implementation}-${position}` },
      );
    }
  };

  return (
    <div style={{ paddingBlock: `calc(${tokens.spacingVerticalXXXL} * 3)` }}>
      <label>
        <input type="checkbox" checked={rtl} onChange={event => setRtl(event.target.checked)} />
        Right-to-left
      </label>
      <label>
        Toast offset configuration
        <select value={mode} onChange={event => setMode(event.target.value as ToastOffsetMode)}>
          <option value="default">Default offsets</option>
          <option value="zero">Explicit zero offsets</option>
          <option value="per-position">Per-position offsets</option>
          <option value="caller">Caller position styles</option>
        </select>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <StockProvider theme={webLightTheme} dir={rtl ? 'rtl' : 'ltr'}>
          <StockButton onClick={() => showToasts('stock')}>Show stock toasts</StockButton>
          <StockButton onClick={() => stock.dismissAllToasts()}>Dismiss stock toasts</StockButton>
          <StockToaster
            toasterId="css-audit-stock-offsets"
            timeout={-1}
            limit={toastPositions.length}
            offset={stockOffset}
            data-testid="stock-toast-stack"
          />
        </StockProvider>
        <FluentProvider theme={webLightTheme} dir={rtl ? 'rtl' : 'ltr'}>
          <Button onClick={() => showToasts('candidate')}>Show candidate toasts</Button>
          <Button onClick={() => candidate.dismissAllToasts()}>Dismiss candidate toasts</Button>
          <Toaster
            toasterId="css-audit-candidate-offsets"
            timeout={-1}
            limit={toastPositions.length}
            offset={mode === 'caller' ? { horizontal: 0, vertical: 0 } : offset}
            style={
              mode === 'caller'
                ? { insetInlineStart: tokens.spacingHorizontalXXL, top: tokens.spacingVerticalXXXL }
                : undefined
            }
            data-testid="candidate-toast-stack"
          />
        </FluentProvider>
      </div>
    </div>
  );
};
