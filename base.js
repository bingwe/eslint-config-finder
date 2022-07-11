module.exports = {
  // 以当前目录为根目录，不再向上查找 .eslintrc.js
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
    },
    requireConfigFile: false,
    allowImportExportEverywhere: false,
  },
  extends: ['airbnb-base'],
  rules: {
    'global-require': 0,
    'import/no-dynamic-require': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx'],
      },
    },
  },
}
