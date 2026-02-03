import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-iife.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Useful IIFE #docs',
      code: `
const foo = (() => {
  if (bar) return 42;
  if (baz) return 17;
  return 105;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE (with `else`)',
      code: `
const foo = (() => {
  if (bar) return 42;
  if (baz) return 17;
  else return 105;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE (with `try`)',
      code: `
const foo = (async () => {
  try {
    return 42;
  } catch {
    return 105;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE (with `for of`)',
      code: `
const foo = (async () => {
  for (const x of bar) {
    if (x) return x;
  }
  return x;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE (with function declaration)',
      code: `
const foo = (() => {
  return quux();

  function quux() {
    return 42;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE (`await` expression in Program root)',
      code: `
(async () => {
  await foo();
  debugger;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Async IIFE in Block in Program root',
      code: `
{
  (async () => {
    await foo();
  })();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `if`)',
      code: `
(async () => {
  if (bar) {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `try`)',
      code: `
(async () => {
  try {
    await foo();
  } finally {
    console.log('done');
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `catch`)',
      code: `
(async () => {
  try {
    console.log('trying');
  } catch {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `finally`)',
      code: `
(async () => {
  try {
    console.log('trying');
  } finally {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `while`)',
      code: `
(async () => {
  while (bar) {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `do while`)',
      code: `
(async () => {
  do {
    await foo();
  } while (bar);
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `switch` and `await` in discriminant)',
      code: `
(async () => {
  switch (await foo()) {
    case 1:
      break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `switch` and `await` in case test)',
      code: `
declare const quux: number;
(async () => {
  switch (quux) {
    case await foo():
      break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `switch` and `await` in case consequent block)',
      code: `
declare const quux: number;
(async () => {
  switch (quux) {
    case 1:
      await foo();
      break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for` and `await` in body)',
      code: `
(async () => {
  for (let i = 0; i < 42; i++) {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for` and `await` in init)',
      code: `
(async () => {
  for (let i = await foo(); i < 42; i++) {
    break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for` and `await` in test)',
      code: `
(async () => {
  for (let i = 0; i < (await foo()); i++) {
    break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for` and `await` in update)',
      code: `
(async () => {
  for (let i = 0; i < 42; i += await foo()) {
    break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for of` and `await` in body)',
      code: `
(async () => {
  for (const x of bar) {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for of` and `await` in right side)',
      code: `
(async () => {
  for (const x of await foo()) {
    continue;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for await`)',
      code: `
(async () => {
  for await (const x of bar) {
    foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for in` and `await` in body)',
      code: `
(async () => {
  for (const x in bar) {
    await foo();
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `for in` and `await` in right side)',
      code: `
(async () => {
  for (const x in await foo()) {
    break;
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `switch`)',
      code: `
(async () => {
  switch (bar) {
    case 1:
      await foo();
    default:
      console.log('ok');
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `yield`)',
      code: `
(async () => {
  yield await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `enum`)',
      code: `
(async () => {
  enum Foo {
    BAR = await foo(),
    BAZ = 'baz',
  }
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `satisfies`)',
      code: `
(async () => {
  (await foo()) satisfies string;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with `as`)',
      code: `
(async () => {
  (await foo()) as string;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with non null assertion)',
      code: `
(async () => {
  (await foo())!;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with chain expression)',
      code: `
(async () => {
  (await foo())?.bar.baz;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with object expression)',
      code: `
(async () => {
  const obj = {
    bar: await foo(),

    get baz() {
      return 42;
    },

    [await foo()]: 105,
  };
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with variable declarations)',
      code: `
(async () => {
  let bar = await foo(),
    baz = 42;
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with return statement)',
      code: `
(async () => {
  if (1) return await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with named export)',
      code: `
(async () => {
  export const quux = await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with array expression)',
      code: `
(async () => {
  const baz = [await foo(), quux];
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with call expression and `await` in callee)',
      code: `
(async () => {
  (await foo())();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with call expression and `await` in argument)',
      code: `
(async () => {
  quux(await foo());
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with call expression and `await` in rest argument)',
      code: `
(async () => {
  quux(42, ...(await foo()));
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with assignment expression)',
      code: `
let baz;
(async () => {
  baz = await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful async IIFE (with conditional expression)',
      code: `
let baz;
(async () => {
  1 ? 0 : await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless IIFE with empty body',
      code: `
const x = (() => {})(); // Should just be: const x = undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful IIFE in JSX expression container',
      code: `
function MyComponent() {
  return (
    <div>
      <div>
        {(() => {
          if (1) return 1;
          if (2) return 2;
          if (3) return 3;
          return 4;
        })()}
      </div>
    </div>
  );
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless IIFE with arrow function #docs (expression body)',
      code: `
const x = (() => 2)();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const x = 2;
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
      name: 'Useless IIFE with arrow function (block body)',
      code: `
const x = (() => {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const x = 2;
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
      name: 'Useless IIFE with arrow function and empty return',
      code: `
const x = (() => {
  return;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const x = undefined;
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
      name: 'Useless IIFE with unnamed function expression',
      code: `
const x = (function () {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const x = 2;
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
      name: 'Useless IIFE with named function expression',
      code: `
const x = (function fn() {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const x = 2;
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
      name: 'Useless IIFE (await expression in async function)',
      code: `
async function quux() {
  (async () => {
    await foo();
  })();
}
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
async function quux() {
  {
    await foo();
  }
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
      name: 'Useless awaited async IIFE (await expression in async function)',
      code: `
async function quux() {
  await (async () => {
    await foo();
  })();
}
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
async function quux() {
  {
    await foo();
  }
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
      name: 'Useless IIFE (await expression in async arrow function)',
      code: `
const quux = async () => {
  (async () => {
    await foo();
  })();
};
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const quux = async () => {
  {
    await foo();
  }
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
      name: 'Useless IIFE (await expression in async function expression)',
      code: `
const quux = async function () {
  (async () => {
    await foo();
  })();
};
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
const quux = async function () {
  {
    await foo();
  }
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
      name: 'Useless IIFE (wrapped imperative logic) #docs',
      code: `
function quux() {
  (() => {
    foo();
    bar();
    baz();
  })();
}
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
function quux() {
  {
    foo();
    bar();
    baz();
  }
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
      name: 'Useless IIFE (async in Program root but no `await` expression)',
      code: `
(async () => {
  foo();
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  foo();
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
      name: 'Useless async IIFE (with `while` and `do while` loops)',
      code: `
(async () => {
  while (bar) {
    debugger;
  }

  do {
    foo();
  } while (bar);
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  while (bar) {
    debugger;
  }

  do {
    foo();
  } while (bar);
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
      name: 'Useless async IIFE (with conditions)',
      code: `
(async () => {
  if (bar) {
    debugger;
  } else {
    foo();
  }

  1 ? foo() : 0;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  if (bar) {
    debugger;
  } else {
    foo();
  }

  1 ? foo() : 0;
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
      name: 'Useless async IIFE (with `for` loops)',
      code: `
(async () => {
  for (let i = 0; i < 0; i++) {
    debugger;
  }

  for (const item of arr) {
    break;
  }

  for (const key in obj) {
    continue;
  }
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  for (let i = 0; i < 0; i++) {
    debugger;
  }

  for (const item of arr) {
    break;
  }

  for (const key in obj) {
    continue;
  }
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
      name: 'Useless async IIFE (with `switch` statement)',
      code: `
(async () => {
  switch (1) {
    case 1:
      break;

    case 2:
      debugger;

    default:
      continue;
  }
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  switch (1) {
    case 1:
      break;

    case 2:
      debugger;

    default:
      continue;
  }
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
      name: 'Useless async IIFE (with `try` statement)',
      code: `
(async () => {
  try {
    JSON.parse('42');
  } catch (err) {
    console.error(err);
    console.error('Oops');
  } finally {
    debugger;
  }
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  try {
    JSON.parse('42');
  } catch (err) {
    console.error(err);
    console.error('Oops');
  } finally {
    debugger;
  }
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
      name: 'Useful async IIFE (with object expression)',
      code: `
(async () => {
  const obj = {
    bar: foo(),

    get baz() {
      return 42;
    },

    [foo()]: 105,
  };
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  const obj = {
    bar: foo(),

    get baz() {
      return 42;
    },

    [foo()]: 105,
  };
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
      name: 'Useful async IIFE (with call expression)',
      code: `
(async () => {
  quux(42);
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  quux(42);
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
      name: 'Useless async IIFE (various statements but no `await` expression)',
      code: `
(async () => {
  debugger;
  continue;
  break;
  import('./foo').then((mod) => mod);
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  debugger;
  continue;
  break;
  import('./foo').then((mod) => mod);
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
      name: 'Useless async IIFE (with export declarations)',
      code: `
(async () => {
  export const foo = 'bar';
  export {};
  export default foo;
  export * as quux from './quux';
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  export const foo = 'bar';
  export {};
  export default foo;
  export * as quux from './quux';
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
      name: 'Useless async IIFE (with various declarations)',
      code: `
(async () => {
  interface Foo {}
  class Klass {
    async method() {
      await foo();
    }
  }
  async function foo() {
    return Promise.resolve(42);
  }
  const bar = async () => 105;
  const baz = function () {};
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
{
  interface Foo {}
  class Klass {
    async method() {
      await foo();
    }
  }
  async function foo() {
    return Promise.resolve(42);
  }
  const bar = async () => 105;
  const baz = function () {};
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
      name: 'Useless IIFE (in method)',
      code: `
class Klass {
  method() {
    (async () => {
      foo();
    })();
  }
}
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `
class Klass {
  method() {
    {
      foo();
    }
  }
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
