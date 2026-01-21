# wyrm/no-self-object-assign

📝 Forbid using `Object.assign()` with the same object as both target and source.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`Object.assign()` to self:

```tsx
const obj = {};
Object.assign(obj, obj);
```

### Correct ✅

With different identifiers:

```tsx
const obj1 = {};
const obj2 = {};
Object.assign(obj1, obj2);
```

<!-- end auto-generated rule header -->
