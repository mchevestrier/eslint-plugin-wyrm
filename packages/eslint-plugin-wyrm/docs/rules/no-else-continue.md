# wyrm/no-else-continue

📝 Forbid unnecessary `else` block after a `continue` statement.

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

// Automatically fixed to:
while (true) {
  if (cond) continue;
  foo();
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

## Related

- [`wyrm/no-else-break`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-break.md)
- [`wyrm/no-else-throw`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-throw.md)
- ESLint: [`no-else-return`](https://eslint.org/docs/latest/rules/no-else-return)

## Prior Art

- Pylint: [`no-else-continue`](https://pylint.readthedocs.io/en/stable/user_guide/messages/refactor/no-else-continue.html)
