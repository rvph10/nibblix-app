module.exports = {
  extends: [
    './react',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'error',
    'react/react-in-jsx-scope': 'off'
  }
};