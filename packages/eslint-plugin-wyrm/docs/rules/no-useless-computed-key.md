# Forbid useless computed keys (`wyrm/no-useless-computed-key`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Useless computed key:

```tsx
const obj = { ['foobar']: 42 };
```

### Correct ✅

Identifier key:

```tsx
const obj = { foobar: 42 };
```

Useful computed key:

```tsx
const obj = { ['foo' + 'bar']: 42 };
```

<!-- end auto-generated rule header -->
