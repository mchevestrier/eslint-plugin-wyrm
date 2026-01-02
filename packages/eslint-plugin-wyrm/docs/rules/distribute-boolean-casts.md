# wyrm/distribute-boolean-casts

📝 Enforce that boolean casts are distributed over logical expressions.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

An entire logical expression wrapped in a boolean cast:

```tsx
const foo = !!(bar && baz.length > 2 && quux.description);

// Automatically fixed to:
const foo = !!bar && baz.length > 2 && !!quux.description;
```

### Correct ✅

Distributed boolean cast:

```tsx
const foo = !!bar && baz.length > 2 && !!quux.description;
```

<!-- end auto-generated rule header -->
