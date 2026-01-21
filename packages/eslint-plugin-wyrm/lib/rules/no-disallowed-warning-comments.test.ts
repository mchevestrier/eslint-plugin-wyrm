import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-disallowed-warning-comments.js';

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
      name: 'Normal comment',
      code: `
// You can't index the bus without quantifying the neural AGP program
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment #docs',
      code: `
// TODO
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO block comment',
      code: `
/*
 TODO
*/
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc `@todo` tag',
      code: `
/** @todo */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TODO comment with description',
      code: `
// TODO: You can't index the bus without quantifying the neural AGP program
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assigned TODO comment',
      code: `
// TODO(foo)
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
      name: 'Not a TODO comment',
      code: `
// Todos los seres humanos nacen libres e iguales en dignidad y derechos y, dotados como están de razón y conciencia, deben comportarse fraternalmente los unos con los otros.
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a HACK comment',
      code: `
// Hacking the matrix
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIXME in single line JSDoc comment',
      code: `
/** FIXME */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIXME in multiline JSDoc comment with leading asterisk',
      code: `
/**
 * FIXME
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
  // TODO
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
# TODO
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
# FIXME
<!-- FIXME -->
`,
      after() {
        // Not formatted
      },
    },
  ],
  invalid: [
    {
      name: 'FIXME comment #docs',
      code: `
// FIXME
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIXME comment with description',
      code: `
// FIXME: You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FixMe comment',
      code: `
// FixMe
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'HACK comment',
      code: `
// HACK
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'HACK comment with !!!',
      code: `
// HACK!!!
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'HACK comment #docs with description',
      code: `
// HACK: You can't index the bus without quantifying the neural AGP program
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'XXX comment',
      code: `
// XXX
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TOOD comment #docs',
      code: `
// TOOD
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'ToDo comment #docs',
      code: `
// ToDo
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'ToDo comment (with suffix)',
      code: `
// ToDo: do stuff
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIXME block comment',
      code: `
/*
 FIXME
*/
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIXME in multiline JSDoc comment',
      code: `
/**
 FIXME
 */
`,
      errors: [{ messageId: 'noDisallowedWarningComment' }],
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
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      code: `
{
  // FIXME
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
      errors: [{ messageId: 'noDisallowedWarningComment' }],
      code: `
# FIXME
`,
      after() {
        // Not formatted
      },
    },
  ],
});
