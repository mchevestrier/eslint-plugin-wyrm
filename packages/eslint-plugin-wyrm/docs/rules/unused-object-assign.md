# wyrm/unused-object-assign

📝 Disallow unused `Object.assign()` expressions.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Unused `Object.assign()`:

```tsx
Object.assign({}, { foo: 42 });
```

### Correct ✅

Used `Object.assign()`:

```tsx
const fnord = Object.assign({}, { foo: 42 });
```

`Object.assign()` with side-effect:

```tsx
const quux = { bar: 105 };
Object.assign(quux, { foo: 42 });
```

<!-- end auto-generated rule header -->
