import { extractCodeAnnotations } from './gac-annotations';

describe('extractCodeAnnotations', () => {
  it('should split the given source file into Code and GAC annotations', () => {
    const input = `
      /* gac: simple annotation */
      int speakerPin = 7;

      /* gac: This annotation applies for
        a single line
      */
      /* This is a standard comment */
      void setup() {}

      /* gac:start
        This is the loop function...
      */
      void loop() {

      }
      /* gac:end */
    `;

    const expectedCode = `
      int speakerPin = 7;

      /* This is a standard comment */
      void setup() {}

      void loop() {

      }
    `;

    expect(extractCodeAnnotations(input)).toEqual({
      code: expectedCode,
      annotations: [
        {
          line: 2,
          endLine: 2,
          value: 'simple annotation',
        },
        {
          line: 4,
          endLine: 4,
          value: 'This annotation applies for\na single line',
        },
        { line: 7, endLine: 9, value: 'This is the loop function...' },
      ],
    });
  });

  it('should handle CRLF in annotations', () => {
    const input = '/* gac: hello\r\nworld */\r\nTest';

    expect(extractCodeAnnotations(input)).toEqual({
      code: 'Test',
      annotations: [
        {
          line: 1,
          endLine: 1,
          value: 'hello\nworld',
        },
      ],
    });
  });

  it('should correctly parse single line gac:start annotation', () => {
    const input = '/*gac:start single line*/\nTest\nLine 2\n/* gac:end*/';

    expect(extractCodeAnnotations(input)).toEqual({
      code: 'Test\nLine 2',
      annotations: [
        {
          line: 1,
          endLine: 2,
          value: 'single line',
        },
      ],
    });
  });
});
