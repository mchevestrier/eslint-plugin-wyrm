# Forbid unnecessary `else` block after a `continue` statement (`wyrm/no-else-continue`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Unnecessary `else` block after `continue`:

```tsx
while (true) {
  if (cond) continue;
  else foo();
}
```

### Correct ✅

No `else` block necessary:

```tsx
while (true) {
  if (cond) continue;
  foo();
}
```

<!-- end auto-generated rule header -->
