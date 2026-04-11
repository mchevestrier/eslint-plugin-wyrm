# wyrm/useless-as-const

📝 Forbid useless `as const` assertions.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

`as const` assertion in declaration with a type annotation:

```tsx
export const foo: string = 'foo' as const;

// Can be fixed to:
export const foo: string = 'foo';
```

### Correct ✅

No type annotation:

```tsx
export const foo = 'foo' as const;
```

No `as const` assertion:

```tsx
export const foo: string = 'foo';
```

<!-- end auto-generated rule header -->
