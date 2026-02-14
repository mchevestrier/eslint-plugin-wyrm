import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid using `any` when a stricter type can be trivially inferred',
      requiresTypeChecking: true,
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noObviousAny:
        'Do not use `any` when a stricter type can be trivially inferred: {{inferredType}}',
    },
  },
  defaultOptions: [],
  create(context) {
    function isFunctionExport(
      id: TSESTree.Identifier,
      stmt: TSESTree.Statement,
    ): boolean {
      if (stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
        if (stmt.declaration.type !== AST_NODE_TYPES.Identifier) return false;

        const scope = context.sourceCode.getScope(stmt.declaration);
        const variable = ASTUtils.findVariable(scope, stmt.declaration);
        if (!variable) return false;

        if (variable.identifiers.includes(id)) {
          return true;
        }
      }

      if (stmt.type === AST_NODE_TYPES.ExportNamedDeclaration) {
        const scope = context.sourceCode.getScope(stmt);

        return stmt.specifiers
          .map((specifier) => specifier.exported)
          .filter((exported) => exported.type === AST_NODE_TYPES.Identifier)
          .some((exported) => {
            const variable = ASTUtils.findVariable(scope, exported);
            if (!variable) return false;
            return variable.identifiers.includes(id);
          });
      }

      return false;
    }

    function isFunctionExported(node: FunctionNode, id: TSESTree.Identifier): boolean {
      if (node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration) return true;
      if (node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration) return true;

      return context.sourceCode.ast.body.some((stmt) => isFunctionExport(id, stmt));
    }

    function checkFunction(node: FunctionNode) {
      const id = getFunctionName(node);
      if (!id) return;
      if (isFunctionExported(node, id)) return;

      const scope = context.sourceCode.getScope(node);
      const variable = ASTUtils.findVariable(scope, id);
      /* v8 ignore next -- @preserve */
      if (!variable) return;

      const parents = variable.references
        .map((ref) => ref.identifier.parent)
        .filter((parent) => parent.type === AST_NODE_TYPES.CallExpression);

      const allArgs = parents.map((parent) => parent.arguments);

      for (const [i, param] of node.params.entries()) {
        if (param.type !== AST_NODE_TYPES.Identifier) continue;
        if (!param.typeAnnotation) continue;
        const { typeAnnotation } = param.typeAnnotation;
        if (typeAnnotation.type !== AST_NODE_TYPES.TSAnyKeyword) {
          continue;
        }

        const currentParamArguments = allArgs
          .map((args) => args.at(i))
          .filter((arg) => arg !== undefined);

        const inferredType = inferTypeFromArguments(currentParamArguments);

        if (!inferredType) return;

        context.report({
          node: param,
          messageId: 'noObviousAny',
          data: { inferredType },
          fix(fixer) {
            return fixer.replaceText(typeAnnotation, inferredType);
          },
        });
      }
    }

    function inferTypeFromArguments(
      args: TSESTree.CallExpressionArgument[],
    ): string | null {
      const services = ESLintUtils.getParserServices(context);
      const checker = services.program.getTypeChecker();
      const types = args.map((arg) => services.getTypeAtLocation(arg));

      if (
        types.some(
          (t) => t.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never),
        )
      ) {
        return null;
      }

      const typesAsStrings = types
        .map((widened) => checker.getBaseTypeOfLiteralType(widened))
        .map((widened) => checker.typeToString(widened));
      return [...new Set(typesAsStrings)].join(' | ');
    }

    return {
      VariableDeclarator(node) {
        if (!node.init) return;
        if (!node.id.typeAnnotation) return;
        const { typeAnnotation } = node.id.typeAnnotation;
        if (typeAnnotation.type !== AST_NODE_TYPES.TSAnyKeyword) return;

        if (node.init.type === AST_NODE_TYPES.ArrayExpression) {
          const inferredType = 'any[]';
          context.report({
            node,
            messageId: 'noObviousAny',
            data: { inferredType },
            fix(fixer) {
              return fixer.replaceText(typeAnnotation, inferredType);
            },
          });
          return;
        }

        const services = ESLintUtils.getParserServices(context);
        const type = services.getTypeAtLocation(node.init);

        if (type.flags & ts.TypeFlags.NumberLike) {
          const inferredType = 'number';
          context.report({
            node,
            messageId: 'noObviousAny',
            data: { inferredType },
            fix(fixer) {
              return fixer.replaceText(typeAnnotation, inferredType);
            },
          });
          return;
        }

        if (type.flags & ts.TypeFlags.StringLike) {
          const inferredType = 'string';
          context.report({
            node,
            messageId: 'noObviousAny',
            data: { inferredType },
            fix(fixer) {
              return fixer.replaceText(typeAnnotation, inferredType);
            },
          });
          return;
        }

        if (type.flags & ts.TypeFlags.BooleanLike) {
          const inferredType = 'boolean';
          context.report({
            node,
            messageId: 'noObviousAny',
            data: { inferredType },
            fix(fixer) {
              return fixer.replaceText(typeAnnotation, inferredType);
            },
          });
        }
      },

      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
});

type FunctionNode =
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression;

function getFunctionName(node: FunctionNode): TSESTree.Identifier | null {
  const nodeType = node.type;

  switch (nodeType) {
    case AST_NODE_TYPES.FunctionDeclaration:
      return node.id;

    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.ArrowFunctionExpression:
      if (node.parent.type !== AST_NODE_TYPES.VariableDeclarator) return null;
      if (node.parent.id.type !== AST_NODE_TYPES.Identifier) return null;
      return node.parent.id;

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = nodeType;
      console.error(`Unexpected node type: ${check}`);
      return null;
    }
  }
}
