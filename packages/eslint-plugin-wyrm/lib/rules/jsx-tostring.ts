import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import type * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid calling `.toString()` inside JSX expressions containers',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noToString: 'Calling `.toString()` is unnecessary here',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    let checker: ts.TypeChecker | undefined;
    function getChecker() {
      checker ??= getServices().program.getTypeChecker();
      return checker;
    }

    return {
      JSXExpressionContainer(node) {
        checkJsxExpression(node);
      },
    };

    function checkJsxExpression(container: TSESTree.JSXExpressionContainer) {
      const { expression } = container;
      if (expression.type === AST_NODE_TYPES.JSXEmptyExpression) return;

      const maybeObj = getToString(expression);
      if (!maybeObj.some) return;
      const obj = maybeObj.value;
      const objType = getServices().getTypeAtLocation(obj);

      const { parent } = container;

      if (parent.type === AST_NODE_TYPES.JSXFragment) {
        context.report({
          node: expression,
          messageId: 'noToString',
          fix(fixer) {
            const txt = context.sourceCode.getText(obj);
            return fixer.replaceText(expression, txt);
          },
        });
        return;
      }

      if (parent.type !== AST_NODE_TYPES.JSXElement) return;
      const { openingElement } = parent;

      // Intrinsic elements (like div, span, etc.)
      if (
        openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
        /^[a-z]/u.test(openingElement.name.name)
      ) {
        context.report({
          node: expression,
          messageId: 'noToString',
          fix(fixer) {
            const txt = context.sourceCode.getText(obj);
            return fixer.replaceText(expression, txt);
          },
        });
        return;
      }

      const elementType = getServices().getTypeAtLocation(openingElement.name);
      const maybeChildrenType = getChildrenPropTypeFromComponentType(elementType);
      if (!maybeChildrenType.some) return;
      const childrenType = maybeChildrenType.value;

      if (!isAssignableTo(objType, childrenType)) return;
      context.report({
        node: expression,
        messageId: 'noToString',
        fix(fixer) {
          const txt = context.sourceCode.getText(obj);
          return fixer.replaceText(expression, txt);
        },
      });
    }

    function getChildrenPropTypeFromComponentType(type: ts.Type): Option<ts.Type> {
      return getFirstOption([
        // Function components
        getChildrenTypeFromSignatures(type.getCallSignatures()),
        // Class components
        getChildrenTypeFromSignatures(type.getConstructSignatures()),
      ]);
    }

    function getChildrenTypeFromSignatures(
      signatures: readonly ts.Signature[],
    ): Option<ts.Type> {
      for (const signature of signatures) {
        const maybeChildrenType = getChildrenTypeFromSignature(signature);
        if (!maybeChildrenType.some) continue;
        return maybeChildrenType;
      }

      return None;
    }

    function getChildrenTypeFromSignature(signature: ts.Signature): Option<ts.Type> {
      const [param] = signature.getParameters();
      if (!param) return None;

      const paramType = getValueTypeFromSymbol(param);
      /* v8 ignore if -- @preserve */
      if (!paramType) return None;

      const childrenProp = paramType.getProperty('children');
      if (!childrenProp) return None;

      const childrenType = getValueTypeFromSymbol(childrenProp);
      if (childrenType) return Some(childrenType);
      return None;
    }

    function getValueTypeFromSymbol(symbol: ts.Symbol): ts.Type | null {
      if (!symbol.valueDeclaration) return null;
      return getChecker().getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    }

    function isAssignableTo(source: ts.Type, target: ts.Type): boolean {
      return getChecker().isTypeAssignableTo(source, getChecker().getWidenedType(target));
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
