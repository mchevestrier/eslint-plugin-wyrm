import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-early-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With early returns #docs',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;
  if (cond2) return 105;
  return 0;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no body',
      code: `
const foo = () => 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several statements in consequent block',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (cond2) {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  return 0;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single line `if` statement with an alternate branch',
      code: `
function foo(cond1: boolean) {
  if (cond1) console.log(42);
  else console.log(0);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `if` statement that might sometimes return',
      code: `
function foo(cond1: boolean) {
  if (cond1) {
    for (const item in {}) {
      if (item === 'quux') return;
    }
  } else console.log(0);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a an else-if chain followed by another statement',
      code: `
function foo(cond1: boolean) {
  if (foo === 'foo') {
    console.log('foo');
  } else if (bar === 'bar') {
    console.log('bar');
    console.log('bar');
    console.log('bar');
  } else if (quux === 'quux') {
    console.log('quux');
  } else {
    console.log('other');
  }

  console.log('always logged');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no returns in if statement at all',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    if (Math.cos(0) > 0.5) console.log(333);
    console.log(42);
  }

  return 17;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try`/`catch`/`finally` statement where `catch` does not always return',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    console.log(105);
  } else {
    try {
      return JSON.parse('{}');
    } catch {
      console.log('Oops');
    } finally {
      console.log('done');
    }
  }

  return 17;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try`/`finally` statement where `finally` does not always return',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    console.log(105);
  } else {
    try {
      return JSON.parse('{}');
    } finally {
      console.log('done');
    }
  }

  return 17;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a returned complex expression',
      code: `
function foo(cond1: boolean, bar: string) {
  if (cond1) {
    return bar.toUpperCase().at(2) === bar.toLowerCase().at(2);
  }

  return 17;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping `if` statement and a single line consequent',
      code: `
function foo(cond1: boolean, bar: string) {
  if (cond1) {
    throw Error(bar);
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a conditional return in consequent block',
      code: `
function fun(foo: number | null, fallback: number) {
  if (foo) {
    const bar = foo + 2;
    if (bar) return bar;
  }
  return fallback;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a switch statement in alternate branch that sometimes returns',
      code: `
function foo(cond1: boolean, bar: string) {
  if (cond1) {
    console.log('ok');
  } else {
    switch (bar) {
      case 'a':
        return 1;
      case 'b':
        console.log('not returning');
        break;
      default:
        return 3;
    }
  }

  console.log('after');
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Condition with more code than the alternate branch #docs',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more statements',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  console.log('Hello');
  if (!Math.random()) return 17;

  if (cond1) {
    if (cond2) {
      return 105;
    }
    return 0;
  }
  console.log(42);
  return 42;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  console.log('Hello');
  if (!Math.random()) return 17;

  if (!(cond1)) {
    console.log(42);
    return 42;
  } else {
    if (cond2) {
      return 105;
    }
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function',
      code: `
const foo = (cond1: boolean, cond2: boolean) => {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
};
`,
      output: `
const foo = (cond1: boolean, cond2: boolean) => {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
};
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
const foo = function (cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
};
`,
      output: `
const foo = function (cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
};
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a return statement in the alternate block only #docs',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  } else {
    console.log('ok');
    return 42;
  }

  console.log(17);

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    console.log('ok');
    return 42;
  } else {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  }

  console.log(17);

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a long consequent block and a short alternate block',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
      return 105;
    }
    if (shouldLogZero()) {
      console.log(0);
    }

    return 17;

    // Return isn't always the last statement
    function shouldLogZero() {
      return Math.random() > 0.5;
    }
  } else {
    quux();
    return 42;
    function quux() {}
  }
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    quux();
    return 42;
    function quux() {}
  } else {
    if (cond2) {
      console.log(105);
      return 105;
    }
    if (shouldLogZero()) {
      console.log(0);
    }

    return 17;

    // Return isn't always the last statement
    function shouldLogZero() {
      return Math.random() > 0.5;
    }
  }
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping if statement',
      code: `
function foo(cond1: boolean) {
  if (cond1) {
    console.log(42);
    console.log(105);
  }
}
`,
      output: `
function foo(cond1: boolean) {
  if (!(cond1)) { return; } else {
    console.log(42);
    console.log(105);
  }
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With conditional returns in alternate branch only',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    if (Math.cos(0) > 0.5) return 333;
    else return 42;
  }

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    if (Math.cos(0) > 0.5) return 333;
    else return 42;
  } else {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try` statement in an `else` branch that always returns',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    }
  }

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    }
  } else {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try`/`finally` statement where `finally` always returns',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    console.log(105);
  } else {
    try {
      JSON.parse('{}');
    } finally {
      return 'Oops';
    }
  }

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    try {
      JSON.parse('{}');
    } finally {
      return 'Oops';
    }
  } else {
    console.log(105);
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try`/`catch`/`finally` statement where `try` and `catch` always return',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    console.log(105);
  } else {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    } finally {
      console.log('done');
    }
  }

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    } finally {
      console.log('done');
    }
  } else {
    console.log(105);
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try`/`catch`/`finally` statement where `finally` always returns',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    console.log(105);
  } else {
    try {
      return JSON.parse('{}');
    } catch {
      console.log('Oops');
    } finally {
      return {};
    }
  }

  return 17;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    try {
      return JSON.parse('{}');
    } catch {
      console.log('Oops');
    } finally {
      return {};
    }
  } else {
    console.log(105);
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With too many statements in consequent block',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (cond2) {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  return 0;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (!(cond2)) {
    return 0;
  } else {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` and a `while` loop in the consequent block',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (cond2) {
    while (Math.cos(0)) {
      for (const key in Math) {
        console.log('ok');
      }
    }

    do {
      for (const key in Math) {
        console.log('ok');
      }
    } while (Math.cos(0));

    for (let i = 0; i < 3; i++) {
      console.log('ok');
    }

    for (const item of []) {
      console.log('ok');
    }

    return 105;
  }

  return 0;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (!(cond2)) {
    return 0;
  } else {
    while (Math.cos(0)) {
      for (const key in Math) {
        console.log('ok');
      }
    }

    do {
      for (const key in Math) {
        console.log('ok');
      }
    } while (Math.cos(0));

    for (let i = 0; i < 3; i++) {
      console.log('ok');
    }

    for (const item of []) {
      console.log('ok');
    }

    return 105;
  }

  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a negated condition test',
      code: `
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
}
`,
      output: `
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a conjunction in the condition test',
      code: `
function foo(foo: number, bar: number) {
  if (foo === 37 && 3 > bar) {
    if (512 > bar) return 105;
    return 0;
  }
  return 42;
}
`,
      output: `
function foo(foo: number, bar: number) {
  if (foo !== 37 || 3 <= bar) {
    return 42;
  } else {
    if (512 > bar) return 105;
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a disjunction in the condition test',
      code: `
function foo(foo: number, bar: number) {
  if (37 != foo || bar >= 3) {
    if (512 > bar) return 105;
    return 0;
  }
  return 42;
}
`,
      output: `
function foo(foo: number, bar: number) {
  if (37 == foo && bar < 3) {
    return 42;
  } else {
    if (512 > bar) return 105;
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping `if` statement with an alternate branch',
      code: `
function foo(cond1: boolean) {
  if (cond1) {
    try {
      console.log(42);
    } catch {
      console.log(105);
    }
  } else {
    console.log(0);
  }
}
`,
      output: `
function foo(cond1: boolean) {
  if (cond1) {
    try {
      console.log(42);
    } catch {
      console.log(105);
    }
    return;
  } else {
    console.log(0);
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an empty `if` statement with an alternate branch',
      code: `
function foo(cond1: boolean) {
  if (cond1) {
  } else {
    console.log(0);
    console.log(0);
    console.log(0);
  }
}
`,
      output: `
function foo(cond1: boolean) {
  if (cond1) {
    return;
  } else {
    console.log(0);
    console.log(0);
    console.log(0);
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping single-line `if` statement with an alternate branch',
      code: `
function foo(cond1: boolean) {
  if (cond1)
    for (const _ of []) {
      console.log(42);
      console.log(105);
    }
  else {
    console.log(0);
  }
}
`,
      output: `
function foo(cond1: boolean) {
  if (cond1)
    {
    for (const _ of []) {
      console.log(42);
      console.log(105);
    }
    return;
  }
  else {
    console.log(0);
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'else-if chain as the only statement',
      code: `
function fun(foo: string, bar: string, quux: string) {
  if (foo === 'foo') {
    console.log('foo');
  } else if (bar === 'bar') {
    console.log('bar');
    console.log('bar');
    console.log('bar');
  } else if (quux === 'quux') {
    console.log('quux');
  } else {
    console.log('other');
  }
}
`,
      output: `
function fun(foo: string, bar: string, quux: string) {
  if (foo === 'foo') {
    console.log('foo');
    return;
  } else if (bar === 'bar') {
    console.log('bar');
    console.log('bar');
    console.log('bar');
  } else if (quux === 'quux') {
    console.log('quux');
  } else {
    console.log('other');
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'else-if chain as the last statement',
      code: `
function fun(foo: string, bar: string, quux: string) {
  if (foo === 'foo') {
    console.log('foo');
    return;
  }

  if (bar === 'bar') {
    console.log('bar');
    console.log('bar');
    console.log('bar');
  } else if (quux === 'quux') {
    console.log('quux');
  } else {
    console.log('other');
  }
}
`,
      output: `
function fun(foo: string, bar: string, quux: string) {
  if (foo === 'foo') {
    console.log('foo');
    return;
  }

  if (bar === 'bar') {
    console.log('bar');
    console.log('bar');
    console.log('bar');
    return;
  } else if (quux === 'quux') {
    console.log('quux');
  } else {
    console.log('other');
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a switch statement in alternate branch that always returns',
      code: `
function foo(cond1: boolean, bar: string) {
  if (cond1) {
    console.log('ok');
  } else {
    switch (bar) {
      case 'a':
        return 1;
      case 'b':
        return 2;
      default:
        return 3;
    }
  }

  console.log('after');
}
`,
      output: `
function foo(cond1: boolean, bar: string) {
  if (!(cond1)) {
    switch (bar) {
      case 'a':
        return 1;
      case 'b':
        return 2;
      default:
        return 3;
    }
  } else {
    console.log('ok');
  }

  console.log('after');
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a deeply nested statement after the last subsequent return statement',
      code: `
function foo(foo: number, bar: number) {
  if (foo === 37 && 3 > bar) {
    if (512 > bar) return 105;
    return 0;
  }
  return 42;

  function fnord() {
    for (const _1 of []) {
      for (const _2 of []) {
        for (const _2 of []) {
        }
      }
    }
  }
}
`,
      output: `
function foo(foo: number, bar: number) {
  if (foo !== 37 || 3 <= bar) {
    return 42;
  } else {
    if (512 > bar) return 105;
    return 0;
  }
  

  function fnord() {
    for (const _1 of []) {
      for (const _2 of []) {
        for (const _2 of []) {
        }
      }
    }
  }
}
`,
      errors: [{ messageId: 'preferReversedEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
