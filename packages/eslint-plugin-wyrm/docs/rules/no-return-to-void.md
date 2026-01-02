# wyrm/no-return-to-void

📝 Forbid returning values in void-returning callbacks.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

With return from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  return 42;
});
```

With `return undefined` from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  return undefined;
});
```

With some undefined return from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  if (Math.cos(0)) return 42;
  return undefined;
});
```

### Correct ✅

With no return from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  console.log(it);
});
```

With empty return from `forEach` callback:

```tsx
[1, 2, 3].forEach((it) => {
  return;
});
```

<!-- end auto-generated rule header -->
