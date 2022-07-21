// eslint config
// https://cn.eslint.org/
// https://cn.eslint.org/docs/rules/
// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

// module.exports

module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  plugins: ['import', 'prettier'],
  rules: {
    '@typescript-eslint/member-ordering': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    'max-nested-callbacks': 0,
    'max-params': 0,
    'spaced-comment': 0,
    'no-undef': 0,
    complexity: ['error', 40],
    'no-promise-executor-return': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/prefer-for-of': 0,
    '@typescript-eslint//no-non-null-assertion': 0,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
};
