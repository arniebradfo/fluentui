import * as React from 'react';
import { Button, Checkbox, Field, FluentProvider, Input, webLightTheme } from './components/index';

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
