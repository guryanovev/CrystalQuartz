import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals'; // Optional for env globals

// import importPlugin from 'eslint-plugin-import';

export default [
  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        // project: './tsconfig.json'
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript rules
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsEslint,
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
      'one-var': ['error', 'never'],
      'no-var': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // Prettier with import sorting (must be last)
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': [
        'warn',
        {
          semi: true,
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2,
          importOrder: ['^react$', '^@?\\w', '^@/', '^[../]', '^[./]'],
          importOrderSeparation: true,
          importOrderSortSpecifiers: true,
          plugins: ['@ianvs/prettier-plugin-sort-imports'],
        },
      ],
    },
  },

  // Ignore patterns (replaces .eslintignore)
  {
    ignores: ['**/node_modules/', '**/dist/', '**/dist-dev-server/', '**/build/', '**/*.d.ts'],
  },
];
