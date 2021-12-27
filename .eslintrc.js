module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended', // recommended rules for eslint
    'plugin:@typescript-eslint/recommended', // recommended rules for typescript eslint
    'airbnb-base', // airbnb rules
    'plugin:prettier/recommended', // prettier recommended rules
    'plugin:import/errors', // error rules
    'plugin:import/warnings', // warnings rules
    'plugin:import/typescript', // typescript rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error', // show error for prettier rules
    'import/extensions': 'off', // switch off files extension during import
    'no-console': 'off',
    'import/order': [
      // rule for grouping and maintain order import
      'error',
      {
        'newlines-between': 'never',
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code
        project: './tsconfig.json',
      },
    },
  },
};
