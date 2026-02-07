# wyrm/no-ternary-return

📝 Disallow ternary conditions in return statements.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Description

This rule disallows returning a ternary expression from the body of a function.

It is essentially the opposite of the [`unicorn/prefer-ternary`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-ternary.md) ESLint rule.

This rule can help automatically "unwrap" nested ternary conditions.

## Cases

### Incorrect ❌

Ternary return:

```tsx
function foo(cond: boolean) {
  return cond ? 42 : 105;
}

// Automatically fixed to:
function foo(cond: boolean) {
  if (cond) {
    return 42;
  } else {
    return 105;
  }
}
```

Nested ternary return:

```tsx
function foo(cond1: boolean, cond2: boolean) {
  return cond1 ? 42 : cond2 ? 105 : 0;
}

// Automatically fixed to:
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    return 42;
  } else {
    if (cond2) {
      return 105;
    } else {
      return 0;
    }
  }
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

## Related

- ESLint: [`no-nested-ternary`](https://eslint.org/docs/latest/rules/no-nested-ternary)

It is recommended that you also enable the following rules along with this one:

- [`wyrm/no-else-return`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-return.md)
