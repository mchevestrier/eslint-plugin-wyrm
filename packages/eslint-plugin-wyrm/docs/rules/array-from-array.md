# wyrm/array-from-array

📝 Forbid calling `Array.from` on arrays.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

`Array.from` called on an array:

```tsx
const arr = [1, 2, 3];
Array.from(arr);

// Automatically fixed to:
const arr = [1, 2, 3];
[...arr];
```

`Array.from` called on an array, with a map function:

```tsx
const arr = [1, 2, 3];
Array.from(arr, (n) => n + 2);

// Automatically fixed to:
const arr = [1, 2, 3];
arr.map((n) => n + 2);
```

`Array.from` called on an tuple:

```tsx
const arr = [1, 2, 3] as const;
Array.from(arr);

// Automatically fixed to:
const arr = [1, 2, 3] as const;
[...arr];
```

`Array.from` called on an tuple, with a map function:

```tsx
const arr = [1, 2, 3] as const;
Array.from(arr, (n) => n + 2);

// Automatically fixed to:
const arr = [1, 2, 3] as const;
arr.map((n) => n + 2);
```

### Correct ✅

`Array.from` called on an iterator:

```tsx
let s = new Set<number>();
s.add(42);
s.add(105);

Array.from(s);
```

`Array.from` called on an iterator, with a map function:

```tsx
let s = new Set<number>();
s.add(42);
s.add(105);

Array.from(s, (n) => n + 2);
```

<!-- end auto-generated rule header -->
