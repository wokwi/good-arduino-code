import { useMemo } from 'react';
import { extractCodeAnnotations } from '../services/gac-annotations';
import { AnnotatedSource } from './annotated-source';

export interface ICodeElementProps {
  children: string;
}

export function CodeElement({ children }: ICodeElementProps) {
  const { code, annotations } = useMemo(() => extractCodeAnnotations(children), [children]);
  return (
    <code>
      <AnnotatedSource code={code} annotations={annotations} />
    </code>
  );
}
