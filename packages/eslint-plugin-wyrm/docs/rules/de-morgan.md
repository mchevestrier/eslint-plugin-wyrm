# wyrm/de-morgan

📝 Enforce using De Morgan's law to simplify negated logical expressions.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Negated conjunction:

```tsx
!(foo && 24);

// Automatically fixed to:
!foo || !24;
```

Negated disjunction:

```tsx
!(foo || 24);

// Automatically fixed to:
!foo && !24;
```

### Correct ✅

Logical expression with negated components:

```tsx
!foo || !24;
```

<!-- end auto-generated rule header -->
