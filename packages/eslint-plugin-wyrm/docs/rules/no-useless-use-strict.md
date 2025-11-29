# Forbid useless "use strict" directives (`wyrm/no-useless-use-strict`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`'use strict'` directive in TS file:

```tsx
// file.ts

'use strict';
```

`'use strict'` directive in ESM file:

```tsx
// file.mjs

'use strict';
```

`'use strict'` directive in class constructor:

```tsx
// file.cjs

class Klass {
  constructor() {
    'use strict';
  }
}
```

### Correct ✅

`'use strict'` directive in CJS file:

```tsx
// file.cjs

'use strict';
```

<!-- end auto-generated rule header -->

## Related

- [`unicorn/prefer-module`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md)
