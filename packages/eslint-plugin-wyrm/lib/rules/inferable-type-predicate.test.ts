import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './inferable-type-predicate.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      project: './tsconfig.json',
      projectService: false,
      tsconfigRootDir: path.join(import.meta.dirname, './fixtures'),
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Not a type guard #docs',
      code: `
function isString(x: unknown) {
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type predicate is not inferable #docs',
      code: `
function isNotString(x: unknown): x is null {
  return typeof x !== 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several return statements',
      code: `
function isString(x: unknown): x is string {
  if (Math.random()) {
    return typeof x === 'string';
  }
  return typeof x === 'string';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'String literal inequality',
      code: `
function isString(x: unknown): x is string {
  return x !== 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Weak equality',
      code: `
function isString(x: unknown): x is string {
  return x == 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Null inequality when the parameter type is unknown',
      code: `
function isString(x: unknown): x is string {
  return x !== null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Inferable type predicate #docs',
      code: `
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
`,
      output: `
function isString(x: unknown) {
  return typeof x === 'string';
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type predicate in a callback #docs',
      code: `
[1, 2, 3, null, 5].filter((x): x is string => typeof x === 'string');
`,
      output: `
[1, 2, 3, null, 5].filter((x) => typeof x === 'string');
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Null inequality when the parameter type is a union #docs',
      code: `
[1, 2, 3, null, 5].filter((x): x is number => x !== null);
`,
      output: `
[1, 2, 3, null, 5].filter((x) => x !== null);
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Undefined inequality when the parameter type is a union #docs',
      code: `
[1, 2, 3, undefined, 5].filter((x): x is number => x !== undefined);
`,
      output: `
[1, 2, 3, undefined, 5].filter((x) => x !== undefined);
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish inequality when the parameter type is a union #docs',
      code: `
[1, 2, 3, undefined, 5].filter((x): x is number => x != null);
`,
      output: `
[1, 2, 3, undefined, 5].filter((x) => x != null);
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'String literal equality #docs',
      code: `
function isString(x: unknown): x is string {
  return x === 'foo';
}
`,
      output: `
function isString(x: unknown) {
  return x === 'foo';
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Number literal equality #docs',
      code: `
function isString(x: unknown): x is number {
  return x === 42;
}
`,
      output: `
function isString(x: unknown) {
  return x === 42;
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Boolean literal equality #docs',
      code: `
function isString(x: unknown): x is boolean {
  return x === false;
}
`,
      output: `
function isString(x: unknown) {
  return x === false;
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Null equality #docs',
      code: `
function isString(x: unknown): x is null {
  return x === null;
}
`,
      output: `
function isString(x: unknown) {
  return x === null;
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Undefined equality #docs',
      code: `
function isString(x: unknown): x is undefined {
  return x === undefined;
}
`,
      output: `
function isString(x: unknown) {
  return x === undefined;
}
`,
      errors: [{ messageId: 'noInferableTypePredicate' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
