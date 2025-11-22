import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-first-last.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Last last #docs (with `at`)',
      code: `
const lastFoo = arr.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last last (with index syntax)',
      code: `
const lastFoo = arr[arr.length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not the first last',
      code: `
const NOT_THE_FIRST_FOO = arr.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not the last first',
      code: `
const NOT_THE_LAST_FOO = arr[0];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first `last` with property access',
      code: `
const lastFoo = last.foo[0];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last `first` with property access',
      code: `
const firstFoo = first.foo.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last last (with `findLast`)',
      code: `
const lastFoo = arr.findLast(() => true);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First first #docs (with `at`)',
      code: `
const firstFoo = arr.at(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First first (with index syntax)',
      code: `
const firstFoo = arr[0];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First first (with `find`)',
      code: `
const firstFoo = arr.find(() => true);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Lasting peace',
      code: `
const lastingPeace = arr.at(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not the right method name',
      code: `
const lastFoo = arr.method(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last with property access',
      code: `
const lastFoo = lastFoos.bar[0] as string | undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last with index access',
      code: `
const lastFoo = foos.bar.baz[foos.bar.baz.length - 1]![0];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last with method access',
      code: `
const lastFoo = foos.bar.baz.at(-1).at(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last of first with property access',
      code: `
const firstFoo = firstFoos.bar.at(-1) as string | undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last of first with index access',
      code: `
const firstFoo = foos.bar.baz[0]![foos.bar.baz[0]!.length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last of first with method access',
      code: `
const firstFoo = foos.bar.baz[0]!.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First 5th',
      code: `
const firstFoo = arr.at(4);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last 5th',
      code: `
const lastFoo = arr.at(4);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Destructured first',
      code: `
const { firstFoo } = arr.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Destructured last',
      code: `
const { lastFoo } = arr.at(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last last assignment',
      code: `
let lastFoo;
lastFoo = arr.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First whatever (call expression)',
      code: `
const firstFoo = foobar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last whatever (call expression)',
      code: `
const lastFoo = foobar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First whatever (called member expression)',
      code: `
const firstFoo = foo.bar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last whatever (called member expression)',
      code: `
const lastFoo = foo.bar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First whatever (identifier)',
      code: `
const firstFoo = foobar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last whatever (identifier)',
      code: `
const lastFoo = foobar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Literal object property key is not a string',
      code: `
const foo = {
  [42]: arr.at(0),
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee property is not an identifier ("first" identifier)',
      code: `
const firstFoo = foo['at'](0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee property is not an identifier ("last" identifier)',
      code: `
const lastFoo = foo['at'](0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `.at()` call ("first" identifier)',
      code: `
const firstFoo = foo.at();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty `.at()` call ("last" identifier)',
      code: `
const lastFoo = foo.at();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unary expression is not negation',
      code: `
const firstFoo = foo.at(!1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Negation of identifier',
      code: `
const firstFoo = foo.at(-n);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last element index syntax, but the identifiers do not match',
      code: `
const firstFoo = foo[bar.length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is an identifier',
      code: `
const firstFoo = foo[bar];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression is not a subtraction',
      code: `
const firstFoo = foo[foo.length + 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression is not subtracting a literal',
      code: `
const firstFoo = foo[foo.length - n];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression is not subtracting 1',
      code: `
const firstFoo = foo[foo.length - 2];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Subtracted but not an identifier',
      code: `
const firstFoo = foo[42 - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Subtracted member expression object is not an identifier',
      code: `
const firstFoo = foo[(1 ? foo : bar).length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Subtracted member expression property is not an identifier',
      code: `
const firstFoo = foo[foo['length'] - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Subtracted member expression property is not `length`',
      code: `
const firstFoo = foo[foo.someOtherProperty - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Accessed object is not an identifier',
      code: `
const firstFoo = (1 ? foo : bar)[foo.length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last of first',
      code: `
const firstFoo = firstFoos.at(-1);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last of first (indexing syntax)',
      code: `
const firstFoo = firstFoos[firstFoos.length - 1];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last',
      code: `
const lastFoo = lastFoos[0];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last (method syntax)',
      code: `
const lastFoo = lastFoos.at(0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first of last with destructuring syntax',
      code: `
const [lastFoo] = lastFoos;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First first with destructuring syntax',
      code: `
const [firstFoo] = foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array destructuring with assignment',
      code: `
let lastFoo;
[lastFoo] = foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array destructuring with non-identifier initializer',
      code: `
let [lastFoo] = [foo, bar];
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'First last #docs (with `at`)',
      code: `
const firstFoo = arr.at(-1);
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last (with index syntax)',
      code: `
const firstFoo = arr[arr.length - 1];
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last (with `findLast`) #docs',
      code: `
const firstFoo = arr.findLast(() => true);
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first (with `at`)',
      code: `
const lastFoo = arr.at(0);
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first #docs (with index syntax)',
      code: `
const lastFoo = arr[0];
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first (with `find`)',
      code: `
const lastFoo = arr.find(() => true);
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first assignment',
      code: `
let lastFoo;
lastFoo = arr[0];
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'FIRST last (with index syntax)',
      code: `
const FIRST_FOO = arr[arr.length - 1];
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'LAST first (with index syntax)',
      code: `
const LAST_FOO = arr[0];
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last, with `as`',
      code: `
const firstFoo = arr.at(-1) as any;
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last, with non null assertion',
      code: `
const firstFoo = arr.at(-1)!;
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last, with `satisfies`',
      code: `
const firstFoo = arr.at(-1) satisfies any;
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last object property',
      code: `
const foo = {
  firstFoo: arr.at(-1),
};
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first object property',
      code: `
const foo = {
  lastFoo: arr.at(0),
};
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last and last first object properties',
      code: `
const foo = {
  firstFoo: arr.at(-1),
  lastFoo: arr.at(0),
};
`,
      errors: [{ messageId: 'noFirstLast' }, { messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last with literal object property key',
      code: `
const foo = {
  'first-foo': arr.at(-1),
};
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first with literal object property key',
      code: `
const foo = {
  'last-foo': arr.at(0),
};
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first with destructuring syntax',
      code: `
const [lastFoo] = foo;
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last first and first second with destructuring syntax',
      code: `
const [lastFoo, firstFoo] = foo;
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Last of the first "Not the last"',
      code: `
const lastFoo = NOT_THE_LAST[0];
`,
      errors: [{ messageId: 'noLastFirst' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last with index access, chained member expressions and non-null assertion',
      code: `
const firstFoo = foos.bar.baz![foos.bar.baz!.length - 1];
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last with index access, chained member expressions and `satisfies` expression',
      code: `
const firstFoo = (foos satisfies any)[(foos satisfies any).length - 1];
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'First last with index access, chained member expressions and `as` expression',
      code: `
const firstFoo = (foos as any)[(foos as any).length - 1];
`,
      errors: [{ messageId: 'noFirstLast' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
