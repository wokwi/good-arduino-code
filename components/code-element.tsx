import { useMemo } from 'react';
import { extractCodeAnnotations } from '../services/gac-annotations';
import { AnnotatedSource } from './annotated-source';

export interface ICodeElementProps {
  children: string;
}

export function CodeElement({ children }: ICodeElementProps) {
  const { code, annotations } = useMemo(() => extractCodeAnnotations(children), [children]);
  return (
    <div style={{ fontSize: '17px', width: '100%' }}>
      <AnnotatedSource code={code.replace(/\n$/, '')} annotations={annotations} />
    </div>
  );
}
