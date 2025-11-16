# Forbid leading or trailing whitespace in object keys (`wyrm/no-whitespace-property`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Leading whitespace:

```tsx
const obj = { ' foo': 42 };
```

Trailing whitespace:

```tsx
const obj = { 'foo ': 42 };
```

TypeScript object type declaration:

```tsx
type Obj = { ' foo': 42 };
```

### Correct ✅

Whitespace inside text:

```tsx
const obj = { 'foo bar': 42 };
```

<!-- end auto-generated rule header -->
