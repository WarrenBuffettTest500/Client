// eslint-disable-next-line no-undef
module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': ['react'],
  'rules': {
    'comma-dangle': ['warn', 'always-multiline'],
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single'],
    'eol-last': ['warn', 'always'],
    'no-unused-vars': ['warn', { 'args': 'none' }],
    'arrow-parens': ['warn', 'as-needed'],
    'func-style': ['warn', 'expression'],
    'no-unsafe-finally': 'off',
    'react/prop-types': 'off',
  },
};
