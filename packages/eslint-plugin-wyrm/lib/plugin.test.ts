import { describe, expect, it } from 'vitest';

import { plugin } from './plugin.js';

describe('plugin', () => {
  it('plugin should be defined', () => {
    expect(plugin).toStrictEqual({
      rules: expect.any(Object),
      meta: {
        name: 'eslint-plugin-wyrm',
        version: expect.any(String),
      },
    });
  });
});
