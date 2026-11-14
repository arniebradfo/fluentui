// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export function addClassName(target: { className?: string }, ...classNames: string[]): void {
  target.className = [...classNames, target.className].filter(Boolean).join(' ');
}
