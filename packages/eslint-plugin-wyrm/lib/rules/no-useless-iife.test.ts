import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-iife.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Useful IIFE #docs',
      code: `const foo = (() => {
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
      code: `const foo = (() => {
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
      name: 'Useful IIFE (`await` expression in Program root)',
      code: `(async () => {
  await foo();
})();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Async IIFE in Block in Program root',
      code: `{
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
      name: 'Useless IIFE with empty body',
      code: `const x = (() => {})(); // Should just be: const x = undefined;
`,
    },
  ],
  invalid: [
    {
      name: 'Useless IIFE with arrow function #docs (expression body)',
      code: `const x = (() => 2)();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `const x = 2;
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
      code: `const x = (() => {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `const x = 2;
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
      code: `const x = (() => {
  return;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `const x = undefined;
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
      code: `const x = (function () {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `const x = 2;
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
      code: `const x = (function fn() {
  return 2;
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `const x = 2;
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
      code: `async function quux() {
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
              output: `async function quux() {
  {
    await foo();
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
      name: 'Useless IIFE (await expression in async arrow function)',
      code: `const quux = async () => {
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
              output: `const quux = async () => {
  {
    await foo();
  };
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
      code: `const quux = async function () {
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
              output: `const quux = async function () {
  {
    await foo();
  };
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
      code: `function quux() {
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
              output: `function quux() {
  {
    foo();
    bar();
    baz();
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
      name: 'Useless IIFE (async in Program root but no `await` expression)',
      code: `(async () => {
  foo();
})();
`,
      errors: [
        {
          messageId: 'noUselessIIFE',
          suggestions: [
            {
              messageId: 'removeIIFE',
              output: `{
  foo();
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
  ],
});
