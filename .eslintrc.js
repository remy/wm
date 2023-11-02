module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2],
  },
  ignorePatterns: [],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};
