import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid variable declaration by destructuring object or array literals',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      uselessSpreadElement:
        'Remove this spread element from the array literal, it is most likely useless since its value is never read.',
      uselessSpreadProperty:
        'Remove this spread property from the object literal, it is most likely useless since its value is never read.',
      usePlainDeclaration:
        'Use a plain variable declaration instead of destructuring a literal',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!node.init) return;

        if (
          node.id.type === AST_NODE_TYPES.ArrayPattern &&
          node.init.type === AST_NODE_TYPES.ArrayExpression
        ) {
          checkArrayDecl(node, node.id, node.init);
          return;
        }

        if (
          node.id.type === AST_NODE_TYPES.ObjectPattern &&
          node.init.type === AST_NODE_TYPES.ObjectExpression
        ) {
          checkObjectDecl(node, node.id, node.init);
        }
      },
    };

    function checkArrayDecl(
      decl: TSESTree.VariableDeclarator,
      id: TSESTree.ArrayPattern,
      init: TSESTree.ArrayExpression,
    ) {
      const spreadElement = init.elements.find(
        (elt) => elt?.type === AST_NODE_TYPES.SpreadElement,
      );
      if (spreadElement) {
        // Check spread element
        const idx = init.elements.indexOf(spreadElement);
        if (idx >= id.elements.length) {
          context.report({
            node: spreadElement,
            messageId: 'uselessSpreadElement',
            *fix(fixer) {
              yield fixer.remove(spreadElement);

              const commaToken = context.sourceCode.getTokenAfter(spreadElement);
              if (
                idx === 0 &&
                commaToken?.type === AST_TOKEN_TYPES.Punctuator &&
                commaToken.value === ','
              ) {
                yield fixer.remove(commaToken);
              }
            },
          });
        }
        return;
      }

      if (!id.elements.every((elt) => elt?.type === AST_NODE_TYPES.Identifier)) return;
      if (!init.elements.every((elt) => elt?.type !== AST_NODE_TYPES.SpreadElement)) {
        return;
      }

      const entries = id.elements.map(
        (ident, i) =>
          [
            ident.name,
            init.elements
              .filter((elt) => elt?.type !== AST_NODE_TYPES.SpreadElement)
              .at(i),
          ] as const,
      );

      context.report({
        node: decl,
        messageId: 'usePlainDeclaration',
        fix(fixer) {
          const txt = entries
            .map(([key, value]) => {
              const valueTxt = value ? context.sourceCode.getText(value) : 'undefined';
              return `${key} = ${valueTxt}`;
            })
            .join(', ');
          return fixer.replaceText(decl, txt);
        },
      });
    }

    function checkObjectDecl(
      decl: TSESTree.VariableDeclarator,
      id: TSESTree.ObjectPattern,
      init: TSESTree.ObjectExpression,
    ) {
      if (!id.properties.every((prop) => prop.type === AST_NODE_TYPES.Property)) {
        return;
      }
      if (id.properties.some((prop) => prop.computed)) return;

      const patternKeys = id.properties.map((prop) => prop.key);
      if (!patternKeys.every((key) => key.type === AST_NODE_TYPES.Identifier)) {
        return;
      }
      const patternNames = patternKeys.map((key) => key.name);

      for (const initProp of init.properties) {
        if (initProp.type === AST_NODE_TYPES.Property) {
          if (initProp.computed) return;
          continue;
        }

        // Is this spread property useless?
        const idx = init.properties.indexOf(initProp);
        const subsequentPropertyNames = new Set(
          init.properties
            .slice(idx)
            .filter((prop) => prop.type === AST_NODE_TYPES.Property)
            .map((prop) => prop.key)
            .filter((key) => key.type === AST_NODE_TYPES.Identifier)
            .map((key) => key.name),
        );

        if (
          patternNames.every((patternName) => subsequentPropertyNames.has(patternName))
        ) {
          context.report({
            node: initProp,
            messageId: 'uselessSpreadProperty',
            *fix(fixer) {
              yield fixer.remove(initProp);
              const commaToken = context.sourceCode.getTokenAfter(initProp);
              if (
                idx === 0 &&
                commaToken?.type === AST_TOKEN_TYPES.Punctuator &&
                commaToken.value === ','
              ) {
                yield fixer.remove(commaToken);
              }
            },
          });
        }

        return;
      }

      const initMap = new Map(
        init.properties
          .filter((prop) => prop.type === AST_NODE_TYPES.Property)
          .map((prop) => [prop.key, prop.value] as const)
          .filter(
            (entry): entry is [TSESTree.Identifier, (typeof entry)[1]] =>
              entry[0].type === AST_NODE_TYPES.Identifier,
          )
          .map(([key, value]) => [key.name, value] as const),
      );
      const entries = patternNames.map(
        (patternName) => [patternName, initMap.get(patternName)] as const,
      );
      if (
        !entries.every(
          (entry): entry is [(typeof entry)[0], NonNullable<(typeof entry)[1]>] =>
            entry[1] !== undefined,
        )
      ) {
        return;
      }

      context.report({
        node: decl,
        messageId: 'usePlainDeclaration',
        fix(fixer) {
          const txt = entries
            .map(([key, value]) => {
              const valueTxt = context.sourceCode.getText(value);
              return `${key} = ${valueTxt}`;
            })
            .join(', ');
          return fixer.replaceText(decl, txt);
        },
      });
    }
  },
});
