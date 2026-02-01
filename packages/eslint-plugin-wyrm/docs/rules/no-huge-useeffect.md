# wyrm/no-huge-useeffect

📝 Forbid huge `useEffect` functions.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`useEffect` block spanning 21 lines:

```tsx
useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
```

### Correct ✅

`useEffect` block spanning 20 lines:

```tsx
useEffect(() => {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
}, []);
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                       | Type   |
| :----------- | :---------------------------------------------------------------- | :----- |
| `maxNbLines` | Maximum number of lines for a `useEffect` function. Default: `20` | Number |

<!-- end auto-generated rule options list -->
