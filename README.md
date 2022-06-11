<p align="center">
  <a href="https://ant.design">
    <img width="200" src="https://cdn.jsdelivr.net/gh/walrusjs/redbud@latest/public/logo.svg">
  </a>
</p>

<h1 align="center">Redbud</h1>

<div align="center">
基于 Umi4 架构，提供基础库开发工作流完整的解决方案。
</div>

<br />

**注意:** 本项目主要参考 [`father@4`](https://github.com/umijs/umi-next/tree/master/packages/father) 的代码实现，并在其中加入自己对基础库工作流的一些理解。

对目前主流的一些基础库和打包工具的的研究，得出如何结果:

1. 编译的方式主要分为两种场景：
  - 目录对目录的这种编译方式;
  - 将所有文件打包进一个文件;
2. 目前主要提供 `esm`、`cjs`、`umd` 三种编译格式;

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

## Cli

### version

查看 `redbud` 的版本 

```bash
$ redbud version
```

### build
