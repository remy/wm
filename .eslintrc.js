module.exports = {
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  rules: {
    'node/no-deprecated-api': 0,
    'no-console': 0,
  },
};
