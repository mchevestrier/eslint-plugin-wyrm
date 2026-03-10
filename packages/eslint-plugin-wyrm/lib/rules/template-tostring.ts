import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid calling `.toString()` inside template expressions',
      strict: true,
    },
    schema: [],
    messages: {
      noToString: 'Calling `.toString()` is unnecessary here',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TemplateLiteral(node) {
        if (node.parent.type === AST_NODE_TYPES.TaggedTemplateExpression) return;

        for (const expr of node.expressions) {
          checkTemplateExpression(expr);
        }
      },
    };

    function checkTemplateExpression(expr: TSESTree.Expression) {
      const maybeObj = getToString(expr);
      if (!maybeObj.some) return;

      context.report({ node: expr, messageId: 'noToString' });
    }
  },
});

function getToString(expr: TSESTree.Expression): Option<TSESTree.Expression> {
  if (expr.type !== AST_NODE_TYPES.CallExpression) return None;
  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.callee.property.name !== 'toString') return None;
  return Some(expr.callee.object);
}
