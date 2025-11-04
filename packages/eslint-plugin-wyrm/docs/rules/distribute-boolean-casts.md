# Enforce that boolean casts are distributed over logical expressions (`wyrm/distribute-boolean-casts`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

An entire logical expression wrapped in a boolean cast:

```tsx
const foo = !!(bar && baz.length > 2 && quux.description);
```

### Correct ✅

Distributed boolean cast:

```tsx
const foo = !!bar && baz.length > 2 && !!quux.description;
```

<!-- end auto-generated rule header -->
