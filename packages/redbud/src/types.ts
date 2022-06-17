import type { JSMinifier } from '@umijs/bundler-webpack/dist/types';
import type { IServicePluginAPI, PluginAPI } from '@umijs/core';

export type Api = PluginAPI &
  IServicePluginAPI & {
    /**
     * add bundless transformer
     */
    addTransformer: (transformer: Transformer) => void;
  };

export interface RedbudPreBundleConfig {
  /**
   * dependencies or entries need to be pre-bundled
   */
  deps: string[] | Record<string, { output?: string; minify?: boolean }>;

  /**
   * extra dependencies & declarations need to be externalized
   * @note all deps & package.json dependencies will be added to externals by default
   */
  extraExternals: Record<string, string>;
}

export enum RedbudBuildTypes {
  BUNDLE = 'bundle',
  BUNDLESS = 'bundless'
}

export enum RedbudJSTransformerTypes {
  BABEL = 'babel',
  ESBUILD = 'esbuild'
}

export enum RedbudPlatformTypes {
  NODE = 'node',
  BROWSER = 'browser'
}

export enum RedbudBundlessTypes {
  ESM = 'esm',
  CJS = 'cjs'
}

export interface RedbudBaseConfig {
  /** 编译平台 */
  platform?: `${RedbudPlatformTypes}`;

  /** 为源代码定义全局常量 */
  define?: Record<string, string>;

  /** 配置模块解析别名 */
  alias?: Record<string, string>;

  /** 配置 postcss */
  postcssOptions?: any;

  /** 配置 autoprefixer */
  autoprefixer?: any;

  /** configure extra babel presets */
  extraBabelPresets?: any[];

  /** configure extra babel plugins */
  extraBabelPlugins?: any[];
}

export interface RedbudBundlessConfig extends RedbudBaseConfig {
  /**
   * 源代码目录
   * @default src
   */
  input?: string;

  /**
   * 输出目录
   * @default dist
   */
  output?: string;

  /**
   * 通过键值覆盖每个子目录或文件的配置
   */
  overrides?: Record<string, Omit<RedbudBundlessConfig, 'input'> & RedbudBaseConfig>;

  /**
   * 代码转换器
   * 默认情况下，自动选择转换器（浏览器文件为 babel，Node文件为 esbuild）
   */
  transformer?: `${RedbudJSTransformerTypes}`;

  /**
   * 忽略特定目录和文件
   */
  ignores?: string[];
}

export interface RedbudBundleConfig extends RedbudBaseConfig {
  /**
   * 入口配置
   * @default src/index.{js,ts,jsx,tsx}
   */
  entry?: string | Record<string, Omit<RedbudBundleConfig, 'entry'> & RedbudBaseConfig>;

  /**
   * 指定暴露的全局变量
   * https://www.webpackjs.com/configuration/output/#output-library
   * @default ${camelCase(basename(pkg.name))}
   */
  library?: string;

  /**
   * 输出路径
   * @default dist
   */
  output?: string;

  /**
   * 设置哪些模块不打包
   */
  externals?: Record<string, string>;

  /** JS压缩配置 */
  jsMinifier?: JSMinifier;

  /**
   * 修改 webpack 配置，基于 webpack-chain。
   */
  chainWebpack?: (args: any) => any;
}

export interface RedbudConfig extends RedbudBaseConfig {
  /**
   * bundler config (umd)
   */
  umd?: RedbudBundleConfig;

  /**
   * transformer config (esm)
   */
  esm?: RedbudBundlessConfig & {
    /**
     * output directory
     * @default dist/esm
     */
    output?: string;
  };

  /**
   * transformer config (cjs)
   */
  cjs?: RedbudBundlessConfig & {
    /**
     * output directory
     * @default dist/cjs
     */
    output?: string;
  };
}
