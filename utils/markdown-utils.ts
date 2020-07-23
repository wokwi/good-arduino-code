import parse from 'remark-parse';
import unified from 'unified';

interface ParserNode {
  type: string;
  children?: ParserNode[];
  value?: string;
}

interface HeadingNode extends ParserNode {
  type: 'heading';
  children: ParserNode[];
  depth: number;
}

function extractText(child: ParserNode): string {
  if (child.type === 'text') {
    return child.value ?? '';
  }
  if (child.children) {
    return child.children.map(extractText).join('');
  }
  return '';
}

export function extractHeadings(markdown: string) {
  const root = unified().use(parse).parse(markdown) as ParserNode;
  const headings =
    (root.children?.filter((item) => item.type === 'heading') as HeadingNode[]) || [];
  return headings.map((h) => ({
    text: h.children.map(extractText).join(''),
    level: h.depth,
  }));
}
