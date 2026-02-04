import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-intermediary-variable.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No useless intermediary variable #docs',
      code: `
const bar = 42;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a parameter name',
      code: `
function fun(foo: string) {
  const bar = foo;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With parameter destructuring',
      code: `
function fun(foo: unknown) {
  const { bar } = foo;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With destructuring',
      code: `
const foo = { bar: 42 };
const { bar } = foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With property access on parameter',
      code: `
function fun(foo: unknown) {
  const bar = foo.key;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With computed property access',
      code: `
const foo = quux();
const bar = foo[key];
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Variable initialization value is not a simple identifier',
      code: `
const foo = 42;
const bar = foo - 3;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Destructuring assignment and initialization with trivial property access',
      code: `
const foo = [];
const { __proto__ } = foo.length;
return __proto__;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With another reference to the first identifier (plain identifier)',
      code: `
const foo = 42;
const bar = foo;
doStuff({ bar });
return foo + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With another reference to the first identifier (property access)',
      code: `
const foo = [];
const bar = foo.length;
console.log(foo.values());
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First identifier is a destructured parameter',
      code: `
function fun({ foo }: any) {
  const bar = foo;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First identifier is a destructured parameter (property access)',
      code: `
function fun({ foo }: any) {
  const bar = foo.length;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First identifier is destructured',
      code: `
const { foo } = quux();
const bar = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Second identifier is destructured',
      code: `
const foo = quux();
const { bar } = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First identifier is already destructured (property access)',
      code: `
const { foo } = quux();
const bar = foo.length;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a constant declaration',
      code: `
const foo = quux();
let bar = foo.length;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Initialization from an identifier defined in the outer scope',
      code: `
const foo = quux();

function fun() {
  const bar = foo.length;
  return bar + 3;
}

function fnord() {
  return foo;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With different scopes',
      code: `
const foo = quux();
{
  const bar = foo.length;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Initialization from an uppercase identifier',
      code: `
const FOO = quux();
const bar = FOO.length;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`var` declaration',
      code: `
const foo = quux();
var bar = foo.length;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no init',
      code: `
const foo = quux();
const bar;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With missing reference to the identifier in the initialization',
      code: `
const bar = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With missing reference to the identifier object in the initialization',
      code: `
const bar = foo.quux;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an ambient declaration for the identifier in the initialization',
      code: `
declare const foo: number;
const bar = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a caught error for the binding of the first identifier',
      code: `
try {
} catch (foo) {
  const bar = foo;
  return bar + 3;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an import for the identifier in the initialization',
      code: `
import { foo } from './foo.js';
const bar = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple variable declarators in the first identifier',
      code: `
const foo = 42,
  fnord = 105;
const bar = foo;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple variable declarators in the second identifier',
      code: `
const foo = 42;
const bar = foo,
  fnord = 105;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a type annotation',
      code: `
const foo = [];
const bar: number = foo.length;
return bar + 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The first identifier is exported',
      code: `
export const foo = [];
const bar = foo.length;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The second identifier is exported',
      code: `
const foo = [];
export const bar = foo.length;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The first identifier is default exported',
      code: `
const foo = [];
const bar = foo.length;

export default foo;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Declaring another variable initialized with a simple identifier #docs',
      code: `
const foo = 42;
const bar = foo;
return bar + 3;
`,
      errors: [
        {
          messageId: 'uselessIntermediaryVariable',
          suggestions: [
            {
              messageId: 'renameFirstToSecond',
              output: `
const bar = 42;

return bar + 3;
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
      name: 'Declaring a variable initialized with trivial property access on a simple identifier',
      code: `
const foo = [];
const bar = foo.length;
return bar + 3;
`,
      errors: [
        {
          messageId: 'useNamedDestructuring',
          suggestions: [
            {
              messageId: 'renameToNamedDestructuring',
              output: `
const { length: bar } = [];

return bar + 3;
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
      name: 'The second identifier is default exported',
      code: `
const foo = [];
const bar = foo.length;

export default bar;
`,
      errors: [
        {
          messageId: 'useNamedDestructuring',
          suggestions: [
            {
              messageId: 'renameToNamedDestructuring',
              output: `
const { length: bar } = [];


export default bar;
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
      name: 'Property and second identifier names match',
      code: `
const foo = quux();
const bar = foo.bar;
return bar + 3;
`,
      errors: [
        {
          messageId: 'useNamedDestructuring',
          suggestions: [
            {
              messageId: 'renameToNamedDestructuring',
              output: `
const { bar } = quux();

return bar + 3;
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
