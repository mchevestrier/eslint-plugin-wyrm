# wyrm/prefer-getorinsert

📝 Enforce using `Map#getOrInsert`.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Cases

### Incorrect ❌

With Map#has in a condition:

```tsx
function foo(key: string) {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, defaultValue);
  return defaultValue;
}

// Can be fixed to:
function foo(key: string) {
  return map.getOrInsert(key, defaultValue);
}
```

With Map#set and a nullish coalescing fallback:

```tsx
map.set(key, map.get(key) ?? defaultValue);

// Can be fixed to:
map.getOrInsert(key, defaultValue);
```

With disjunction and conjunction:

```tsx
m.get('foo') || (m.set('foo', 42) && m.get('foo'));

// Can be fixed to:
m.getOrInsert('foo', 42);
```

### Correct ✅

With `Map#getOrInsert`:

```tsx
map.getOrInsert(key, defaultValue);
```

<!-- end auto-generated rule header -->

## When not to use this rule

Before enabling this rule, make sure your target runtime [supports `Map.prototype.getOrInsert()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/getOrInsert#browser_compatibility).
