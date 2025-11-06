# Forbid useless default values for nullish coalescing expressions (`wyrm/no-useless-logical-fallback`)

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

This rule warns when the component of a logical expression does not have any effect on the type of the expression.

### Example

```ts
declare const foo: string | undefined;
foo ?? undefined; // foo cannot be null, so the nullish coalescing `?? undefined` does not have any observable effect.
```

The rule also warns in some cases when the component of a logical expression makes the type of the expression constant.

@example

```ts
declare const quux: boolean;
quux && false; // This will always be false
```

## Cases

### Incorrect ❌

With `?? undefined`:

```tsx
function quux(foo: string | undefined) {
  return foo ?? undefined;
}
```

With `?? null`:

```tsx
function quux(foo: string | null) {
  return foo ?? null;
}
```

With `|| false`:

```tsx
function quux(foo: boolean) {
  return foo || false;
}
```

With `&& true`:

```tsx
function quux(foo: boolean) {
  return foo && true;
}
```

With `&& false` (constant expression):

```tsx
function quux(foo: boolean) {
  return foo && false;
}
```

With `|| true` (constant expression):

```tsx
function quux(foo: boolean) {
  return foo || true;
}
```

### Correct ✅

`null` with default to `undefined`:

```tsx
function quux(foo: string | null) {
  return foo ?? undefined;
}
```

`undefined` with default to `null`:

```tsx
function quux(foo: string | undefined) {
  return foo ?? null;
}
```

<!-- end auto-generated rule header -->
