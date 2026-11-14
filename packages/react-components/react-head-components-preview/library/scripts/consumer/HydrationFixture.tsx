import * as React from 'react';
import { Button } from '@fluentui/react-head-components-preview/button';
import { Checkbox } from '@fluentui/react-head-components-preview/checkbox';
import { Field } from '@fluentui/react-head-components-preview/field';
import { FluentProvider } from '@fluentui/react-head-components-preview/provider';
import { Input } from '@fluentui/react-head-components-preview/input';
import { webLightTheme } from '@fluentui/react-head-components-preview/theme';

export function HydrationFixture() {
  const [count, setCount] = React.useState(0);
  return (
    <FluentProvider theme={webLightTheme}>
      <Field label="Server name">
        <Input defaultValue="Ada" />
      </Field>
      <Checkbox label="Server checkbox" defaultChecked="mixed" />
      <Button onClick={() => setCount(value => value + 1)}>Clicked {count}</Button>
    </FluentProvider>
  );
}
