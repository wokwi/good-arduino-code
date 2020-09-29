import React from 'react';
import { extractTextFromChildren } from './extract-text-from-children';
import { headingToId } from './heading-to-id';

export function HeadingRenderer({ level, children }: React.PropsWithChildren<{ level: string }>) {
  const text = React.Children.toArray(children).map(extractTextFromChildren).join();
  const slug = headingToId(text);
  return React.createElement('h' + level, { id: slug }, children);
}
