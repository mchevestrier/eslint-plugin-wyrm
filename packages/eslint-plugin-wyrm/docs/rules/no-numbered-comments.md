# wyrm/no-numbered-comments

📝 Forbid numbered comments.

## Cases

### Incorrect ❌

Inline numbered comment:

```tsx
// 23. Do stuff
```

Block numbered comment:

```tsx
/* 23. Do stuff */
```

### Correct ✅

Not a numbered comment:

```tsx
// Ok
```

JSDoc numbered comment:

```tsx
/** 23. Do stuff */
```

<!-- end auto-generated rule header -->
