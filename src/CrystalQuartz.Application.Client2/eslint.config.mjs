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

  // Import order rules
  // {
  //     plugins: {
  //         import: importPlugin
  //     },
  //     rules: {
  //         'import/order': [
  //             'error',
  //             {
  //                 'groups': [
  //                     'builtin',
  //                     'external',
  //                     'internal',
  //                     'parent',
  //                     'sibling',
  //                     'index',
  //                     'object',
  //                     'type'
  //                 ],
  //                 'pathGroups': [
  //                     {
  //                         pattern: 'john-smith',
  //                         group: 'external',
  //                         position: 'before'
  //                     },
  //                     {
  //                         pattern: '@/**',
  //                         group: 'internal'
  //                     }
  //                 ],
  //                 'pathGroupsExcludedImportTypes': ['john-smith'],
  //                 'newlines-between': 'always',
  //                 'alphabetize': {
  //                     order: 'asc',
  //                     caseInsensitive: true
  //                 }
  //             }
  //         ],
  //         'import/first': 'error',
  //         'import/newline-after-import': 'error',
  //         'import/no-duplicates': 'error'
  //     }
  // },

  // TypeScript rules
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
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
    },
  },

  // React rules
  // {
  //     files: ['**/*.jsx', '**/*.tsx'],
  //     plugins: {
  //         react: reactPlugin,
  //         'react-hooks': reactHooks,
  //         'jsx-a11y': jsxA11y
  //     },
  //     rules: {
  //         ...reactPlugin.configs.recommended.rules,
  //         ...reactHooks.configs.recommended.rules,
  //         ...jsxA11y.configs.recommended.rules,
  //         'react/react-in-jsx-scope': 'off',
  //         'react/jsx-uses-react': 'off',
  //         'react/prop-types': 'off'
  //     }
  // },

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
    ignores: ['**/node_modules/', '**/dist/', '**/build/', '**/*.d.ts'],
  },
];
