# wyrm/no-possibly-nullish-equality

📝 Forbid checking the equality of possibly nullish values.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Description

Comparing values that are possibly undefined or null can hint to subtle issues in business logic,
for example when equality is used to authorize access.

**Example:**

```ts
function canViewPrivateStuff(
  stuffOwnerId: string | null,
  currentUserId: string | null,
): boolean {
  // If both stuffOwnerId and currentUserId are null,
  // this will return true, which may have unintended consequences.
  return stuffOwnerId === currentUserId;
}
```

## Cases

### Incorrect ❌

Comparing possibly undefined values:

```tsx
declare const foo: string | undefined;
declare const bar: string | undefined;
foo === bar;
```

Comparing possibly null values:

```tsx
declare const foo: string | null;
declare const bar: string | null;
foo === bar;
```

Comparing possibly nullish values:

```tsx
declare const foo: string | undefined | null;
declare const bar: string | undefined | null;
foo === bar;
```

### Correct ✅

Compared values are not possibly nullish:

```tsx
declare const foo: string | number;
declare const bar: string | number;
foo === bar;
```

Left value is not possibly nullish:

```tsx
declare const foo: string | number;
declare const bar: string | number | null;
foo === bar;
```

Literal null comparison:

```tsx
declare const foo: number | undefined;
foo != null;
```

<!-- end auto-generated rule header -->
