import {
  resolvePositioningShorthand,
  type PositioningProps,
  type PositioningShorthand,
} from '@fluentui/react-headless-components-preview/positioning';

export function resolvePickerPositioning(positioning?: PositioningShorthand): PositioningProps {
  const options = resolvePositioningShorthand(positioning);
  return {
    matchTargetSize: 'width',
    ...options,
    position: options.position ?? 'below',
    align: options.align ?? 'start',
  };
}
