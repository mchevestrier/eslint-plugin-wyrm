# wyrm/prefer-object-keys-values

📝 Enforce using `Object.keys()` and `Object.values()` rather than `Object.entries()`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

With `Object.entries().map()`, only using keys:

```tsx
const keys = Object.entries(foo).map(([key]) => key.toUpperCase());

// Can be fixed to:
const keys = Object.keys(foo).map((key) => key.toUpperCase());
```

With `Object.entries().map()`, only using values:

```tsx
const values = Object.entries(foo).map(([, value]) => value.toUpperCase());

// Can be fixed to:
const values = Object.values(foo).map((value) => value.toUpperCase());
```

With `Object.entries().forEach()`, only using values:

```tsx
Object.entries(foo).forEach(function ([, value]) {
  console.log(value);
});

// Can be fixed to:
Object.values(foo).forEach(function (value) {
  console.log(value);
});
```

With `Object.entries().every()`, only using keys:

```tsx
const ok = Object.entries(foo).every(([key]) => key.toUpperCase() === key);

// Can be fixed to:
const ok = Object.keys(foo).every((key) => key.toUpperCase() === key);
```

With `Object.entries().some()`, only using values:

```tsx
const ok = Object.entries(foo).some(([, value]) => value.toUpperCase() === value);

// Can be fixed to:
const ok = Object.values(foo).some((value) => value.toUpperCase() === value);
```

### Correct ✅

With `.find()`:

```tsx
const entry = Object.entries(foo).find(([key]) => key === 'fnord');
```

With `.filter()`:

```tsx
const entries = Object.entries(foo).filter(([key]) => key === 'fnord');
```

With `Object.entries().map()`, using keys and values:

```tsx
const entries = Object.entries(foo).map(([key, value]) => ({ key, value }));
```

<!-- end auto-generated rule header -->
