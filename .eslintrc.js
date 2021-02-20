module.exports = {
  extends: ['plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 9,
  },
  plugins: ['prettier'],
  overrides: [
    {
      files: ['rollup.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
  rules: {},
};
