import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['build/**/*', 'coverage/**/*', 'node_modules/**/*', 'test/fixtures/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      semi: ['warn', 'always'],
      'no-useless-escape': 'warn',
      'no-console': 'error',
      'prefer-const': 'error',
    },
  },
];
