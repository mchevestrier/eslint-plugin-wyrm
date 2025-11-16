# Forbid returning `undefined` in void-returning callbacks (`wyrm/no-useless-return-undefined`)

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

With `return undefined` from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  console.log(it);
  return undefined;
});
```

### Correct ✅

With non-undefined return from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  return 42;
});
```

<!-- end auto-generated rule header -->
