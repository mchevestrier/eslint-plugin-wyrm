# wyrm/constant-boolean-cast

📝 Forbid boolean casts on values with constant truthiness.

💼 This rule is enabled in the following configs: ✅ `recommendedTypeChecked`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

This rule only makes sense if you have `strictNullChecks` enabled in your `tsconfig.json` (this is the default for `strict: true`).

## Cases

### Incorrect ❌

Boolean cast on a plain object:

```tsx
const obj = {};
export const foo = !!obj;

// Can be fixed to:
const obj = {};
export const foo = true;
```

Boolean cast on a non-empty string literal:

```tsx
const str = 'foo';
export const foo = !!str;

// Can be fixed to:
const str = 'foo';
export const foo = true;
```

Boolean cast on an empty string literal:

```tsx
const str = '';
export const foo = !!str;

// Can be fixed to:
const str = '';
export const foo = false;
```

Boolean cast on a non falsy number literal:

```tsx
const n = -42;
export const foo = !!n;

// Can be fixed to:
const n = -42;
export const foo = true;
```

Boolean cast on a falsy number literal:

```tsx
const n = 0;
export const foo = !!n;

// Can be fixed to:
const n = 0;
export const foo = false;
```

Boolean cast on a non falsy bigint literal:

```tsx
const n = -42n;
export const foo = !!n;

// Can be fixed to:
const n = -42n;
export const foo = true;
```

Boolean cast on a falsy bigint literal:

```tsx
const n = 0n;
export const foo = !!n;

// Can be fixed to:
const n = 0n;
export const foo = false;
```

Plain object returned in filter callback:

```tsx
function fun(arr: string[]) {
  return arr.filter((elt) => ({ elt }));
}

// Can be fixed to:
function fun(arr: string[]) {
  return arr.filter((elt) => true);
}
```

`true` returned in filter callback:

```tsx
function fun(arr: string[]) {
  return arr.filter((elt) => true);
}
```

`false` returned in filter callback:

```tsx
function fun(arr: string[]) {
  return arr.filter((elt) => false);
}
```

### Correct ✅

Variable boolean cast:

```tsx
function isNotEmpty(str: string): boolean {
  return !!str;
}
```

String returned in filter callback:

```tsx
function fun(arr: string[]) {
  return arr.filter((elt) => elt);
}
```

<!-- end auto-generated rule header -->

## Related

- [`@typescript-eslint/no-unnecessary-condition`](https://typescript-eslint.io/rules/no-unnecessary-condition/)
