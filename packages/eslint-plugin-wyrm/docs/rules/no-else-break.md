# wyrm/no-else-break

📝 Forbid unnecessary `else` block after a `break` statement.

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

// Automatically fixed to:
while (true) {
  if (cond) break;
  foo();
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

## Related

- [`wyrm/no-else-continue`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-continue.md)
- [`wyrm/no-else-throw`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-throw.md)
- ESLint: [`no-else-return`](https://eslint.org/docs/latest/rules/no-else-return)

## Prior Art

- Pylint: [`no-else-break`](https://pylint.readthedocs.io/en/stable/user_guide/messages/refactor/no-else-break.html)
