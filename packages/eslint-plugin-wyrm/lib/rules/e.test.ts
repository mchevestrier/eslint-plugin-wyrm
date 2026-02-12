import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './e.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `err` as a parameter name #docs',
      code: `
function foo(err) {
  return err;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `e` as an identifier in a simple variable declaration #docs',
      code: `
let e = 'foo';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Catch clause with object destructured parameter',
      code: `
try {
  foo();
} catch ({ message }) {
  console.error(message);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Catch clause with array destructured parameter',
      code: `
try {
  foo();
} catch ([first]) {
  console.error(first);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With object destructured parameter',
      code: `
function foo({ message }) {
  console.log(message);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With array destructured parameter',
      code: `
function foo([first, second]) {
  console.log(first, second);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function with rest parameter',
      code: `
const foo = (...args) => {
  console.log(args);
};
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Using `e` as a parameter name in a function declaration #docs',
      code: `
function foo(e: Error) {
  return e;
}
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
function foo(err: Error) {
  return err;
}
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
function foo(evt: Error) {
  return evt;
}
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
function foo(elt: Error) {
  return elt;
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `e` as a parameter name in an arrow function expression #docs (should use suggestion number 2)',
      code: `
const handleClick = (e: Event) => {
  console.log(e.target.value);
};
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
const handleClick = (err: Event) => {
  console.log(err.target.value);
};
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
const handleClick = (evt: Event) => {
  console.log(evt.target.value);
};
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
const handleClick = (elt: Event) => {
  console.log(elt.target.value);
};
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `e` as a parameter name in a `.map()` callback',
      code: `
[1, 2, 3].map(function (e) {
  return e + 2;
});
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
[1, 2, 3].map(function (err) {
  return err + 2;
});
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
[1, 2, 3].map(function (evt) {
  return evt + 2;
});
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
[1, 2, 3].map(function (elt) {
  return elt + 2;
});
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With other `e` identifiers out of the scope',
      code: `
const e = 42;
console.log(e);

function foo(e: Error) {
  if (e instanceof TypeError) {
    return e.message;
  }
  if (e instanceof SyntaxError) {
    return e.name;
  }

  return e.toString();
}

console.log(e);
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
const e = 42;
console.log(e);

function foo(err: Error) {
  if (err instanceof TypeError) {
    return err.message;
  }
  if (err instanceof SyntaxError) {
    return err.name;
  }

  return err.toString();
}

console.log(e);
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
const e = 42;
console.log(e);

function foo(evt: Error) {
  if (evt instanceof TypeError) {
    return evt.message;
  }
  if (evt instanceof SyntaxError) {
    return evt.name;
  }

  return evt.toString();
}

console.log(e);
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
const e = 42;
console.log(e);

function foo(elt: Error) {
  if (elt instanceof TypeError) {
    return elt.message;
  }
  if (elt instanceof SyntaxError) {
    return elt.name;
  }

  return elt.toString();
}

console.log(e);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With custom suggested alternatives in `options.alternatives`',
      options: [{ alternatives: ['error', 'element'] }],
      code: `
const e = 42;
console.log(e);

function foo(e: any) {
  console.log(e);
  return e;
}

console.log(e);
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'error' },
              output: `
const e = 42;
console.log(e);

function foo(error: any) {
  console.log(error);
  return error;
}

console.log(e);
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'element' },
              output: `
const e = 42;
console.log(e);

function foo(element: any) {
  console.log(element);
  return element;
}

console.log(e);
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `e` as a parameter name in `.catch()` method',
      code: `
await foo().catch((e) => {
  console.error(e);
});
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
await foo().catch((err) => {
  console.error(err);
});
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
await foo().catch((evt) => {
  console.error(evt);
});
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
await foo().catch((elt) => {
  console.error(elt);
});
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `e` as a parameter name in catch clause #docs',
      code: `
try {
  foo();
} catch (e) {
  console.error(e);
}
`,
      errors: [
        {
          messageId: 'noE',
          suggestions: [
            {
              messageId: 'useOther',
              data: { ident: 'err' },
              output: `
try {
  foo();
} catch (err) {
  console.error(err);
}
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'evt' },
              output: `
try {
  foo();
} catch (evt) {
  console.error(evt);
}
`,
            },
            {
              messageId: 'useOther',
              data: { ident: 'elt' },
              output: `
try {
  foo();
} catch (elt) {
  console.error(elt);
}
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
