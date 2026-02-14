import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_HOOK_NAMES = ['useState', 'useRef'];

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid specifying the type arguments on the hook instead of on the generic class',
      strict: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          hooks: {
            description: `List of hooks to check. Default: \`${JSON.stringify(DEFAULT_HOOK_NAMES)}\``,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      useGenericConstructor:
        'Use new {{typeAnnotationText}}() and remove the type annotation on the hook',
      noInferable: 'There is no need to add a type annotation here',
    },
  },
  defaultOptions: [{ hooks: DEFAULT_HOOK_NAMES }],
  create(context, [options]) {
    return {
      CallExpression(node) {
        if (!isReactHook(node.callee, options.hooks)) return;

        const { typeArguments } = node;
        if (!typeArguments) return;
        const [typeAnnotation] = typeArguments.params;
        /* v8 ignore if -- @preserve */
        if (!typeAnnotation) return;
        if (typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) return;
        if (typeAnnotation.typeName.type !== AST_NODE_TYPES.Identifier) return;
        const typeAnnotationText = context.sourceCode.getText(typeAnnotation);

        const [arg] = node.arguments;
        if (!arg) return;
        const expr = extractExpression(arg);
        if (!expr) return;
        if (expr.type !== AST_NODE_TYPES.NewExpression) return;
        if (expr.callee.type !== AST_NODE_TYPES.Identifier) return;

        if (expr.callee.name !== typeAnnotation.typeName.name) return;

        if (!expr.typeArguments) {
          context.report({
            node,
            messageId: 'useGenericConstructor',
            data: { typeAnnotationText },
            *fix(fixer) {
              yield fixer.remove(typeArguments);
              yield fixer.replaceText(expr.callee, typeAnnotationText);
            },
          });
          return;
        }

        const txt = context.sourceCode.getText(expr.typeArguments);
        const exprTypeText = `${expr.callee.name}${txt}`;

        if (typeAnnotationText !== exprTypeText) return;

        context.report({
          node: typeAnnotation,
          messageId: 'noInferable',
          fix(fixer) {
            return fixer.remove(typeArguments);
          },
        });
      },
    };
  },
});

function isReactHook(callee: TSESTree.Expression, hooks: string[]): boolean {
  if (callee.type === AST_NODE_TYPES.Identifier && hooks.includes(callee.name)) {
    return true;
  }

  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (callee.object.type !== AST_NODE_TYPES.Identifier) return false;
  if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;
  if (callee.object.name !== 'React') return false;
  return hooks.includes(callee.property.name);
}

function extractExpression(expr: TSESTree.CallExpressionArgument) {
  if (
    expr.type !== AST_NODE_TYPES.FunctionExpression &&
    expr.type !== AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    return expr;
  }

  if (expr.body.type !== AST_NODE_TYPES.BlockStatement) {
    return expr.body;
  }

  const returnStatements = expr.body.body.filter(
    (stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement,
  );
  if (returnStatements.length > 1) return null;
  const [returnStatement] = returnStatements;
  if (!returnStatement) return null;
  return returnStatement.argument;
}
