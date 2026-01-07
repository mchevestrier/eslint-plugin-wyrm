# wyrm/no-else-return

📝 Forbid unnecessary `else` block after a `return` statement.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Description

This rule is similar to the base `no-else-return` rule, except it also checks `else if` statements by default (just like with the `allowElseIf: false` option enabled in the base rule).

**Example:**

```ts
function fun(n: number) {
  if (!n) return;
  else if (n === 3) console.log('foo'); // Unnecessary `else` here
}
```

## Cases

### Incorrect ❌

Unnecessary `else` block after `return`:

```tsx
if (cond) return 'ok';
else foo();

// Automatically fixed to:
if (cond) return 'ok';
foo();
```

Unnecessary `else` block after empty `return`:

```tsx
if (cond) return;
else foo();

// Automatically fixed to:
if (cond) return;
foo();
```

### Correct ✅

No `else` block necessary:

```tsx
if (cond) return 'ok';
foo();
```

<!-- end auto-generated rule header -->

## Related

- [`wyrm/no-else-break`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-break.md)
- [`wyrm/no-else-continue`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-continue.md)
- [`wyrm/no-else-throw`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-throw.md)
- [`wyrm/no-else-return`](https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/no-else-return.md)
- ESLint: [`no-else-return`](https://eslint.org/docs/latest/rules/no-else-return)
