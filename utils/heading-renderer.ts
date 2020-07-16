import React from 'react';
import { headingToId } from './heading-to-id';

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node;
  } else if (React.isValidElement(node)) {
    return React.Children.toArray(node.props.children).map(extractText).join('');
  }
  return '';
}

export function HeadingRenderer({ level, children }: React.PropsWithChildren<{ level: string }>) {
  const text = React.Children.toArray(children).map(extractText).join();
  const slug = headingToId(text);
  return React.createElement('h' + level, { id: slug }, children);
}
