import React from 'react';
import ReactMarkdown from 'react-markdown';
import TestRenderer from 'react-test-renderer';
import { HeadingRenderer } from './heading-renderer';

describe('HeadingRenderer', () => {
  it('should add `id` attribute to markdown headings', () => {
    const testRenderer = TestRenderer.create(
      <ReactMarkdown
        source={'# Some heading!\n\nAnd a paragraph'}
        renderers={{ heading: HeadingRenderer }}
      />,
    );

    expect(testRenderer.toJSON()).toEqual([
      { type: 'h1', props: { id: 'some-heading' }, children: ['Some heading!'] },
      { type: 'p', props: {}, children: ['And a paragraph'] },
    ]);
  });
});
