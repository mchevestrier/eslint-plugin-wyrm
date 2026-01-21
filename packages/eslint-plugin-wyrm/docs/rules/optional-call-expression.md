# wyrm/optional-call-expression

📝 Enforce using optional call expression syntax.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

`if` statement:

```tsx
if (foo) {
  foo();
}

// Automatically fixed to:
foo?.();
```

### Correct ✅

Optional call expression:

```tsx
foo?.();
```

<!-- end auto-generated rule header -->
