# wyrm/empty-for

📝 Forbid using `for (;;)`.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Empty `for` loop:

```tsx
for (;;) {}

// Automatically fixed to:
while (true) {}
```

### Correct ✅

Not an empty `for` loop:

```tsx
for (let i = 0; i < 42; i++) {}
```

<!-- end auto-generated rule header -->
