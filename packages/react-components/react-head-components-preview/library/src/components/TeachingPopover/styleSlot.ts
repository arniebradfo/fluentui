// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const styleSlot = <Props extends { className?: string }>(
  resolved: Props,
  marker: string,
  scopedClass: string | undefined,
): Props => ({
  ...resolved,
  className: [marker, scopedClass, resolved.className].filter(Boolean).join(' '),
});
