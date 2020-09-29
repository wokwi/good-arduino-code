import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import arduino from 'react-syntax-highlighter/dist/cjs/languages/hljs/arduino';
import clike from 'react-syntax-highlighter/dist/cjs/languages/hljs/c-like';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/hljs/cpp';
import { arduinoLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { IGACAnnotation } from '../services/gac-annotations';

SyntaxHighlighter.registerLanguage('c-like', clike); // `arduino` requires `clike`
SyntaxHighlighter.registerLanguage('cpp', cpp); // `arduino` requires `cpp`
SyntaxHighlighter.registerLanguage('arduino', arduino);

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
  const markersRef = useRef<HTMLDivElement>(null);

  const [activeAnnotation, setActiveAnnotation] = useState<IGACAnnotation | null>(null);

  const annotatedLines = useMemo(() => {
    const result = new Map<number, IGACAnnotation>();
    for (const annotation of annotations) {
      for (const line of annotationLines(annotation)) {
        result.set(line, annotation);
      }
    }
    return result;
  }, annotations);

  const [codeLineHeight, setCodeLineHeight] = useState(0);
  const codeLineOffset = (line: number) => (line - 1) * codeLineHeight;
  useEffect(() => {
    const measure = () =>
      setCodeLineHeight(
        markersRef.current?.firstElementChild?.getBoundingClientRect()?.height || 0,
      );
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [markersRef.current]);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const codeBox = codeBoxRef.current;
    if (!codeBox) {
      return;
    }
    const { target } = e;
    if (target instanceof HTMLElement && target.closest('.annotation-info')) {
      return;
    }
    if (codeLineHeight) {
      const line = Math.floor((e.pageY - codeBox.offsetTop) / codeLineHeight) + 1;
      setActiveAnnotation(annotatedLines.get(line) ?? null);
    }
  };

  const annotationOffset = codeLineOffset(activeAnnotation?.line ?? 1);
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
          top: annotationOffset,
          height: codeLineOffset((activeAnnotation?.endLine ?? 1) + 1) - annotationOffset,
        }}
      >
        &nbsp;
      </div>
      <div
        className={`mask ${activeAnnotation ? 'mask-active' : ''}`}
        style={{
          height: annotationOffset,
        }}
      />
      <div
        className={`mask ${activeAnnotation ? 'mask-active' : ''}`}
        style={{
          top: codeLineOffset((activeAnnotation?.endLine ?? 1) + 1),
          bottom: 0,
        }}
      />
      <div className="annotation-markers" ref={markersRef}>
        <AnnotationMarkers annotations={annotations} />
      </div>
      <SyntaxHighlighter
        language="arduino"
        style={arduinoLight}
        customStyle={{
          marginTop: 0,
          padding: 0,
          background: 'transparent',
        }}
      >
        {code}
      </SyntaxHighlighter>
      {activeAnnotation && (
        <div
          className="annotation-info"
          style={{
            top: codeLineOffset(activeAnnotation.endLine + 1),
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
          overflow: auto;
          line-height: 1.5;
          position: relative;
          display: flex;
        }

        .annotation-markers {
          width: 8px;
        }

        .code-box :global(.marker) {
          position: relative;
          width: 4px;
          background: #00ffc3;
        }

        .code-box :global(pre) {
          position: relative;
        }

        .highlight {
          position: absolute;
          background: #00ffc3;
          width: 100%;
          transition: width 0.7s;
        }

        .mask {
          opacity: 0;
          position: absolute;
          background: var(--annotation-mask-color, white);
          width: 100%;
          top: 0;
          pointer-events: none;
        }

        .mask.mask-active {
          opacity: 0.6;
          transition: opacity 1s;
        }

        .annotation-info {
          position: absolute;
          background: white;
          padding: 0.5em;
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
