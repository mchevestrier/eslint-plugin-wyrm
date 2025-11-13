# Forbid useless IIFEs (`wyrm/no-useless-iife`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Useless IIFE with arrow function:

```tsx
const x = (() => 2)();
```

Useless IIFE (wrapped imperative logic):

```tsx
function quux() {
  (() => {
    foo();
    bar();
    baz();
  })();
}
```

### Correct ✅

Useful IIFE:

```tsx
const foo = (() => {
  if (bar) return 42;
  if (baz) return 17;
  return 105;
})();
```

<!-- end auto-generated rule header -->

## Prior Art

- go-critic: [unlambda](https://go-critic.com/overview.html#unlambda)
