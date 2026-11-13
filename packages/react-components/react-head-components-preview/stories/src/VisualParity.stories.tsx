import * as React from 'react';
import {
  Avatar as StockAvatar,
  Button as StockButton,
  Checkbox as StockCheckbox,
  Field as StockField,
  FluentProvider as StockProvider,
  Input as StockInput,
} from '@fluentui/react-components';
import {
  Avatar,
  Button,
  Checkbox,
  Field,
  FluentProvider,
  Input,
  tokens,
  webDarkTheme,
  webLightTheme,
} from '../../library/src';

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
      </FluentProvider>
    </div>
  );
}

export const Light = () => <Comparison />;
export const Dark = () => <Comparison dark />;
export const RightToLeft = () => <Comparison dir="rtl" />;
