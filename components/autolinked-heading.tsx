import { mdiLink } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { extractTextFromChildren } from '../utils/extract-text-from-children';
import { headingToId } from '../utils/heading-to-id';

type IAutolinkedHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function AutolinkedHeading({ size: H, children, ...props }: IAutolinkedHeadingProps) {
  const slug = headingToId(extractTextFromChildren(children));
  return (
    <H {...props} id={slug} className="heading">
      <a href={`#${slug}`} className="link">
        <Icon path={mdiLink} size={1} />
      </a>
      {children}
      <style jsx>{`
        .heading {
          position: relative;
        }

        .link {
          opacity: 0;
          position: absolute;
          color: #1b1f23;
          left: -32px;
          width: 32px;
          background: white;
        }

        .heading:hover .link {
          opacity: 1;
        }
      `}</style>
    </H>
  );
}
