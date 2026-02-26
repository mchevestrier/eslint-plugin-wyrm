/**
 * @fileoverview
 *
 * This rule forbids comparisons that don't make sense since a size cannot be negative.
 */

import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import type { Option } from '../utils/option.js';
import { None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid sloppy collection size checks',
      recommended: true,
    },
    schema: [],
    messages: {
      noSloppyLengthCheck:
        'A {{property}} probably cannot be negative. Use `=== 0` instead.',
      noRedundantLengthCheck:
        'Both sides of the logical expression check the same thing ({{property}} cannot be negative).',
      noConstantLengthCheck:
        'A {{property}} is probably always superior or equal to 0. Use `> 0` instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkFlags(flags: Flags, info: Omit<Info, 'op'>, node: TSESTree.Node) {
      const { property, value } = info;
      // Comparing to a negative number never makes sense
      if (value < 0) {
        context.report({ node, messageId: 'noSloppyLengthCheck', data: { property } });
        // return;
      }

      if (flags & Flags.INFERIOR_TO_ZERO) {
        // Possibly impossible condition
        context.report({ node, messageId: 'noSloppyLengthCheck', data: { property } });
      }

      if (flags & Flags.EQUAL_TO_ZERO && flags & Flags.SUPERIOR_TO_ZERO) {
        // Constant condition
        context.report({ node, messageId: 'noConstantLengthCheck', data: { property } });
      }
    }

    function checkBinaryExpression(node: TSESTree.SymmetricBinaryExpression) {
      const maybeFlags = getFlagsForBinaryExpression(node);
      if (!maybeFlags.some) return;
      const { flags, info } = maybeFlags.value;
      checkFlags(flags, info, node);
    }

    function checkLogicalExpression(node: TSESTree.LogicalExpression) {
      const maybeFlags = getFlagsForLogicalExpression(node);
      if (!maybeFlags.some) return;

      const { flags, info } = maybeFlags.value;

      checkFlags(flags, info, node);
    }

    function getFlagsForLogicalOrBinaryExpression(
      node: TSESTree.Node,
    ): Option<{ flags: Flags; info: Info }> {
      if (isSymmetricBinaryExpression(node)) {
        return getFlagsForBinaryExpression(node);
      }

      if (node.type === AST_NODE_TYPES.LogicalExpression) {
        return getFlagsForLogicalExpression(node);
      }

      return None;
    }

    function getFlagsForLogicalExpression(node: TSESTree.LogicalExpression) {
      if (node.operator === '??') return None;

      const maybeLeft = getFlagsForLogicalOrBinaryExpression(node.left);
      const maybeRight = getFlagsForLogicalOrBinaryExpression(node.right);

      if (!maybeLeft.some) {
        if (node.operator === '&&') return None;
        return maybeRight;
      }
      if (!maybeRight.some) {
        if (node.operator === '&&') return None;
        return maybeLeft;
      }

      const left = maybeLeft.value;
      const right = maybeRight.value;

      const { info } = left;
      const { object, property } = info;

      if (object !== right.info.object) return None;
      if (property !== right.info.property) return None;

      if (left.flags === right.flags) {
        context.report({ node, messageId: 'noRedundantLengthCheck', data: { property } });
      }

      const flags = left.flags | right.flags;

      return Some({ flags, info });
    }

    return {
      LogicalExpression(node) {
        checkLogicalExpression(node);
      },

      BinaryExpression(node) {
        if (!isSymmetricBinaryExpression(node)) return;
        checkBinaryExpression(node);
      },
    };
  },
});

function getFlagsForBinaryExpression(node: TSESTree.SymmetricBinaryExpression) {
  const { operator } = node;
  if (!isComparisonOperator(operator)) return None;

  const maybeInfo = extractComparisonInfo({ ...node, operator });
  if (!maybeInfo.some) return None;
  const flags = getFlags(maybeInfo.value);
  return Some({ flags, info: maybeInfo.value });
}

/* eslint-disable @typescript-eslint/prefer-literal-enum-member, unicorn/prefer-math-trunc */
enum Flags {
  UNKNOWN = 0,
  INFERIOR_TO_ZERO = 1 << 0,
  EQUAL_TO_ZERO = 1 << 1,
  SUPERIOR_TO_ZERO = 1 << 2,
}
/* eslint-enable @typescript-eslint/prefer-literal-enum-member, unicorn/prefer-math-trunc */

// .length op value
function getFlags(info: Info): Flags {
  const { op, value } = info;

  if (value === 1 && op === '<') {
    return Flags.EQUAL_TO_ZERO;
  }
  if (value === -1 && op === '>') {
    return Flags.EQUAL_TO_ZERO | Flags.SUPERIOR_TO_ZERO;
  }

  if (value !== 0) return Flags.UNKNOWN;

  switch (op) {
    case '!=':
    case '!==':
      return Flags.SUPERIOR_TO_ZERO;

    case '==':
    case '===':
      return Flags.EQUAL_TO_ZERO;

    case '<':
      return Flags.INFERIOR_TO_ZERO;
    case '>':
      return Flags.SUPERIOR_TO_ZERO;

    case '<=':
      return Flags.EQUAL_TO_ZERO | Flags.INFERIOR_TO_ZERO;
    case '>=':
      return Flags.EQUAL_TO_ZERO | Flags.SUPERIOR_TO_ZERO;

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = op;
      // Stryker disable all
      console.error(`[wyrm] Unexpected binary operator: ${check}`);
      return Flags.UNKNOWN;
    }
  }
}

function extractNumberLiteralValue(node: TSESTree.Node): Option<number> {
  if (node.type === AST_NODE_TYPES.Literal) {
    if (typeof node.value !== 'number') return None;
    return Some(node.value);
  }

  if (node.type !== AST_NODE_TYPES.UnaryExpression) return None;
  if (node.operator !== '-') return None;
  const n = extractNumberLiteralValue(node.argument);
  if (!n.some) return None;
  return Some(-n.value);
}

enum SizeProperty {
  SIZE = 'size',
  LENGTH = 'length',
}

function getSizeProperty(propertyName: string): Option<SizeProperty> {
  switch (propertyName) {
    case 'length':
      return Some(SizeProperty.LENGTH);
    case 'size':
      return Some(SizeProperty.SIZE);

    default:
      return None;
  }
}

/** Reverse the direction of a comparison operator */
function reverseOperator(op: ComparisonOperator): ComparisonOperator {
  switch (op) {
    case '==':
    case '===':
    case '!=':
    case '!==':
      return op;

    case '<':
      return '>';
    case '<=':
      return '>=';
    case '>':
      return '<';
    case '>=':
      return '<=';

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = op;
      // Stryker disable all
      console.error(`[wyrm] Unexpected binary operator: ${check}`);
      return op;
    }
  }
}

type Info = {
  object: string;
  property: SizeProperty;
  value: number;
  op: ComparisonOperator;
};

type ComparisonNode = {
  left: TSESTree.Expression;
  right: TSESTree.Expression;
  operator: ComparisonOperator;
};

function extractComparisonInfo(node: ComparisonNode, reversed = false): Option<Info> {
  const { left, right, operator } = node;

  const fallback = reversed
    ? None
    : extractComparisonInfo({ left: right, right: left, operator }, true);

  const maybeValue = extractNumberLiteralValue(right);
  if (!maybeValue.some) return fallback;
  const { value } = maybeValue;

  if (left.type !== AST_NODE_TYPES.MemberExpression) return fallback;
  if (left.object.type !== AST_NODE_TYPES.Identifier) return fallback;
  if (left.property.type !== AST_NODE_TYPES.Identifier) return fallback;

  const sizeProperty = getSizeProperty(left.property.name);
  if (!sizeProperty.some) return fallback;
  const property = sizeProperty.value;
  const object = left.object.name;

  const op = reversed ? reverseOperator(operator) : operator;

  return Some({ object, property, value, op });
}

function isSymmetricBinaryExpression(
  node: TSESTree.Node,
): node is TSESTree.SymmetricBinaryExpression {
  if (node.type !== AST_NODE_TYPES.BinaryExpression) return false;
  return node.operator !== 'in';
}

type ValueOf<T> = T[keyof T];

type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

function isComparisonOperator(
  operator: ValueOf<TSESTree.BinaryOperatorToText>,
): operator is ComparisonOperator {
  switch (operator) {
    case '%':
    case '&':
    case '|':
    case '&&':
    case '||':
    case '*':
    case '**':
    case '+':
    case '-':
    case '/':
    case '<<':
    case '>>':
    case '>>>':
    case '^':
    case 'in':
    case 'instanceof':
      return false;

    case '!=':
    case '!==':
    case '<':
    case '<=':
    case '==':
    case '===':
    case '>':
    case '>=':
      return true;

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = operator;
      // Stryker disable all
      console.error(`[wyrm] Unexpected binary operator: ${check}`);
      return false;
    }
  }
}
