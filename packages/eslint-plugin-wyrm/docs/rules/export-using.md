# wyrm/export-using

📝 Forbid exporting variables declared with `using` or `await using`.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

If you export a variable declared with `using` or `await using`, it will already be disposed when imported.

## Cases

### Incorrect ❌

With a named export of an identifier declared with `using`:

```tsx
using foo = new Disposable();
export { foo };
```

With a default export of an identifier declared with `await using`:

```tsx
await using foo = new Disposable();
export default foo;
```

Direct named export of a variable declared with `using` (invalid in JS):

```tsx
export using foo = new Disposable();
```

### Correct ✅

Not exported:

```tsx
using foo = new Disposable();

const bar = 42;
export { bar };
```

<!-- end auto-generated rule header -->
