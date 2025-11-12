# Disallow invalid date literals (`wyrm/no-invalid-date-literal`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Invalid date:

```tsx
new Date('20-07-1969');
```

With a number:

```tsx
new Date(9007199254740991);
```

With `Date.parse()`:

```tsx
Date.parse('not a valid date');
```

### Correct ✅

Valid date:

```tsx
new Date('07-20-1969');
```

Valid date (with `Date.parse()`):

```tsx
Date.parse('07-20-1969');
```

<!-- end auto-generated rule header -->
