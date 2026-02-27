import { describe, expect, it } from 'vitest';

import wyrm from './index.js';

describe('index', () => {
  it('default export should have rules', () => {
    expect(wyrm.rules.e).toBeDefined();
  });

  it('configs should have plugins', () => {
    expect(wyrm.configs.all).toHaveProperty('plugins', {
      wyrm: {
        rules: wyrm.rules,
        meta: {
          name: 'eslint-plugin-wyrm',
          version: expect.any(String),
        },
      },
    });
  });

  it('configs should have names', () => {
    const { configs } = wyrm;
    const {
      all,
      disableTypeChecked,
      recommended,
      recommendedTypeChecked,
      recommendedTypeCheckedOnly,
      strict,
      strictOnly,
      strictTypeChecked,
      strictTypeCheckedOnly,
    } = configs;

    expect(all.name).toBe('wyrm/all');
    expect(disableTypeChecked.name).toBe('wyrm/disableTypeChecked');
    expect(recommended.name).toBe('wyrm/recommended');
    expect(recommendedTypeChecked.name).toBe('wyrm/recommendedTypeChecked');
    expect(recommendedTypeCheckedOnly.name).toBe('wyrm/recommendedTypeCheckedOnly');
    expect(strict.name).toBe('wyrm/strict');
    expect(strictOnly.name).toBe('wyrm/strictOnly');
    expect(strictTypeChecked.name).toBe('wyrm/strictTypeChecked');
    expect(strictTypeCheckedOnly.name).toBe('wyrm/strictTypeCheckedOnly');
  });

  it('configs should have the right rules', () => {
    const { configs } = wyrm;
    const {
      all,
      disableTypeChecked,
      recommended,
      recommendedTypeChecked,
      recommendedTypeCheckedOnly,
      strict,
      strictOnly,
      strictTypeChecked,
      strictTypeCheckedOnly,
    } = configs;

    // all
    expect(all.rules).toHaveProperty('wyrm/de-morgan', 'error'); // recommended
    expect(all.rules).toHaveProperty('wyrm/e', 'error'); // strict
    expect(all.rules).toHaveProperty('wyrm/primitive-valueof', 'error'); // recommended, type checked
    expect(all.rules).toHaveProperty('wyrm/no-obvious-any', 'error'); // strict, type checked
    expect(all.rules).toHaveProperty('wyrm/no-numbered-comments', 'error'); // pedantic

    // disableTypeChecked
    expect(disableTypeChecked.rules).not.toHaveProperty('wyrm/de-morgan'); // recommended
    expect(disableTypeChecked.rules).not.toHaveProperty('wyrm/e'); // strict
    expect(disableTypeChecked.rules).toHaveProperty('wyrm/primitive-valueof', 'off'); // recommended, type checked
    expect(disableTypeChecked.rules).toHaveProperty('wyrm/no-obvious-any', 'off'); // strict, type checked
    expect(disableTypeChecked.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // recommended
    expect(recommended.rules).toHaveProperty('wyrm/de-morgan', 'error'); // recommended
    expect(recommended.rules).not.toHaveProperty('wyrm/e'); // strict
    expect(recommended.rules).not.toHaveProperty('wyrm/primitive-valueof'); // recommended, type checked
    expect(recommended.rules).not.toHaveProperty('wyrm/no-obvious-any'); // strict, type checked
    expect(recommended.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // recommendedTypeChecked
    expect(recommendedTypeChecked.rules).toHaveProperty('wyrm/de-morgan', 'error'); // recommended
    expect(recommendedTypeChecked.rules).not.toHaveProperty('wyrm/e'); // strict
    expect(recommendedTypeChecked.rules).toHaveProperty(
      'wyrm/primitive-valueof',
      'error',
    ); // recommended, type checked
    expect(recommendedTypeChecked.rules).not.toHaveProperty('wyrm/no-obvious-any'); // strict, type checked
    expect(recommendedTypeChecked.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // recommendedTypeCheckedOnly
    expect(recommendedTypeCheckedOnly.rules).not.toHaveProperty('wyrm/de-morgan'); // recommended
    expect(recommendedTypeCheckedOnly.rules).not.toHaveProperty('wyrm/e'); // strict
    expect(recommendedTypeCheckedOnly.rules).toHaveProperty(
      'wyrm/primitive-valueof',
      'error',
    ); // recommended, type checked
    expect(recommendedTypeCheckedOnly.rules).not.toHaveProperty('wyrm/no-obvious-any'); // strict, type checked
    expect(recommendedTypeCheckedOnly.rules).not.toHaveProperty(
      'wyrm/no-numbered-comments',
    ); // pedantic

    // strict
    expect(strict.rules).toHaveProperty('wyrm/de-morgan', 'error'); // recommended
    expect(strict.rules).toHaveProperty('wyrm/e', 'error'); // strict
    expect(strict.rules).not.toHaveProperty('wyrm/primitive-valueof'); // recommended, type checked
    expect(strict.rules).not.toHaveProperty('wyrm/no-obvious-any'); // strict, type checked
    expect(strict.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // strictOnly
    expect(strictOnly.rules).not.toHaveProperty('wyrm/de-morgan'); // recommended
    expect(strictOnly.rules).toHaveProperty('wyrm/e', 'error'); // strict
    expect(strictOnly.rules).not.toHaveProperty('wyrm/primitive-valueof'); // recommended, type checked
    expect(strictOnly.rules).not.toHaveProperty('wyrm/no-obvious-any'); // strict, type checked
    expect(strictOnly.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // strictTypeChecked
    expect(strictTypeChecked.rules).toHaveProperty('wyrm/de-morgan', 'error'); // recommended
    expect(strictTypeChecked.rules).toHaveProperty('wyrm/e', 'error'); // strict
    expect(strictTypeChecked.rules).toHaveProperty('wyrm/primitive-valueof', 'error'); // recommended, type checked
    expect(strictTypeChecked.rules).toHaveProperty('wyrm/no-obvious-any', 'error'); // strict, type checked
    expect(strictTypeChecked.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic

    // strictTypeCheckedOnly
    expect(strictTypeCheckedOnly.rules).not.toHaveProperty('wyrm/de-morgan'); // recommended
    expect(strictTypeCheckedOnly.rules).not.toHaveProperty('wyrm/e'); // strict
    expect(strictTypeCheckedOnly.rules).not.toHaveProperty('wyrm/primitive-valueof'); // recommended, type checked
    expect(strictTypeCheckedOnly.rules).toHaveProperty('wyrm/no-obvious-any', 'error'); // strict, type checked
    expect(strictTypeCheckedOnly.rules).not.toHaveProperty('wyrm/no-numbered-comments'); // pedantic
  });
});
