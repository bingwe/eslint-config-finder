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
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',
      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',
    },
    project: './tsconfig.json',
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
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
