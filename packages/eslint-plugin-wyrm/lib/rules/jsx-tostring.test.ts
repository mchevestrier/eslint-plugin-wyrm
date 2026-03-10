import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './jsx-tostring.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      project: './tsconfig.json',
      projectService: false,
      tsconfigRootDir: path.join(import.meta.dirname, './fixtures'),

      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Empty JSX expression container',
      code: `
function MyComponent() {
  return <div>{}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain number in a JSX expression container #docs',
      code: `
function MyComponent() {
  const n = 42;
  return <div>{n}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` inside JSX attribute',
      code: `
function MyComponent() {
  const n = 42;
  return <div title={n.toString()} />;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain number in a JSX expression container in a JSX fragment',
      code: `
function MyComponent() {
  const n = 42;
  return <>{n}</>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a number when the parent component only takes string children #docs',
      code: `
type ParentComponentProps = {
  children: string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component without explicit children prop type (cannot determine children prop type)',
      code: `
function ParentComponent(props: any) {
  return props.children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a boolean when parent only accepts string (needs conversion)',
      code: `
type ParentComponentProps = {
  children: string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const b = true;
  return <ParentComponent>{b.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on union type number | string when parent only accepts string (needs conversion)',
      code: `
type ParentComponentProps = {
  children: string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value: number | string = 42;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on union type number | string when parent only accepts string | boolean (needs conversion)',
      code: `
type ParentComponentProps = {
  children: string | boolean;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value = 42 as number | string;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple component call signatures',
      code: `
type ParentComponentProps = {
  children: string | boolean;
};

function ParentComponent({ title }: { title: string | number });
function ParentComponent({ children }: ParentComponentProps);
function ParentComponent(props: any) {
  return props.children;
}

function MyComponent() {
  const value = 42;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on number when parent only accepts string | boolean (needs conversion)',
      code: `
type ParentComponentProps = {
  children: string | boolean;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value: number = 42;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Direct function call in JSX (not member expression)',
      code: `
function getString() {
  return 'hello';
}

function MyComponent() {
  return <div>{getString()}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Computed property access in JSX',
      code: `
function MyComponent() {
  const n = 42;
  const method = 'toString';
  return <div>{n[method]()}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With literal string as property key',
      code: `
function MyComponent() {
  const n = 42;
  return <div>{n['toString']()}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Different method call (not toString) in JSX',
      code: `
function MyComponent() {
  const n = 42;
  return <div>{n.toFixed()}</div>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on union type number | boolean when parent only accepts string (needs conversion)',
      code: `
type ParentComponentProps = {
  children: string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value: number | boolean = Math.random() > 0.5 ? 42 : true;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with param directly named children expects string',
      code: `
function ParentComponent(children: string) {
  return children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Class component with children property that accepts string',
      code: `
class ParentComponent {
  props: { children: string };

  constructor(props: { children: string }) {
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component type that is an interface with children property',
      code: `
interface ParentComponentProps {
  children: string;
}

const ParentComponent = (props: ParentComponentProps) => {
  return props.children;
};

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with symbol but no valueDeclaration (covers line 63, branch 1)',
      code: `
declare const ExternalComponent: React.FC<{ children: string }>;

function MyComponent() {
  const n = 42;
  return <ExternalComponent>{n.toString()}</ExternalComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function component param without valueDeclaration',
      code: `
declare function ComponentWithUntypedParam(props: any): JSX.Element;

function MyComponent() {
  const n = 42;
  return <ComponentWithUntypedParam>{n.toString()}</ComponentWithUntypedParam>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with mapped type children',
      code: `
type MappedProps<T> = { [K in keyof T]: T[K] };

function Component(props: MappedProps<{ children: number }>) {
  return props.children;
}

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with generic children prop type',
      code: `
type ComponentProps<T> = { children: T };

function Component<T>(props: ComponentProps<T>) {
  return props.children;
}

function MyComponent() {
  const n = 42;
  return <Component<number>>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component has no value declaration',
      code: `
type ComponentProps = { children: string };
type ComponentType = (props: ComponentProps) => string;

declare const Component: ComponentType;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation',
      code: `
type ComponentProps = { children: string };
type ComponentType = (props: ComponentProps) => string;

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with type union)',
      code: `
type ComponentProps = { children: string };
type ComponentType =
  | ((props: ComponentProps) => string)
  | ((props: ComponentProps) => number);

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with interface and call signature)',
      code: `
type ComponentProps = { children: string };

interface ComponentType {
  (props: ComponentProps): string;
}

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with union with no props type)',
      code: `
type ComponentType = (() => string) | (() => unknown);

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no parameter type annotation',
      code: `
function Component(props) {
  return props.children;
}

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With rest parameter type annotation',
      code: `
function Component(...rest: unknown[]) {
  return rest[0].children;
}

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with union with no children type)',
      code: `
type ComponentType = (() => string) | ((props: any) => unknown);

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with utility type props',
      code: `
type Props = Readonly<{ children: number }>;

function Component(props: Props) {
  return props.children;
}

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Class component with Pick utility type',
      code: `
type AllProps = { children: number; other: string };

class Component {
  props: Pick<AllProps, 'children'>;

  constructor(props: Pick<AllProps, 'children'>) {
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function component with no parameters (triggers param?.valueDeclaration check)',
      code: `
function NoPropsComponent() {
  return null;
}

function MyComponent() {
  const n = 42;
  return <NoPropsComponent>{n.toString()}</NoPropsComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Class component with no constructor (triggers param?.valueDeclaration check)',
      code: `
class NoPropsComponent {
  render() {
    return null;
  }
}

function MyComponent() {
  const n = 42;
  return <NoPropsComponent>{n.toString()}</NoPropsComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Class component with props but no children property',
      code: `
class ComponentWithoutChildren {
  props: { title: string };

  constructor(props: { title: string }) {
    this.props = props;
  }

  render() {
    return this.props.title;
  }
}

function MyComponent() {
  const n = 42;
  return <ComponentWithoutChildren>{n.toString()}</ComponentWithoutChildren>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some namespaced component',
      code: `
function MyComponent() {
  const n = 42;
  return <foo:bar>{n.toString()}</foo:bar>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some JSX member expression (compound component)',
      code: `
function ParentComponent({ children }: { children: string }) {
  return children;
}

const Obj = { ParentComponent };

function MyComponent() {
  const value = 42 as number | boolean | string;
  return <Obj.ParentComponent>{value.toString()}</Obj.ParentComponent>;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Calling `.toString()` on a number in a JSX expression container #docs',
      code: `
function MyComponent() {
  const n = 42;
  return <div>{n.toString()}</div>;
}
`,
      output: `
function MyComponent() {
  const n = 42;
  return <div>{n}</div>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a number when the parent component also accepts number children',
      code: `
type ParentComponentProps = {
  children: string | number;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      output: `
type ParentComponentProps = {
  children: string | number;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n}</ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` inside a JSX fragment',
      code: `
function MyComponent() {
  const n = 42;
  return <>{n.toString()}</>;
}
`,
      output: `
function MyComponent() {
  const n = 42;
  return <>{n}</>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a string (always unnecessary)',
      code: `
function MyComponent() {
  const s = 'hello';
  return <div>{s.toString()}</div>;
}
`,
      output: `
function MyComponent() {
  const s = 'hello';
  return <div>{s}</div>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a boolean when parent accepts boolean',
      code: `
type ParentComponentProps = {
  children: boolean;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const b = true;
  return <ParentComponent>{b.toString()}</ParentComponent>;
}
`,
      output: `
type ParentComponentProps = {
  children: boolean;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const b = true;
  return <ParentComponent>{b}</ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.toString()` on a union type number | string when parent accepts number | string',
      code: `
type ParentComponentProps = {
  children: number | string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value: number | string = 42;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      output: `
type ParentComponentProps = {
  children: number | string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const value: number | string = 42;
  return <ParentComponent>{value}</ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some JSX member expression (compound component)',
      code: `
type ParentComponentProps = {
  children: number | string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

const Obj = { ParentComponent };

function MyComponent() {
  const value = 42;
  return <Obj.ParentComponent>{value.toString()}</Obj.ParentComponent>;
}
`,
      output: `
type ParentComponentProps = {
  children: number | string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

const Obj = { ParentComponent };

function MyComponent() {
  const value = 42;
  return <Obj.ParentComponent>{value}</Obj.ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Class component with children property that accepts string or number',
      code: `
class ParentComponent {
  props: { children: string | number };

  constructor(props: { children: string | number }) {
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
`,
      output: `
class ParentComponent {
  props: { children: string | number };

  constructor(props: { children: string | number }) {
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n}</ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component with abstract children prop (valueDeclaration fallback)',
      code: `
abstract class BaseComponent {
  abstract props: { children: number };
  abstract render(): React.ReactNode;
}

class ConcreteComponent extends BaseComponent {
  props: { children: number };

  constructor(props: { children: number }) {
    super();
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <ConcreteComponent>{n.toString()}</ConcreteComponent>;
}
`,
      output: `
abstract class BaseComponent {
  abstract props: { children: number };
  abstract render(): React.ReactNode;
}

class ConcreteComponent extends BaseComponent {
  props: { children: number };

  constructor(props: { children: number }) {
    super();
    this.props = props;
  }

  render() {
    return this.props.children;
  }
}

function MyComponent() {
  const n = 42;
  return <ConcreteComponent>{n}</ConcreteComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component has no value declaration',
      code: `
type ComponentProps = { children: string | number };
type ComponentType = (props: ComponentProps) => string;

declare const Component: ComponentType;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      output: `
type ComponentProps = { children: string | number };
type ComponentType = (props: ComponentProps) => string;

declare const Component: ComponentType;

function MyComponent() {
  const n = 42;
  return <Component>{n}</Component>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation',
      code: `
type ComponentProps = { children: string | number };
type ComponentType = (props: ComponentProps) => string;

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      output: `
type ComponentProps = { children: string | number };
type ComponentType = (props: ComponentProps) => string;

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n}</Component>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with type union)',
      code: `
type ComponentProps = { children: string | number };
type ComponentType =
  | ((props: ComponentProps) => string | number)
  | ((props: ComponentProps) => number);

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      output: `
type ComponentProps = { children: string | number };
type ComponentType =
  | ((props: ComponentProps) => string | number)
  | ((props: ComponentProps) => number);

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n}</Component>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Component declared with arrow function and type annotation (with interface and call signature)',
      code: `
type ComponentProps = { children: string | number };

interface ComponentType {
  (props: ComponentProps): string;
}

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n.toString()}</Component>;
}
`,
      output: `
type ComponentProps = { children: string | number };

interface ComponentType {
  (props: ComponentProps): string;
}

const Component: ComponentType = (props) => props.children;

function MyComponent() {
  const n = 42;
  return <Component>{n}</Component>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple component call signatures',
      code: `
type ParentComponentProps = {
  children: string | number;
};

function ParentComponent({ title }: { title: string | number });
function ParentComponent({ children }: ParentComponentProps);
function ParentComponent(props: any) {
  return props.children;
}

function MyComponent() {
  const value = 42;
  return <ParentComponent>{value.toString()}</ParentComponent>;
}
`,
      output: `
type ParentComponentProps = {
  children: string | number;
};

function ParentComponent({ title }: { title: string | number });
function ParentComponent({ children }: ParentComponentProps);
function ParentComponent(props: any) {
  return props.children;
}

function MyComponent() {
  const value = 42;
  return <ParentComponent>{value}</ParentComponent>;
}
`,
      errors: [{ messageId: 'noToString' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
