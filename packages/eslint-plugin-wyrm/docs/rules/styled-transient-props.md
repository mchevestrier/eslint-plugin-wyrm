# wyrm/styled-transient-props

📝 Enforce using transient props in styled components to avoid polluting DOM elements with unknown props.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

No transient prop and not a valid attribute:

```tsx
const StyledDiv = styled.div<{ notFoundOnDiv: unknown }>`
  display: block;
`;
```

### Correct ✅

Valid JSX attribute:

```tsx
const StyledDiv = styled.div<{ dangerouslySetInnerHTML: unknown }>`
  display: block;
`;
```

Transient prop:

```tsx
const StyledDiv = styled.div<{ $notFoundOnDiv: unknown }>`
  display: block;
`;
```

<!-- end auto-generated rule header -->
