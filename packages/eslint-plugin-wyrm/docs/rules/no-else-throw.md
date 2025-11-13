# Forbid unnecessary `else` block after a `throw` statement (`wyrm/no-else-throw`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Unnecessary `else` block after `throw`:

```tsx
if (cond) throw Error('oh no!');
else foo();
```

### Correct ✅

No `else` block necessary:

```tsx
if (cond) throw Error('oh no!');
foo();
```

<!-- end auto-generated rule header -->

## Related

- [wyrm/no-else-break](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-break.md)
- [wyrm/no-else-continue](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-continue.md)
- ESLint: [no-else-return](https://eslint.org/docs/latest/rules/no-else-return)

## Prior Art

- Pylint: [no-else-raise](https://pylint.readthedocs.io/en/stable/user_guide/messages/refactor/no-else-raise.html)
