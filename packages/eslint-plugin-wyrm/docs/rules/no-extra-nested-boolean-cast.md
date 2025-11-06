# Forbid extra boolean casts in conditions and predicates (`wyrm/no-extra-nested-boolean-cast`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

When an expression is inside a conditional test, it is implicitly coerced to a boolean.
Casting this expression to a boolean is therefore redundant.

This rule supplements the builtin [`no-extra-boolean-cast`](https://eslint.org/docs/latest/rules/no-extra-boolean-cast) ESLint rule.
The `wyrm/no-extra-nested-boolean-cast` should have the same behavior as the builtin rule with the `enforceForInnerExpressions` option enabled, but it also supports some TypeScript constructs.

Contrary to the builtin rule, it also enforces this for callback returns of some array methods like `Array.prototype.find` or `Array.prototype.filter`.

### Example

```ts
declare const foo: string;
// `foo` doesn't need to be coerced to a boolean, because it is inside a ternary condition:
const bar = !!foo ? 'ok' : 'ko';
```

This rules conflicts with the [`@typescript-eslint/strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/) rule.

## Cases

### Incorrect ❌

Redundant double negation:

```tsx
declare const foo: string;

if (!!foo) {
  console.log('foo!');
}
```

Redundant double negation inside of another boolean cast:

```tsx
const x = Boolean(!!foo);
```

Redundant double negation in return of array method predicate:

```tsx
declare const arr: string[];
const isOkay = arr.filter((elt) => !!elt);
```

Redundant double negations in logical sub-expressions:

```tsx
declare const foo: string;
declare const bar: string;
declare const baz: string;

if (!!bar && (!!foo || !!baz)) {
  console.log('foo!');
}
```

Redundant Boolean calls:

```tsx
declare const foo: string;
declare const bar: string;
declare const baz: string;

if (Boolean(bar) && (Boolean(foo) || Boolean(baz))) {
  console.log('foo!');
}
```

Redundant double negations nested in type assertions:

```tsx
declare const foo: string;
declare const bar: string;
declare const baz: string;

if ((!!bar)! && ((!!foo satisfies boolean) || (!!baz as any))) {
  console.log('foo!');
}
```

### Correct ✅

No extra boolean cast:

```tsx
declare const foo: string;
declare const bar: string;
declare const baz: string;

if (bar && (foo || baz)) {
  console.log('foo!');
}
```

Short-circuiting expression:

```tsx
declare const foo: string;
declare const bar: string;
declare const baz: string;

const val = !!bar && (!!foo || !!baz);
```

<!-- end auto-generated rule header -->
