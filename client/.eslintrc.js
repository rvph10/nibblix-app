module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
  },
  settings: {
    next: {
      rootDir: 'client/',
    },
  },
};
