/**
 * @fileoverview
 *
 * If you export a variable declared with `using` or `await using`, it will already be disposed when imported.
 */

import path from 'node:path';

import { TSESLint } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid exporting variables declared with `using` or `await using`',
      recommended: true,
    },
    schema: [],
    messages: {
      noExportUsing:
        'Do not export a variable declared with `using`. It will already be disposed when imported.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration?.type === AST_NODE_TYPES.VariableDeclaration &&
          (node.declaration.kind === 'using' || node.declaration.kind === 'await using')
        ) {
          context.report({ node, messageId: 'noExportUsing' });
          return;
        }

        const scope = context.sourceCode.getScope(node);

        for (const specifier of node.specifiers) {
          if (specifier.local.type !== AST_NODE_TYPES.Identifier) continue;
          checkIdentifier(specifier.local, scope);
        }
      },

      ExportDefaultDeclaration(node) {
        const scope = context.sourceCode.getScope(node);
        if (node.declaration.type !== AST_NODE_TYPES.Identifier) return;
        checkIdentifier(node.declaration, scope);
      },
    };

    function checkIdentifier(ident: TSESTree.Identifier, scope: TSESLint.Scope.Scope) {
      const variable = ASTUtils.findVariable(scope, ident);
      const def = variable?.defs.at(-1);
      if (!def) return;
      if (def.type !== TSESLint.Scope.DefinitionType.Variable) return;
      if (def.node.parent.kind !== 'using' && def.node.parent.kind !== 'await using') {
        return;
      }

      context.report({ node: ident, messageId: 'noExportUsing' });
    }
  },
});
