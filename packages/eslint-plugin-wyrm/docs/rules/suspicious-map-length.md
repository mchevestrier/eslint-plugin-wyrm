# wyrm/suspicious-map-length

📝 Disallow suspicious use of `.map().length`.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

Suspicious use of `.map().length`:

```tsx
export const z = [1, 2].map((x) => x > 2).length;

// Can be fixed to:
export const z = [1, 2].filter((x) => x > 2).length;
```

### Correct ✅

Correct use of `.filter().length`:

```tsx
export const z = [1, 2].filter((x) => x > 2).length;
```

<!-- end auto-generated rule header -->
