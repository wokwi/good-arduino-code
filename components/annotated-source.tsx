import { IGACAnnotation } from '../services/gac-annotations';
import Highlight from 'react-highlight';
import { useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

const codeLineHeight = 25.5;
const lineOffset = (line: number) => line * codeLineHeight;

interface IAnnotatedSourceProps {
  code: string;
  annotations: IGACAnnotation[];
}

function annotationLines(annotation: IGACAnnotation) {
  const result = [];
  for (let line = annotation.line; line <= annotation.endLine; line++) {
    result.push(line);
  }
  return result;
}

function AnnotationMarkers({ annotations }: { annotations: IGACAnnotation[] }) {
  const result = [];
  for (const annotation of annotations) {
    for (const line of annotationLines(annotation)) {
      result[line - 1] = (
        <div className="marker" key={line - 1}>
          &nbsp;
        </div>
      );
    }
  }
  for (let line = 0; line < result.length; line++) {
    result[line] = result[line] ?? <div key={line}>&nbsp;</div>;
  }
  return <>{result}</>;
}

export function AnnotatedSource({ code, annotations }: IAnnotatedSourceProps) {
  const codeBoxRef = useRef<HTMLDivElement>(null);
  const [activeAnnotation, setActiveAnnotation] = useState<IGACAnnotation | null>(null);

  const highlightedCode = useMemo(() => <Highlight>{code}</Highlight>, [code]);
  const annotatedLines = useMemo(() => {
    const result = new Map<number, IGACAnnotation>();
    for (const annotation of annotations) {
      for (const line of annotationLines(annotation)) {
        result.set(line, annotation);
      }
    }
    return result;
  }, annotations);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const codeBox = codeBoxRef.current;
    if (!codeBox) {
      return;
    }
    const { target } = e;
    if (target instanceof HTMLElement && target.closest('.annotation-info')) {
      return;
    }
    const line = Math.floor((e.pageY - codeBox.offsetTop) / codeLineHeight) + 1;
    setActiveAnnotation(annotatedLines.get(line) ?? null);
  };

  return (
    <div
      className="code-box"
      onMouseMoveCapture={handleMouseOver}
      onMouseLeave={() => setActiveAnnotation(null)}
      ref={codeBoxRef}
    >
      <div
        className="highlight"
        style={{
          width: activeAnnotation ? '100%' : 0,
          visibility: activeAnnotation ? 'visible' : 'hidden',
          top: lineOffset((activeAnnotation?.line ?? 0) - 1),
          height: lineOffset((activeAnnotation?.endLine ?? 0) - (activeAnnotation?.line ?? 0) + 1),
        }}
      >
        &nbsp;
      </div>
      <div
        className={`mask ${activeAnnotation ? 'mask-active' : ''}`}
        style={{
          height: lineOffset((activeAnnotation?.line ?? 0) - 1),
        }}
      />
      <div
        className={`mask ${activeAnnotation ? 'mask-active' : ''}`}
        style={{
          top: lineOffset(activeAnnotation?.endLine ?? 0),
          bottom: 0,
        }}
      />
      <div className="annotation-markers">
        <AnnotationMarkers annotations={annotations} />
      </div>
      {highlightedCode}
      {activeAnnotation && (
        <div
          className="annotation-info"
          style={{
            top: lineOffset(activeAnnotation.endLine),
          }}
        >
          <ReactMarkdown
            source={activeAnnotation.value}
            linkTarget={(url) => (url.startsWith('#') ? '' : '_blank')}
          />
        </div>
      )}
      <style jsx>{`
        .code-box {
          position: relative;
          display: flex;
        }
        .code-box > :global(pre) {
          margin-top: 0;
        }
        .code-box > :global(pre > code) {
          background: transparent;
          padding: 0;
        }

        .annotation-markers {
          line-height: 1.5;
          width: 8px;
        }

        :global(.marker) {
          position: relative;
          width: 4px;
          background: #00ffc3;
        }

        .highlight {
          position: absolute;
          background: #00ffc3;
          width: 100%;
          transition: width 0.7s;
          z-index: -1;
        }

        .mask {
          opacity: 0;
          position: absolute;
          background: white;
          width: 100%;
          top: 0;
        }
        .mask.mask-active {
          opacity: 0.6;
          transition: opacity 1s;
        }

        .annotation-info {
          position: absolute;
          background: white;
          padding: 0.5em;
          line-height: 1.5;
          border: solid black 1px;
          width: 100%;
        }

        .annotation-info :global(p:first-child) {
          margin-top: 0;
        }
        .annotation-info :global(p:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
