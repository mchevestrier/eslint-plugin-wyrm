import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, TSESLint } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, type Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow unnecessary intermediary variables',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      useNamedDestructuring:
        'This intermediary variable may not be necessary. You could just rename {{first}} to {{text}}',
      renameToNamedDestructuring: 'Rename {{first}} to {{text}}',

      uselessIntermediaryVariable:
        'This intermediary variable may not be necessary. You could just rename {{first}} to {{second}}',
      renameFirstToSecond: 'Rename {{first}} to {{second}}',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!node.init) return;

        if (node.id.type !== AST_NODE_TYPES.Identifier) return;
        if (node.id.typeAnnotation) return;

        if (node.parent.kind !== 'const') return;
        if (node.parent.declarations.length > 1) return;
        if (node.parent.parent.type === AST_NODE_TYPES.ExportNamedDeclaration) return;

        const scope = context.sourceCode.getScope(node);

        if (node.init.type === AST_NODE_TYPES.Identifier) {
          checkIdent(node.init, node.id);
          return;
        }

        if (
          node.init.type === AST_NODE_TYPES.MemberExpression &&
          node.init.object.type === AST_NODE_TYPES.Identifier &&
          !node.init.computed &&
          node.init.property.type === AST_NODE_TYPES.Identifier
        ) {
          checkPropertyAccess(node.init.object, node.id, node.init.property);
        }

        function getValidVariableDef(
          ident: TSESTree.Identifier,
        ): Option<TSESTree.VariableDeclarator> {
          const maybeIdentDef = getIdentDef(ident);
          if (!maybeIdentDef.some) return None;
          const identDef = maybeIdentDef.value;

          if (identDef.id.type !== AST_NODE_TYPES.Identifier) return None;

          if (identDef.parent.declarations.length > 1) return None;
          if (identDef.parent.declare) return None;

          if (identDef.parent.parent.type === AST_NODE_TYPES.ExportNamedDeclaration) {
            return None;
          }

          // Definition is in the same scope as the second identifier
          const defScope = context.sourceCode.getScope(identDef);
          if (defScope !== scope) return None;

          return Some(identDef);
        }

        function isAllowedIdentifier(ident: TSESTree.Identifier): boolean {
          if (isUppercaseIdentifier(ident)) return true;

          const variable = ASTUtils.findVariable(scope, ident);
          if (!variable) return true;
          if (identifierHasMoreReferences(variable)) return true;
          return false;
        }

        function getIdentDef(
          ident: TSESTree.Identifier,
        ): Option<TSESTree.VariableDeclarator> {
          const variable = ASTUtils.findVariable(scope, ident);
          /* v8 ignore if -- @preserve */
          if (!variable) return None;
          const def = variable.defs.at(-1);
          /* v8 ignore if -- @preserve */
          if (!def) return None;
          if (def.type !== TSESLint.Scope.DefinitionType.Variable) return None;
          return Some(def.node);
        }

        function checkIdent(
          firstIdent: TSESTree.Identifier,
          secondIdent: TSESTree.Identifier,
        ) {
          if (isAllowedIdentifier(firstIdent)) return;
          const maybeFirstIdentDef = getValidVariableDef(firstIdent);
          if (!maybeFirstIdentDef.some) return;
          const firstIdentDef = maybeFirstIdentDef.value;

          const first = firstIdent.name;
          const second = secondIdent.name;

          context.report({
            node,
            messageId: 'uselessIntermediaryVariable',
            data: { first, second },
            suggest: [
              {
                messageId: 'renameFirstToSecond',
                data: { first, second },
                *fix(fixer) {
                  yield fixer.remove(node.parent);
                  yield fixer.replaceText(firstIdentDef.id, second);
                },
              },
            ],
          });
        }

        function checkPropertyAccess(
          firstIdent: TSESTree.Identifier,
          secondIdent: TSESTree.Identifier,
          propertyIdent: TSESTree.Identifier,
        ) {
          if (isAllowedIdentifier(firstIdent)) return;

          const maybeFirstIdentDef = getValidVariableDef(firstIdent);
          if (!maybeFirstIdentDef.some) return;
          const firstIdentDef = maybeFirstIdentDef.value;

          const first = firstIdent.name;
          const second = secondIdent.name;
          const property = propertyIdent.name;

          const namedDestructuringText =
            property === second ? `{ ${property} }` : `{ ${property}: ${second} }`;

          context.report({
            node,
            messageId: 'useNamedDestructuring',
            data: { first, text: namedDestructuringText },
            suggest: [
              {
                messageId: 'renameToNamedDestructuring',
                data: { first, text: namedDestructuringText },
                *fix(fixer) {
                  yield fixer.remove(node.parent);
                  yield fixer.replaceText(firstIdentDef.id, namedDestructuringText);
                },
              },
            ],
          });
        }
      },
    };
  },
});

function identifierHasMoreReferences(variable: TSESLint.Scope.Variable): boolean {
  return variable.references.length > 2;
}

function isUppercaseIdentifier(ident: TSESTree.Identifier): boolean {
  return ident.name === ident.name.toUpperCase();
}
