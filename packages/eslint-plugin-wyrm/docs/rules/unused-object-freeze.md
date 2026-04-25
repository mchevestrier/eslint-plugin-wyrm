# wyrm/unused-object-freeze

📝 Disallow unused `Object.freeze()` expressions.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Unused `Object.freeze()`:

```tsx
Object.freeze({ foo: 42 });
```

### Correct ✅

Used `Object.freeze()`:

```tsx
const fnord = Object.freeze({ foo: 42 });
```

`Object.freeze()` with side-effect:

```tsx
const quux = { bar: 105 };
Object.freeze(quux);
```

<!-- end auto-generated rule header -->
