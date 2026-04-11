# wyrm/duplicate-object-spread

📝 Forbid duplicate spread elements in object literals.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

The same identifier is spread twice into the object literal:

```tsx
const foo = { key: 42 };
export const obj = { ...foo, baz: 33, ...foo };

// Automatically fixed to:
const foo = { key: 42 };
export const obj = { ...foo, baz: 33 };
```

### Correct ✅

Different identifiers are spread into the object literal:

```tsx
const foo = { key: 42 };
const bar = { key: 42 };
export const obj = { ...foo, baz: 33, ...bar };
```

<!-- end auto-generated rule header -->
