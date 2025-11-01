# Disallow constant string expressions in template literals (`wyrm/no-constant-template-expression`)

💼 This rule is enabled in the 🟣 `strictTypeChecked` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Template expression with a constant string value:

```tsx
const foo = 'foobar';
const str = `${foo}_baz`;
```

Template expression with a constant number value:

```tsx
const n = 42;
const str = `${n}_baz`;
```

Template expression with a constant boolean value:

```tsx
const bool = true;
const str = `${bool}_baz`;
```

### Correct ✅

Template expression typed as string:

```tsx
declare const foo: string;
const str = `${foo}_baz`;
```

<!-- end auto-generated rule header -->
