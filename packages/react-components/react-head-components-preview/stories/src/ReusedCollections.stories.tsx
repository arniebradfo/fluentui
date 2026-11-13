import * as React from 'react';
import { Default as AccordionDefault } from '../../../react-accordion/stories/src/Accordion/AccordionDefault.stories';
import { Default as BreadcrumbDefault } from '../../../react-breadcrumb/stories/src/Breadcrumb/BreadcrumbDefault.stories';
import { Default as TabListDefault } from '../../../react-tabs/stories/src/Tabs/TabListDefault.stories';
import { Default as TagDefault } from '../../../react-tags/stories/src/Tag/TagDefault.stories';
import { Default as InteractionTagDefault } from '../../../react-tags/stories/src/InteractionTag/InteractionTagDefault.stories';
import { Default as TagGroupDefault } from '../../../react-tags/stories/src/TagGroup/TagGroupDefault.stories';
import { Default as ListDefault } from '../../../react-list/stories/src/List/ListDefault.stories';
import { Default as TreeDefault } from '../../../react-tree/stories/src/Tree/TreeDefault.stories';
import { Default as ToolbarDefault } from '../../../react-toolbar/stories/src/Toolbar/ToolbarDefault.stories';
import { Button, Card, CardFooter, CardHeader, CardPreview, Text, tokens } from '../../library/src';

export default {
  title: 'CSS Modules/Collections',
  parameters: {
    docs: {
      description: {
        component:
          'Vetted v9 examples for supported collections, plus a local Card composition using candidate Text instead of unavailable typography presets. Tree is nested, not FlatTree. DataGrid, Table and Carousel are not represented.',
      },
    },
  },
};

export const Accordion = () => <AccordionDefault />;
export const Breadcrumb = () => <BreadcrumbDefault />;
export const Tabs = () => <TabListDefault defaultSelectedValue="tab1" />;
export const Tag = () => <TagDefault />;
export const InteractionTag = () => <InteractionTagDefault />;
export const TagGroup = () => <TagGroupDefault />;
export const List = () => <ListDefault />;
export const Tree = () => <TreeDefault />;
export const Toolbar = () => <ToolbarDefault />;

export const CardComposition = () => (
  <Card aria-label="Project update">
    <CardHeader
      header={<Text weight="semibold">Project update</Text>}
      description={<Text size={200}>Updated today</Text>}
    />
    <CardPreview>
      <div
        style={{
          backgroundColor: tokens.colorBrandBackground2,
          color: tokens.colorBrandForeground2,
          padding: tokens.spacingVerticalXXL,
        }}
      >
        <Text size={500} weight="semibold">
          CSS Modules first draft
        </Text>
      </div>
    </CardPreview>
    <Text>Card header, preview and footer share the candidate styling and theme.</Text>
    <CardFooter>
      <Button appearance="primary">Open project</Button>
      <Button>Share</Button>
    </CardFooter>
  </Card>
);
