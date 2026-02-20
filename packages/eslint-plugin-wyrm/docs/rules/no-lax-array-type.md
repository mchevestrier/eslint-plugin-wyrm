# wyrm/no-lax-array-type

📝 Forbid declaring array types that are wider than the types of the actual elements.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Type annotation is wider than the types of the array items:

```tsx
export const foo: (number | null)[] = [1, 2, 3];

// Can be fixed to:
export const foo: number[] = [1, 2, 3];
```

### Correct ✅

Type annotation is not wider than the types of the array items:

```tsx
const foo: number[] = [1, 2, 3];
```

<!-- end auto-generated rule header -->
