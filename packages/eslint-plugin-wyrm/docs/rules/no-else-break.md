# Forbid unnecessary `else` block after a `break` statement (`wyrm/no-else-break`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Unnecessary `else` block after `break`:

```tsx
while (true) {
  if (cond) break;
  else foo();
}
```

### Correct ✅

No `else` block necessary:

```tsx
while (true) {
  if (cond) break;
  foo();
}
```

<!-- end auto-generated rule header -->
