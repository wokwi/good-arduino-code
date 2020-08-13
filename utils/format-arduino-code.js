/**
 * A small command-line utility used by the git pre-commit hook
 * to automatically format the code.
 */

const { format } = require('astyle');
const { promises: fs } = require('fs');

// Source: https://github.com/arduino/Arduino/blob/ide-1.5.x/build/shared/lib/formatter.conf
const ARDUINO_FORMAT_RULES = [
  'mode=c',
  'indent=spaces=2',
  'indent-preprocessor',
  'indent-classes',
  'indent-switches',
  'indent-cases',
  'indent-col1-comments',
  'pad-oper',
  'pad-header',
  'keep-one-line-statements',
  'remove-comment-prefix',
].join(' ');

async function main() {
  for (const file of process.argv.slice(2)) {
    const source = await fs.readFile(file, 'utf-8');
    console.log(file);
    const formatted = await format(source, ARDUINO_FORMAT_RULES);
    if (source !== formatted) {
      console.log(`* Formating ${file}`);
      await fs.writeFile(file, formatted);
    }
  }
}

main();
