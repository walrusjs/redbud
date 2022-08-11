<p align="center">
  <a href="https://redbud.xingkang.wang">
    <img width="200" src="https://cdn.jsdelivr.net/gh/walrusjs/redbud@latest/public/logo.svg">
  </a>
</p>

<h1 align="center">Redbud</h1>

<div align="center">
基于 Umi4 架构，提供基础库开发工作流的解决方案。
</div>

<br />

**注意:** 本项目主要参考 [`father@4`](https://github.com/umijs/father-next) 的代码实现，并在其中加入自己对基础库开发工作流的一些理解。

与 father@4 主要区别如下:

- 暂无

经过对目前主流的一些基础库(组件库/工具库等)和打包工具(webpack/rollup/esbuild 等)的的研究，得出如何结论:

1. 编译模式主要分为以下两种

- Bundle: 将所有文件打包进一个文件;
- Bundless: 目录对目录;

2. 编译格式主要分为以下三种

- `esm`
- `cjs`
- `umd`

以 React 技术栈有名的 [antd](https://ant.design/) 组件库为例，打包输出目录为 `es`、`lib`、`dist` 就分别用到了上述两种编译模式

- `es` 和 `lib` 采用的就是 Bundless 模式；
- `dist` 采用的就是 Bundle 模式；

以 [father@3](https://github.com/umijs/father) 为例，就提供了 `babel` 和 `rollup` 两种模式供用户选择。(babel 就相当于 Bundless 模式；rolup 就相当于 Bundle 模式)

基于多年开源开发经验，一个好的打包工具应具备如下特性：

- 能够同时支持 `esm`、`cjs`、`umd` 三种编译格式
- `esm`、`cjs` 使用 `Bundless` 编译模式
- `umd` 使用 `Bundle` 编译模式
- 能够处理组件库和工具库的所有打包场景

## ✨ 特性

- 📦 依赖预打包 基于 ncc（打包文件）+ @microsoft/api-extractor（生成类型）
- ⚔️ 双模式构建
  - Bundle 模式：仅 UMD 产物走 bundle 模式，核心为 webpack
  - Bundless 模式：仅 ESM、CJS 产物走 bundless 模式，默认提供 babel（browser）+ esbuild（node）双编译核心，可基于插件系统注册 swc/tsc 模式

## 🏗 安装

```bash
# npm
$ npm install redbud --save -D

# yarn
$ yarn add redbud -D

# pnpm
$ pnpm i redbud -D
```

## Cli

### version

查看 `redbud` 的版本

```bash
$ redbud version
```

### dev

执行全量构建并 watch 变更做增量构建，仅支持 esm/cjs 产物

```bash
$ redbud dev
```

### build

执行全量构建

```bash
$ redbud build
```

### prebundle

执行依赖预打包

```bash
$ redbud prebundle
```

## 配置

### 公共配置

#### alias

- 类型：`Record<string, string>`
- 默认值：`undefined`

指定源码编译/转换过程中需要处理的别名，其中 Bundles 模式会自动将 `.js`、`.d.ts` 产物中本地路径的别名转换为相对路径。

#### define

- 类型：`Record<string, string>`
- 默认值：`undefined`

指定源码编译/转换过程中需要替换的变量，用法与 Webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/#usage) 一致。

#### extends

- 类型：`string`
- 默认值：`undefined`

指定继承的父配置文件路径。

#### extraBabelPlugins

- 类型：`string[]`
- 默认值：`undefined`

指定要额外挂载的 babel 插件。

> 注：在 Bundless 模式下、且 `transformer` 为 `esbuild` 时，该配置不生效。

#### extraBabelPresets

- 类型：`string[]`
- 默认值：`undefined`

指定要额外挂载的 babel 插件集。

> 注：在 Bundless 模式下、且 `transformer` 为 `esbuild` 时，该配置不生效。

#### platform

- 类型：`browser` | `node`
- 默认值：`<auto>`

指定构建产物的目标平台，其中 `esm` 与 `umd` 产物的默认 `platform` 为 `browser`，`cjs` 产物的默认 `platform` 为 `node`；指定为 `browser` 时产物默认兼容至 IE11，指定为 `node` 时产物默认兼容至 Node.js v14，兼容性不支持配置。

> 注：Bundless 模式下，如果手动将 `transformer` 指定为 `esbuild`，那么 `browser` 产物兼容性为 ES6 而不是 IE11。

### 构建配置

以构建产物类型划分构建配置，其中 `esm`、`cjs` 产物为 Bundless 构建模式，`umd` 产物为 Bundle 构建模式，另外依赖预打包 `prebundle` 产物也为 Bundle 构建模式。

### esm/cjs

- 类型：`object`
- 默认值：`undefined`

配置将源码转换为 ESModule/CommonJS 产物，支持以下子配置项，也支持覆盖外部的公共配置项。

#### input

- 类型：`string`
- 默认值：`src`

指定要转换的源码目录。

#### output

- 类型：`string`
- 默认值：`<auto>`

指定产物的输出目录，`esm` 产物的默认输出目录为 `dist/esm`，`cjs` 产物的默认输出目录为 `dist/cjs`。

#### transformer

- 类型：`babel` | `esbuild`
- 默认值：`<auto>`

指定源码的编译工具，当 `platform` 为 `node` 时，默认值为 `esbuild`，当 `platform` 为 `browser` 时，默认值为 `babel`。

#### overrides

- 类型：`object`
- 默认值：`undefined`

为指定源码子目录覆盖构建配置，例如：

```ts
export default {
  esm: {
    overrides: {
      // 将 server 文件夹下的源码以 node 为目标平台进行编译
      'src/server': {
        platform: 'node',
      },
    },
  },
};
```

#### ignores

- 类型：`string[]`
- 默认值：`undefined`

配置转换过程中需要忽略的文件，支持 glob 表达式，被匹配的文件将不会输出到产物目录。另外，father 会默认忽略源码目录中所有的 Markdown 文件和测试文件。

### umd

- 类型：`object`
- 默认值：`undefined`

配置将源码打包为 UMD 产物，支持以下子配置项，也支持覆盖外部的公共配置项。

#### name

- 类型：`string`
- 默认值：无

指定 umd 包的导出 library 名称，例如：

```ts
export default {
  umd: {
    name: 'redbudDemo',
  },
};
```

默认是全量导出 member exports，需要拆解 `default` 的话，可以通过 `chainWebpack` 配置修改 `libraryExport`，例如：

```ts
export default {
  umd: {
    name: 'redbudDemo',
    chainWebpack: (memo: any) => {
      memo.output.libraryExport('default');
      return memo;
    },
  },
};
```

#### entry

- 类型：`string` | `Record<string, Config>`
- 默认值：`src/index`

指定要打包的源码入口文件，支持配置多入口、并为每个入口文件单独覆盖构建配置，例如：

```ts
export default {
  umd: {
    entry: {
      'src/browser': {},
      'src/server': {
        platform: 'node',
      },
    },
  },
};
```

#### output

- 类型：`string`
- 默认值：`dist/umd`

指定产物的输出目录，输出文件名暂不支持配置，单 `entry` 时默认以 NPM 包名命名、多 `entry` 时默认与源码文件同名。

#### externals

- 类型：`Record<string, string>`
- 默认值：`undefined`

配置源码打包过程中需要处理的外部依赖。

#### chainWebpack

- 类型：`function`
- 默认值：`undefined`

使用 `webpack-chain` 自定义源码打包的 Webpack 配置。

#### postcssOptions

- 类型：`object`
- 默认值：`undefined`

配置源码打包过程中额外的 [PostCSS 配置项](https://webpack.js.org/loaders/postcss-loader/#postcssoptions)。

#### autoprefixer

配置源码打包过程中额外的 [Autoprefixer 配置项](https://github.com/postcss/autoprefixer#options)。

### prebundle

配置项目需要预打包的三方依赖，仅用于 Node.js 工具或框架项目降低安装体积、提升项目稳定性，例如 Umi 这类前端开发框架。

预打包支持以下配置项。

#### output

- 类型：`string`
- 默认值：`compiled`

指定预打包产物的输出目录，默认输出到`compiled`目录。

#### deps

- 类型：`string[]` | `Record<string, { minify?: boolean; dts?: boolean }>`
- 默认值：`undefined`

配置需要预打包的三方依赖，默认开启代码压缩、打包类型声明文件（如果是 TypeScript 项目且包含类型声明），且将每个依赖的打包产物输出到 `[output]/[package_name]` 目录下。

也可以单独对每个依赖进行配置，例如：

```ts
export default {
  prebundle: {
    // 只配置要预打包的依赖
    deps: ['rimraf'],

    // 配置预打包的依赖并指定详细配置
    deps: {
      rimraf: { minify: false },
    },
  },
};
```

#### extraDtsDeps

- 类型：`string[]`
- 默认值：`undefined`

配置仅需要打包 `d.ts` 类型声明文件的依赖。

#### extraExternals

- 类型：`Record<string, string>`
- 默认值：`undefined`

配置预打包过程中要额外处理的外部依赖。father 会默认对以下两类依赖做 external：

1. 预打包的所有目标依赖，并自动 external 到输出目录
2. 当前项目 `package.json` 中声明的 `dependencies`

## 目录结构

```
┣ ━ .github github 相关配置
┣ ━ .husky husky 相关配置 (git 钩子)
┣ ━ .vscode vscode 相关配置
┣ ━ docs 文档相关
┣ ━ bin 示例
┣ ━ compiled
┣ ━ examples 示例
┣ ━ src
┃　　┣ ━ builder
┃　　┣ ━ cli
┃　　┣ ━ commands
┃　　┣ ━ features
┃　　┣ ━ generators
┃　　┣ ━ prebundler
┃　　┣ ━ service
┃　　┣ ━ builder
┃　　┣ ━ constants.ts
┃　　┣ ━ defineConfig.ts
┃　　┣ ━ index.ts
┃　　┣ ━ preset.ts
┃　　┣ ━ registerMethods.ts
┃　　┗ ━ types.ts
┣ ━ test 测试相关
┣ ━ .editorconfig
┣ ━ .gitignore
┣ ━ .prettierignore
┣ ━ jest.config.ts
┣ ━ LICENSE
┣ ━ package.json
┣ ━ pnpm-lock.yaml
┣ ━ tsconfig.build.json
┗ ━ tsconfig.json
```
