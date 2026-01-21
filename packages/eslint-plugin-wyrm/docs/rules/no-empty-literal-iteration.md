# wyrm/no-empty-literal-iteration

📝 Forbid iterating over empty literals.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`for..of` loop over an empty array:

```tsx
for (const x of []) {
}
```

`for..of` loop over an empty string:

```tsx
for (const x of '') {
}
```

`for..in` loop over an empty object:

```tsx
for (const x in {}) {
}
```

`.forEach()` over an empty array:

```tsx
[].forEach(() => {});
```

`.map()` over an empty array:

```tsx
[].map(() => {});
```

`.reduce()` over an empty array:

```tsx
[].reduce(() => {});
```

`.some()` over an empty array:

```tsx
[].some(() => {});
```

### Correct ✅

`for..of` loop over a non-empty array literal:

```tsx
for (const x of [1, 2, 3]) {
}
```

<!-- end auto-generated rule header -->

## Related

- [`sonarjs/no-empty-collection`](https://sonarsource.github.io/rspec/#/rspec/S4158/javascript)
