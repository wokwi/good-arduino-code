export interface IGACAnnotation {
  line: number;
  endLine: number;
  value: string;
}

const keywords = {
  gac: 'gac:',
  gacStart: 'gac:start',
  gacEnd: 'gac:end',
} as const;

export function extractCodeAnnotations(source: string) {
  const code = [];
  const annotations: IGACAnnotation[] = [];
  let lineNumber = 1;
  let currentIndent = 0;
  let currentAnnotation: IGACAnnotation | null = null;
  let insideComment = false;
  let insideSection = false;
  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('/*')) {
      const firstWord = trimmed.substr(2).trim().split(' ')[0];
      if (firstWord === keywords.gac || firstWord === keywords.gacStart) {
        insideComment = true;
        insideSection = firstWord === keywords.gacStart;
        const content = trimmed
          .substr(trimmed.indexOf(firstWord) + firstWord.length)
          .trim()
          .replace(/\s*\*\/.*$/s, '');
        currentAnnotation = {
          line: lineNumber,
          endLine: lineNumber,
          value: content,
        };
        annotations.push(currentAnnotation);
        if (trimmed.includes('*/') && !insideSection) {
          insideComment = false;
          currentAnnotation = null;
        }
        currentIndent = line.indexOf(firstWord);
        continue;
      }
      if (firstWord === keywords.gacEnd && currentAnnotation) {
        currentAnnotation.endLine = lineNumber - 1;
        currentAnnotation = null;
        continue;
      }
    }
    if (insideComment && currentAnnotation) {
      const content = line
        .replace(new RegExp(`^ {0,${currentIndent}}`), '')
        .replace(/\s*\*\/.*$/s, '');
      currentAnnotation.value += '\n' + content;
      if (trimmed.startsWith('*/') || trimmed.endsWith('*/')) {
        currentAnnotation.value = currentAnnotation.value.trim();
        insideComment = false;
        if (!insideSection) {
          currentAnnotation = null;
        }
      }
      continue;
    }
    code.push(line);
    lineNumber++;
  }
  return {
    code: code.join('\n'),
    annotations,
  };
}
