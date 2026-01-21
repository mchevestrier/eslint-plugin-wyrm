# wyrm/no-mutable-literal-fill

📝 Forbid using mutable literals to fill arrays.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

Passing a mutable object to the `Array.prototype.fill()` method can lead to surprising behavior,
as the same object passed as argument will be reused for all array elements.
So all array elements will contain a reference to the same object, and mutating one will mutate all the others as well.

**Example:**

```ts
const arr = Array(10).fill([]);
arr[0].push(42);
console.log(arr[2]); // [ 42 ]
// You can either instantiate a new object for each element:
Array(10)
  .fill(null)
  .map(() => []);
// Or mark the array elements as readonly:
Array(10).fill([] as const);
```

## Cases

### Incorrect ❌

Filling with empty array:

```tsx
Array(42).fill([]);
```

Filling with empty object:

```tsx
Array(42).fill({});
```

Filling with new `Map`:

```tsx
Array(42).fill(new Map());
```

### Correct ✅

Filling with `null` and mapping to empty arrays:

```tsx
Array(42)
  .fill(null)
  .map(() => []);
```

<!-- end auto-generated rule header -->
