const fs = require('fs')
const path = require('path')
const resolve = require('resolve')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const filePaths = {
  appPath: resolveApp('.'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
}

// 去掉通配符
const takeOutMatching = (str) => (str || '').replace(/\/\*.*/, '')

// 通过tsconfig.json或者jsconfig.json去查找别名
function getAliasMap() {
  // 是否存在js/ts配置文件
  const hasTsConfig = fs.existsSync(filePaths.appTsConfig)
  const hasJsConfig = fs.existsSync(filePaths.appJsConfig)

  if (hasTsConfig && hasJsConfig) {
    throw new Error('tsconfig.json 和 jsconfig.json同时存在，请删除其一')
  }

  let config

  // tsconfig优先级比较高
  if (hasTsConfig) {
    const ts = require(resolve.sync('typescript', {
      basedir: filePaths.appNodeModules,
    }))
    config = ts.readConfigFile(filePaths.appTsConfig, ts.sys.readFile).config
  } else if (hasJsConfig) {
    // jsconfig
    config = require(filePaths.appJsConfig)
  }

  // 未找到配置文件
  if (!config) {
    return []
  }

  config = config || {}
  const options = config.compilerOptions || {}
  const { baseUrl, paths } = options
  if (!baseUrl || !paths) {
    return []
  }

  const result = []
  Object.entries(paths).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      result.push([
        takeOutMatching(key),
        value.map((val) => `./${path.join(baseUrl, takeOutMatching(val))}`),
      ])
    }
  })

  return result
}

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
      // 全局不允许有返回值
      globalReturn: false,
      // 开启全局script模式
      impliedStrict: true,
      jsx: true,
    },
    // 即使没有 babelrc 配置文件，也使用 @babel/eslint-parser 来解析
    requireConfigFile: false,
    // 仅允许 import export 语句出现在模块的顶层
    allowImportExportEverywhere: false,
  },
  // 使用 eslint-config-airbnb-base 配置
  extends: ['airbnb-base'],
  rules: {
    // 需要在顶层调用require
    'global-require': 0,
    // 不能使用动态引入
    'import/no-dynamic-require': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: getAliasMap(),
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
