import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-return-undefined.js';

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
      name: 'With no return from `forEach` callback',
      code: `
[1, 2, 3].forEach((it) => {
  console.log(it);
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callback is not passed to anything',
      code: `
const cb = (it): void => {
  return undefined;
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty return from `forEach` callback',
      code: `
[1, 2, 3].forEach((it) => {
  return;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-undefined return from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  return 42;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with cleanup function and empty return',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => {
  if (Math.cos(0)) return;
  return () => {
    console.log('cleanup');
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with cleanup function',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => {
  if (Math.cos(0)) return undefined;
  return () => {
    console.log('cleanup');
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with empty body',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => {});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with cleanup function and some returned values',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => {
  if (Math.cos(0)) return 42;
  return () => {
    console.log('cleanup');
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inline body but not returning an identifier',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => 42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inline body returning an identifier but not `undefined`',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee does not accept a void-returning callback',
      code: `
function foo(fn: () => undefined) {
  fn();
}
foo(() => undefined);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee accepts an `any` typed callback',
      code: `
function foo(fn: any) {
  fn();
}
foo(() => undefined);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee accepts no argument',
      code: `
function foo() {}
foo(() => undefined);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With `return undefined` from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  console.log(it);
  return undefined;
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
[1, 2, 3].forEach(function (it) {
  console.log(it);
  return undefined;
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a block body',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => {
  return undefined;
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union type with `void`',
      code: `
function foo(fn: () => void | string) {
  fn();
}
foo(() => {
  return undefined;
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `return undefined` and an empty return',
      code: `
function foo(fn: (() => void) | (() => string)) {
  fn();
}
foo(() => {
  if (Math.random()) return;
  return undefined;
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inline body',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => undefined);
`,
      errors: [{ messageId: 'noArrowReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `while` loop',
      code: `
[1, 2].forEach((it) => {
  while (1) {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `do while` loop',
      code: `
[1, 2].forEach((it) => {
  do {
    return undefined;
  } while (1);
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for` loop',
      code: `
[1, 2].forEach((it) => {
  for (let i = 0; i < it; i++) {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for...in` loop',
      code: `
[1, 2].forEach((it) => {
  for (let k in it) {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for...of` loop',
      code: `
[1, 2].forEach((it) => {
  for (let n of [it]) {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `try` block',
      code: `
[1, 2].forEach((it) => {
  try {
    return undefined;
  } catch {
    console.log('oh no!');
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `catch` block',
      code: `
[1, 2].forEach((it) => {
  try {
    JSON.parse('{');
  } catch {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `finally` block',
      code: `
[1, 2].forEach((it) => {
  try {
    JSON.parse('{}');
  } finally {
    return undefined;
  }
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with no cleanup function',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => {
  if (Math.cos(0)) return undefined;
  console.log('ok');
});
`,
      errors: [{ messageId: 'noUselessReturnUndefined' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`useEffect()` with inline `undefined` return',
      code: `
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
declare function useEffect(effect: EffectCallback): void;

useEffect(() => undefined);
`,
      errors: [{ messageId: 'noArrowReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
