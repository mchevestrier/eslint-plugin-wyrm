import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import * as jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-unassigned-todo.js';

const ruleTester = new RuleTester({
  plugins: { markdown: markdownPlugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Assigned TODO comment #docs',
      code: `
// TODO(foo)
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assigned TODO comment with space',
      code: `
// TODO(foo bar)
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assigned TODO comment with description',
      code: `
// TODO(foo): You can't index the bus without quantifying the neural AGP program
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assigned Todo comment',
      code: `
// Todo(foo)
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a TODO comment',
      code: `
// Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a TODO comment either',
      code: `
// Todos los seres humanos nacen libres e iguales en dignidad y derechos y, dotados como están de razón y conciencia, deben comportarse fraternalmente los unos con los otros.
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TO*DO comment',
      code: `
// TO*DO
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc `@todo` tag',
      code: `
/**
 * @todo You can't index the bus without quantifying the neural AGP program
 */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  // TODO(foo)
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a YAML file',
      filename: 'foo.yml',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# TODO(foo)
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a Markdown file',
      filename: 'foo.md',
      // 'language' is not supported by typings, but still transmitted
      // @ts-expect-error - 'language' does not exist in type 'ValidTestCase'
      language: 'markdown/commonmark',
      code: `
# TODO
<!-- TODO -->
`,
      after() {
        // Not formatted
      },
    },
  ],
  invalid: [
    {
      name: 'Unassigned TODO comment #docs',
      code: `
// TODO
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned TODO comment with empty detail',
      code: `
// TODO(): You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned TODO block comment',
      code: `
/*
 TODO
*/
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned TODO block comment with leading asterisk',
      code: `
/*
 * TODO
 */
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned TODO in JSDoc comment, but not a JSDoc tag',
      code: `
/**
 * todo: You can't index the bus without quantifying the neural AGP program
 */
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned TODO comment with description',
      code: `
// TODO: You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned Todo comment',
      code: `
// Todo
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unassigned ToDo comment',
      code: `
// ToDo
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with no closing parenthesis',
      code: `
// TODO(
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with no opening parenthesis',
      code: `
// TODO)
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with leading asterisk',
      code: `
// *TODO
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with leading asterisk and no space',
      code: `
//*TODO
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO :)',
      code: `
// TODO :)
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assigned TODO but not in starting position',
      code: `
// TODO: replace by TODO(ok)
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  // TODO
}
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a YAML file',
      filename: 'foo.yml',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# TODO
`,
      errors: [{ messageId: 'noUnassignedComment' }],
      after() {
        // Not formatted
      },
    },
  ],
});
