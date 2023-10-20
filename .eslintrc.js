module.exports = {
  env: {
    node: true,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2],
  },
  ignorePatterns: [],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
};
