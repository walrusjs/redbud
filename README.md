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

- 添加默认别名 `@` 指向工作目录的 `src` 目录

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

### build

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
