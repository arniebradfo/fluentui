import * as React from 'react';
import { Default as CompoundButtonDefault } from '../../../react-button/stories/src/CompoundButton/CompoundButtonDefault.stories';
import { Default as MenuButtonDefault } from '../../../react-button/stories/src/MenuButton/MenuButtonDefault.stories';
import { Default as ToggleButtonDefault } from '../../../react-button/stories/src/ToggleButton/ToggleButtonDefault.stories';

export default {
  title: 'CSS Modules/Buttons',
  parameters: {
    docs: {
      description: {
        component:
          'Vetted v9 story bodies rendered with the CSS Modules components. The menu uses the native popover implementation.',
      },
    },
  },
};

export const Compound = () => <CompoundButtonDefault />;
export const Toggle = () => <ToggleButtonDefault />;
export const Menu = () => <MenuButtonDefault />;
