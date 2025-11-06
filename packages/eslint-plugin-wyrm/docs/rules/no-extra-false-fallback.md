# Forbid extra `?? false` in conditions and predicates (`wyrm/no-extra-false-fallback`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Description

When an expression is inside a conditional test, it is implicitly coerced to a boolean.
Falling back to `false` for nullish values is redundant, because nullish values will always be
coerced to `false` anyway.

This also applies to the return values of predicates for array methods like `Array.prototype.find` or `Array.prototype.filter`,
and to expressions inside boolean casts.

The rule also forbids `|| false`, for the same reasons.

### Example

```ts
declare const foo: string | null | undefined;
// The nullish coalescing operator isn't necessary, because the value is already coerced to a boolean anyway:
const bar = Boolean(foo ?? false);
```

## Cases

### Incorrect ❌

Redundant `false` fallback:

```tsx
if (foo ?? false) {
  console.log('foo!');
}
```

Redundant `false` fallback inside of a boolean cast:

```tsx
const x = Boolean(foo ?? false);
```

Redundant `false` fallback in return of array method predicate:

```tsx
declare const arr: Array<string | null>;
const isOkay = arr.filter((elt) => elt ?? false);
```

Redundant `false` fallback in logical sub-expressions:

```tsx
if ((bar ?? false) && (foo ?? false)) {
  console.log('foo!');
}
```

### Correct ✅

No extra `false` fallback:

```tsx
if (bar && foo) {
  console.log('foo!');
}
```

With a `true` fallback value:

```tsx
if (bar && (foo ?? true)) {
  console.log('foo!');
}
```

Short-circuiting expression:

```tsx
const val: boolean = bar && (foo ?? false);
```

<!-- end auto-generated rule header -->
