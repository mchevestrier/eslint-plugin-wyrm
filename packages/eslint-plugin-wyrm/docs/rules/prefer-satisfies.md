# wyrm/prefer-satisfies

📝 Prefer `satisfies` to type assertions.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

With a type assertion:

```tsx
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as Obj;

// Can be fixed to:
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux satisfies Obj;
```

With a string and `as const`:

```tsx
const foo = 'foo'; // Could just add `as const` here
const bar = foo as 'foo';

// Can be fixed to:
const foo = 'foo'; // Could just add `as const` here
const bar = foo satisfies 'foo';
```

### Correct ✅

With `satisfies`:

```tsx
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux satisfies Obj;
```

With a safe (widening) type assertion:

```tsx
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as { foo: number };
```

With an unsafe (narrowing) type assertion:

```tsx
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as Obj & { baz: number };
```

With a string and `as const`:

```tsx
const foo = 'foo' as const;
const bar = foo satisfies 'foo';
```

<!-- end auto-generated rule header -->
