import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './generic-constructor-with-hook.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With a generic Map constructor as `useState` argument, with an initialization function #docs',
      code: `
const [foo, setFoo] = useState(() => new Map<string, string>());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a generic Set constructor as `useRef` argument #docs',
      code: `
const foo = useRef(new Set<string>());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The generic constructor argument is different from the hook type annotation',
      code: `
const foo = useRef<Set<string>>(new Set<'foo'>());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a different constructor in type annotation and in constructor',
      code: `
const [foo, setFoo] = useState<Map<string, string>>(() => new Quux());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an empty list passed in `options.hooks`',
      options: [{ hooks: [] }],
      code: `
const [foo, setFoo] = useState<Map<string, string>>(() => new Map());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-TSTypeReference type annotation (union type)',
      code: `
const foo = useRef<Map<string, string> | null>(new Map());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With qualified name type annotation',
      code: `
const foo = useRef<Foo.Bar<string>>(new Bar());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no arguments to hook',
      code: `
const foo = useRef<Map<string, string>>();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function that has multiple return statements at top level',
      code: `
const foo = useRef<Map<string, string>>(function () {
  return new Map();
  return new Map();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With function that has no return statement',
      code: `
const foo = useRef<Map<string, string>>(function () {
  console.log('hello');
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-new-expression argument',
      code: `
const foo = useRef<Map<string, string>>(existingMap);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With new expression with non-identifier callee',
      code: `
const foo = useRef<Map<string, string>>(() => new Foo.Bar());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-React object prefix',
      code: `
const foo = MyLibrary.useState<Map<string, string>>(new Map());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With computed property on React',
      code: `
const foo = React['useState']<Map<string, string>>(new Map());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With non-identifier object in member expression',
      code: `
const foo = getSomething().useState<Map<string, string>>(new Map());
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a Map constructor as `useState` argument #docs',
      code: `
const [foo, setFoo] = useState<Map<string, string>>(() => new Map());
`,
      output: `
const [foo, setFoo] = useState(() => new Map<string, string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Map<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Set constructor as `useRef` argument #docs',
      code: `
const foo = useRef<Set<string>>(new Set());
`,
      output: `
const foo = useRef(new Set<string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Set<string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary type annotation for inferable type #docs',
      code: `
const foo = useRef<Set<string>>(new Set<string>());
`,
      output: `
const foo = useRef(new Set<string>());
`,
      errors: [
        {
          messageId: 'noInferable',
          line: 2,
          endLine: 2,
          column: 20,
          endColumn: 31,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With React.useState',
      code: `
const [foo, setFoo] = React.useState<Map<string, string>>(() => new Map());
`,
      output: `
const [foo, setFoo] = React.useState(() => new Map<string, string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Map<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With custom hooks passed in `options.hooks`',
      options: [{ hooks: ['useFrob'] }],
      code: `
const [foo, setFoo] = useFrob<Quux<string, string>>(() => new Quux());
`,
      output: `
const [foo, setFoo] = useFrob(() => new Quux<string, string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Quux<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Map constructor as `useState` argument (no initialization function)',
      code: `
const [foo, setFoo] = useState<Map<string, string>>(new Map());
`,
      output: `
const [foo, setFoo] = useState(new Map<string, string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Map<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Map constructor as `useState` argument with a function expression as initialization function',
      code: `
const [foo, setFoo] = useState<Map<string, string>>(function () {
  return new Map();
});
`,
      output: `
const [foo, setFoo] = useState(function () {
  return new Map<string, string>();
});
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Map<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Quux constructor',
      code: `
const [foo, setFoo] = useState<Quux<string, string>>(() => new Quux());
`,
      output: `
const [foo, setFoo] = useState(() => new Quux<string, string>());
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Quux<string, string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With constructor arguments',
      code: `
const [foo, setFoo] = useState<Set<string>>(() => new Set(fnord));
`,
      output: `
const [foo, setFoo] = useState(() => new Set<string>(fnord));
`,
      errors: [
        {
          messageId: 'useGenericConstructor',
          data: { typeAnnotationText: 'Set<string>' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non generic constructor',
      code: `
const controller = useRef<AbortController>(new AbortController());
`,
      output: `
const controller = useRef(new AbortController());
`,
      errors: [
        {
          messageId: 'removeObviousInferable',
          data: { typeAnnotationText: 'AbortController' },
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
