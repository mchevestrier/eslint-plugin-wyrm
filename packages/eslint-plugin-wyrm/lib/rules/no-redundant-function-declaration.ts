import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid redundant function declarations',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noRedundantFunctionDeclaration:
        'You should just write a plain function declaration instead of assigning it to a variable.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      FunctionExpression(node) {
        if (node.id === null) return;
        if (node.parent.type !== AST_NODE_TYPES.VariableDeclarator) return;
        const varDecl = node.parent.parent;
        const declarators = varDecl.declarations;

        if (varDecl.kind !== 'const') return;
        if (node.parent.id.type !== AST_NODE_TYPES.Identifier) return;

        const isNamedExport =
          varDecl.parent.type === AST_NODE_TYPES.ExportNamedDeclaration;
        const namedExport = varDecl.parent;
        const fnName = node.id.name;
        const varName = node.parent.id.name;

        context.report({
          node,
          messageId: 'noRedundantFunctionDeclaration',
          *fix(fixer) {
            const fnDecl = context.sourceCode
              .getText(node)
              .replace(`function ${fnName}`, `function ${varName}`);
            const fnText = isNamedExport ? `export ${fnDecl}` : fnDecl;

            if (declarators.length <= 1) {
              // Single declarator

              // Remove the whole named export
              if (isNamedExport) yield fixer.remove(namedExport);
              // Or remove the whole declaration
              else yield fixer.remove(varDecl);

              // And insert the function declaration after
              yield fixer.insertTextAfter(varDecl, fnText);

              return;
            }

            // Multiple declarators
            // Remove the current declarator
            yield fixer.remove(node.parent);

            if (declarators[0] === node.parent) {
              // Clean the next separator if the declarator was in first position
              const sep = context.sourceCode.getTokenAfter(node.parent);
              /* v8 ignore else -- @preserve */
              if (sep) yield fixer.remove(sep);
            } else {
              // Clean the previous separator if the declarator wasn't in first position
              const sep = context.sourceCode.getTokenBefore(node.parent);
              /* v8 ignore else -- @preserve */
              if (sep) yield fixer.remove(sep);
            }

            // And insert the function declaration after
            yield fixer.insertTextAfter(varDecl, `\n${fnText}`);
          },
        });
      },
    };
  },
});
