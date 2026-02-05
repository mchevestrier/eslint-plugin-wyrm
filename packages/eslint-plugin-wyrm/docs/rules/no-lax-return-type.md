# wyrm/no-lax-return-type

📝 Forbid declaring function return types that are wider than the types of the actual return values.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Return type is wider than the return values:

```tsx
function foo(): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
}

// Can be fixed to:
function foo(): string {
  if (Math.random()) return 'bar';
  return 'foo';
}
```

### Correct ✅

Return type is not too wide:

```tsx
function foo(): string {
  if (Math.random()) return 'bar';
  return 'foo';
}
```

Return type is a union type:

```tsx
function foo(): string | null {
  if (Math.random()) return null;
  return 'foo';
}
```

<!-- end auto-generated rule header -->
