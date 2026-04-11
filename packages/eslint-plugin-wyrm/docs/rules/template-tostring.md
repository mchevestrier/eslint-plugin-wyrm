# wyrm/template-tostring

📝 Forbid calling `.toString()` inside template expressions.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Calling `.toString()` on a number in a template literal:

```tsx
const n = 42;
const str = `${n.toString()}`;

// Automatically fixed to:
const n = 42;
const str = `${n}`;
```

### Correct ✅

Plain number in a template literal:

```tsx
const n = 42;
const str = `${n}`;
```

Calling `.toString()` on a number in a tagged template literal:

```tsx
const n = 42;
const str = foo`${n.toString()}`;
```

<!-- end auto-generated rule header -->
