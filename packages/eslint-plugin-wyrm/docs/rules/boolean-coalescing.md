# wyrm/boolean-coalescing

📝 Prefer distributing boolean casts over nullish coalescing expressions.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

With a possibly nullish but not possibly falsy left side:

```tsx
function fun(foo: object | null, bar: string | null) {
  return !(foo ?? bar);
}

// Automatically fixed to:
function fun(foo: object | null, bar: string | null) {
  return !(!!foo || !!bar);
}
```

### Correct ✅

With a possibly nullish and possibly falsy left side:

```tsx
function fun(foo: string | null, bar: string | null) {
  return !(foo ?? bar);
}
```

<!-- end auto-generated rule header -->
