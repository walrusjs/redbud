<h1 align="center">Redbud</h1>

基于Umi4架构，提供打包、Lint、发布等完整工作流的解决方案

本项目主要参考 [`father@4`](https://github.com/umijs/umi-next/tree/master/packages/father) 的代码实现，加入自己对打包、发布流程的一些理解。

## ✨ 特性

- 📦 依赖预打包 基于 ncc（打包文件）+ dts-packer（生成类型）
- 🛰 产物面向未来：默认不再提供 cjs 产物类型
- ⚔️ 双模式构建
  - Bundle 模式：仅 UMD 产物走 bundle 模式，核心为 webpack
  - Bundless 模式：仅 ESM 产物走 bundless 模式 + 生成 TS 类型定义，默认提供 babel（browser）+ esbuild（node）双编译核心，可基于插件系统注册 swc/tsc 模式

## 🏗 安装

```
// npm 
npm install redbud --save -D

// yarn
yarn add redbud -D

// pnpm
pnpm i redbud -D
```
