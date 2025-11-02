# Disallow unsafe type assertions on optional chained expressions (`wyrm/unsafe-asserted-chain`)

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

This rule supplements the [`@typescript-eslint/no-non-null-asserted-optional-chain`](https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain/) ESLint rule.

It checks for type assertions on optional chain expressions (`?.`) where the asserted type doesn't include `undefined`.

Optional chaining can return `undefined` by default, so this is likely a mistake.

This rule only makes sense if you have `strictNullChecks` enabled in your `tsconfig.json` (this is the default for `strict: true`).

### Example

```ts
foo?.bar as string;
// This should be:
foo?.bar as string | undefined;
// Or, if the optional chaining isn't actually necessary:
foo.bar as string;
```

## Cases

### Incorrect ❌

Optional chain asserted as not undefined:

```tsx
declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string).toUpperCase();
```

Optional chain call expression asserted as not undefined:

```tsx
declare const foo: { bar: () => string | number } | null;
const str = (foo?.bar() as string | number)?.toString();
```

### Correct ✅

Optional chain asserted as nullable:

```tsx
declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string | undefined)?.toUpperCase();
```

Optional chain asserted as any:

```tsx
declare const foo: { bar: string | number } | null;
const str = (foo?.bar as any)?.toUpperCase();
```

Optional chain asserted as unknown:

```tsx
declare const foo: { bar: string | number } | null;
const str = (foo?.bar as unknown)?.toUpperCase();
```

<!-- end auto-generated rule header -->
