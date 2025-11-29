import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless "use strict" directives.',
      strict: true,
    },
    schema: [],
    messages: {
      noUseStrictInTS:
        'Strict mode is always enabled by TypeScript in transpiled JS output. You do not need a "use strict" directive.',
      noUseStrictInESM:
        'Strict mode is always enabled in ES modules. You do not need a "use strict" directive.',
      noUseStrictInClass:
        'Strict mode is always enabled in JS classes. You do not need a "use strict" directive.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Literal(node) {
        if (node.value !== 'use strict') return;
        if (node.parent.type !== AST_NODE_TYPES.ExpressionStatement) return;

        if (isTypeScript()) {
          context.report({ node, messageId: 'noUseStrictInTS' });
          return;
        }

        if (isESM()) {
          context.report({ node, messageId: 'noUseStrictInESM' });
          return;
        }

        if (isInsideClass(node)) {
          context.report({ node, messageId: 'noUseStrictInClass' });
        }
      },
    };

    function isTypeScript() {
      return context.filename.endsWith('.ts') || context.filename.endsWith('.tsx');
    }

    function isESM() {
      return context.languageOptions.sourceType === 'module';
    }
  },
});

function isInsideClass(node: TSESTree.Node) {
  if (!node.parent) return false;
  if (node.parent.type === AST_NODE_TYPES.ClassBody) return true;
  return isInsideClass(node.parent);
}
