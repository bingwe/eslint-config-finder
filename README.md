# eslint-config-finder

前端统一规范，目前支持对 javascript、typescript、react 以及不同搭配下代码质量的检查，后续会支持 css style 和 vue 代码质量的检查

## 使用方法

### 推荐

> 1. 使用 vscode 编辑器
> 2. 添加 eslint 和 prettier 两个 extension
> 3. 推荐使用 npm 版本 >= 7.x

### 安装

```bash
npm install --save-dev eslint-config-finder
```

### javascript

在项目根目录下新建 .eslintrc.js 文件，并复制以下内容（某些情况下需要重启编辑器）

```javascript
module.exports = {
  extends: ['finder'],
}
```

### javascript + react

在项目根目录下新建 .eslintrc.js 文件，并复制以下内容（某些情况下需要重启编辑器）

```javascript
module.exports = {
  extends: ['finder', 'finder/react'],
}
```

### typescript + react

在项目根目录下新建 .eslintrc.js 文件，并复制以下内容（某些情况下需要重启编辑器）

```javascript
module.exports = {
  extends: ['finder', 'finder/react', 'finder/typescript'],
}
```

### 搭配 prettier 使用

另外安装以下依赖包

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

在项目根目录下新建 .prettierrc.js 文件，并复制以下内容（可自定义编辑）

```javascript
module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  semi: false,
}
```

修改 .eslintrc.js 文件，复制以下内容

```javascript
module.exports = {
  // extends 三选一
  // javascript
  // extends: ['finder', 'prettier'],
  // javascript + react
  // extends: ['finder', 'finder/react', 'prettier'],
  // typescript + react
  extends: ['finder', 'finder/react', 'finder/typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 2,
  },
}
```

### 别名配置

在代码中如果文件层级较深的引入文件层级较浅的模块时，会这样使用

```javascript
import App from '../../../App'
```

层级过多不够优雅，我们需要配置别名，例如使用“@”代表 src 文件夹，可以这样使用

```javascript
import App from '@/App'
```

为此，我们需要增加一些配置

#### javascript 项目

在根目录创建一个 jsconfig.json 文件，并复制以下内容（需重启编辑器）

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules"],
  "include": ["src/**/*"]
}
```

#### typescript 项目

在根目录创建一个 tsconfig.json 文件，并复制以下内容（需重启编辑器）

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", ".eslintrc.js"]
}
```

## 可能存在的问题

1. 在 typescript 项目中，.eslintrc.js 文件可能会报如下错误

```
Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser.
The file does not match your project config: .eslintrc.js.
The file must be included in at least one of the projects provided.eslint
```

### 解决方法

在 tsconfig.json 的 include 字段添加 ".eslintrc.js"

```json
{
  "include": ["src/**/*", ".eslintrc.js"]
}
```
