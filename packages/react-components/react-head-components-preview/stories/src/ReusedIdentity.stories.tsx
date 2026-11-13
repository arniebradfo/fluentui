import * as React from 'react';
import { Default as AvatarDefault } from '../../../react-avatar/stories/src/Avatar/AvatarDefault.stories';
import { Default as AvatarGroupDefault } from '../../../react-avatar/stories/src/AvatarGroup/AvatarGroupDefault.stories';
import { Default as BadgeDefault } from '../../../react-badge/stories/src/Badge/BadgeDefault.stories';
import { Default as CounterBadgeDefault } from '../../../react-badge/stories/src/CounterBadge/CounterBadgeDefault.stories';
import { Default as PresenceBadgeDefault } from '../../../react-badge/stories/src/PresenceBadge/PresenceBadgeDefault.stories';
import { Default as PersonaDefault } from '../../../react-persona/stories/src/Persona/PersonaDefault.stories';
import { Default as ProgressBarDefault } from '../../../react-progress/stories/src/ProgressBar/ProgressBarDefault.stories';
import { Default as SpinnerDefault } from '../../../react-spinner/stories/src/Spinner/SpinnerDefault.stories';
import { Default as SkeletonDefault } from '../../../react-skeleton/stories/src/Skeleton/SkeletonDefault.stories';
import { Default as InfoLabelDefault } from '../../../react-infolabel/stories/src/InfoLabel/InfoLabelDefault.stories';
import { Default as MessageBarDefault } from '../../../react-message-bar/stories/src/MessageBar/Default.stories';

export default {
  title: 'CSS Modules/Identity and status',
  parameters: {
    docs: {
      description: {
        component:
          'V9 identity and status story bodies rendered with the styled candidate. AvatarGroup overflow and InfoLabel also exercise native popovers. The Persona image needs network access.',
      },
    },
  },
};

export const Avatar = () => <AvatarDefault name="Ada Lovelace" aria-label="Ada Lovelace" />;
export const AvatarGroup = () => <AvatarGroupDefault />;
export const Badge = () => <BadgeDefault>New</BadgeDefault>;
export const CounterBadge = () => <CounterBadgeDefault count={5} />;
export const PresenceBadge = () => <PresenceBadgeDefault />;
export const Persona = () => <PersonaDefault />;
export const Progress = () => <ProgressBarDefault />;
export const Spinner = () => <SpinnerDefault label="Loading content" />;
export const Skeleton = () => <SkeletonDefault />;
export const InfoLabel = () => <InfoLabelDefault />;
export const MessageBar = () => <MessageBarDefault />;
