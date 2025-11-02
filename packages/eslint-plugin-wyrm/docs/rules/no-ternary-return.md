# Disallow ternary conditions in return statements (`wyrm/no-ternary-return`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Ternary return:

```tsx
function foo(cond: boolean) {
  return cond ? 42 : 105;
}
```

### Correct ✅

No ternary return:

```tsx
function foo(cond: boolean) {
  if (cond) return 42;
  return 105;
}
```

Inline arrow function:

```tsx
const foo = (cond: boolean) => (cond ? 42 : 105);
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name              | Description                                                       | Type    |
| :---------------- | :---------------------------------------------------------------- | :------ |
| `allowSingleLine` | Whether to allow single line ternary conditions. Default: `false` | Boolean |

<!-- end auto-generated rule options list -->
