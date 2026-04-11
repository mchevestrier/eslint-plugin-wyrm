# wyrm/no-nullish-ternary

📝 Forbid ternary conditions that can be replaced by optional chains.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Simple property access:

```tsx
foo ? foo.bar : undefined;

// Automatically fixed to:
foo?.bar;
```

### Correct ✅

Alternate is `null`, not `undefined`:

```tsx
foo ? foo.bar : null;
```

<!-- end auto-generated rule header -->
