const path = require('node:path');
const { NormalModuleReplacementPlugin } = require('webpack');
const rootMain = require('../../../../../.storybook/main');
const {
  registerCssModuleRules,
} = require('../../../react-headless-components-preview/stories/.storybook/css-modules-webpack');

const componentPackagesRoot = path.resolve(__dirname, '../../../') + path.sep;
const catalogRoot = path.resolve(__dirname, '..') + path.sep;
const reusedStories = new Set(
  [
    'react-button/stories/src/Button/ButtonDefault.stories.tsx',
    'react-button/stories/src/Button/ButtonDisabled.stories.tsx',
    'react-input/stories/src/Input/InputDefault.stories.tsx',
    'react-checkbox/stories/src/Checkbox/CheckboxMixed.stories.tsx',
    'react-field/stories/src/Field/FieldRequired.stories.tsx',
    'react-button/stories/src/CompoundButton/CompoundButtonDefault.stories.tsx',
    'react-button/stories/src/MenuButton/MenuButtonDefault.stories.tsx',
    'react-button/stories/src/ToggleButton/ToggleButtonDefault.stories.tsx',
    'react-textarea/stories/src/Textarea/TextareaDefault.stories.tsx',
    'react-switch/stories/src/Switch/SwitchDefault.stories.tsx',
    'react-radio/stories/src/RadioGroup/RadioGroupDefault.stories.tsx',
    'react-select/stories/src/Select/SelectDefault.stories.tsx',
    'react-combobox/stories/src/Combobox/ComboboxDefault.stories.tsx',
    'react-combobox/stories/src/Dropdown/DropdownDefault.stories.tsx',
    'react-spinbutton/stories/src/SpinButton/SpinButtonDefault.stories.tsx',
    'react-slider/stories/src/Slider/SliderDefault.stories.tsx',
    'react-search/stories/src/SearchBox/SearchBoxDefault.stories.tsx',
    'react-tag-picker/stories/src/TagPicker/TagPickerDefault.stories.tsx',
    'react-avatar/stories/src/Avatar/AvatarDefault.stories.tsx',
    'react-avatar/stories/src/AvatarGroup/AvatarGroupDefault.stories.tsx',
    'react-badge/stories/src/Badge/BadgeDefault.stories.tsx',
    'react-badge/stories/src/CounterBadge/CounterBadgeDefault.stories.tsx',
    'react-badge/stories/src/PresenceBadge/PresenceBadgeDefault.stories.tsx',
    'react-persona/stories/src/Persona/PersonaDefault.stories.tsx',
    'react-progress/stories/src/ProgressBar/ProgressBarDefault.stories.tsx',
    'react-spinner/stories/src/Spinner/SpinnerDefault.stories.tsx',
    'react-skeleton/stories/src/Skeleton/SkeletonDefault.stories.tsx',
    'react-infolabel/stories/src/InfoLabel/InfoLabelDefault.stories.tsx',
    'react-message-bar/stories/src/MessageBar/Default.stories.tsx',
    'react-accordion/stories/src/Accordion/AccordionDefault.stories.tsx',
    'react-breadcrumb/stories/src/Breadcrumb/BreadcrumbDefault.stories.tsx',
    'react-tabs/stories/src/Tabs/TabListDefault.stories.tsx',
    'react-tags/stories/src/Tag/TagDefault.stories.tsx',
    'react-tags/stories/src/InteractionTag/InteractionTagDefault.stories.tsx',
    'react-tags/stories/src/TagGroup/TagGroupDefault.stories.tsx',
    'react-list/stories/src/List/ListDefault.stories.tsx',
    'react-tree/stories/src/Tree/TreeDefault.stories.tsx',
    'react-toolbar/stories/src/Toolbar/ToolbarDefault.stories.tsx',
    'react-color-picker/stories/src/ColorPicker/ColorPickerDefault.stories.tsx',
    'react-swatch-picker/stories/src/SwatchPicker/SwatchPickerDefault.stories.tsx',
    'react-rating/stories/src/Rating/RatingDefault.stories.tsx',
    'react-rating/stories/src/RatingDisplay/RatingDisplayDefault.stories.tsx',
  ].map(file => path.resolve(__dirname, '../../../', file)),
);

module.exports = {
  ...rootMain,
  stories: ['../src/**/*.stories.tsx'],
  addons: rootMain.addons.filter(addon => {
    const name = typeof addon === 'string' ? addon : addon.name;
    return !name.includes('react-storybook-addon-export-to-sandbox');
  }),
  webpackFinal: (config, options) => {
    const result = rootMain.webpackFinal(config, options);
    registerCssModuleRules({ config: result });
    result.resolve = {
      ...result.resolve,
      extensionAlias: {
        ...result.resolve?.extensionAlias,
        '.js': ['.js', '.ts', '.tsx'],
      },
    };
    result.plugins.push(
      new NormalModuleReplacementPlugin(/^@fluentui\/react-components$/, resource => {
        // Adapt only these vetted story bodies, never headless runtime imports.
        const issuer = resource.contextInfo.issuer;
        if (reusedStories.has(issuer)) {
          resource.request = path.resolve(__dirname, '../src/reuse.ts');
        } else if (
          issuer?.startsWith(componentPackagesRoot) &&
          !issuer.startsWith(catalogRoot) &&
          issuer.endsWith('.stories.tsx')
        ) {
          throw new Error(`Stock story must be reviewed and allowlisted before reuse: ${issuer}`);
        }
      }),
    );
    return result;
  },
};
