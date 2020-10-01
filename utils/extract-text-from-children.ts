import { isValidElement, Children } from 'react';

export function extractTextFromChildren(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node;
  } else if (isValidElement(node)) {
    return Children.toArray(node.props.children).map(extractTextFromChildren).join('');
  }
  return '';
}
