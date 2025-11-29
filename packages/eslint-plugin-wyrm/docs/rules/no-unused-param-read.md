# Forbid referencing parameters marked as unused with a leading underscore (`wyrm/no-unused-param-read`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Function parameter is used but marked as unused:

```tsx
function foo(_bar: string) {
  return _bar;
}
```

### Correct ✅

Function parameter is used and not marked as unused:

```tsx
function foo(bar: string) {
  return bar;
}
```

Function parameter is unused and marked as unused:

```tsx
function foo(_bar: string) {
  return 105;
}
```

<!-- end auto-generated rule header -->
