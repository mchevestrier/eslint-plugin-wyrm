# wyrm/nested-reduce

📝 Forbid nested `reduce` calls.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Nested `reduce` call:

```tsx
const total = numbers.reduce((outerAcc, innerArray) => {
  return (
    outerAcc +
    innerArray.reduce((innerAcc, num) => {
      return innerAcc + num;
    }, 0)
  );
}, 0);
```

### Correct ✅

Simple `reduce` call:

```tsx
[1, 2, 3].reduce((acc, cur) => {
  return acc + cur;
}, 0);
```

Simple `reduce` call inside a function inside another reduce:

```tsx
const total = numbers.reduce((outerAcc, outerCur) => {
  function foo() {
    [1, 2, 3].reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }

  return outerAcc + outerCur;
}, 0);
```

<!-- end auto-generated rule header -->
