module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['standard', 'plugin:prettier/recommended', 'plugin:node/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
  },
  // For .ts file imports, see https://stackoverflow.com/a/61024769
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts'],
    },
  },
};
