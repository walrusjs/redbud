import type { IServicePluginAPI, PluginAPI } from '@umijs/core';
import type { IConfig as IBundlerWebpackConfig } from '@umijs/bundler-webpack/dist/types';
import type Autoprefixer from '@umijs/bundler-webpack/compiled/autoprefixer';
import type IWebpackChain from '@umijs/bundler-webpack/compiled/webpack-5-chain';
import type { Compiler } from '@umijs/bundler-webpack';
import type { TransformerItem } from './builder/bundless/loaders/javascript';

export type {
  BundlessLoader,
  JSTransformer,
} from './builder/bundless/loaders/types';

export type Api = PluginAPI &
  IServicePluginAPI & {
    /**
     * add bundless js transformer
     */
    addJSTransformer: (item: TransformerItem) => void;
  };

export enum RedbudBuildTypes {
  BUNDLE = 'bundle',
  BUNDLESS = 'bundless',
}

export enum RedbudJSTransformerTypes {
  BABEL = 'babel',
  ESBUILD = 'esbuild',
}

export enum RedbudPlatformTypes {
  NODE = 'node',
  BROWSER = 'browser',
}

export enum RedbudBundlessTypes {
  ESM = 'esm',
  CJS = 'cjs',
}

export interface RedbudBaseConfig {
  /**
   * compile platform
   * @default browser
   */
  platform?: `${RedbudPlatformTypes}`;

  /**
   * define global constants for source code, like webpack
   */
  define?: Record<string, string>;

  /**
   * configure module resolve alias, like webpack
   */
  alias?: Record<string, string>;

  /**
   * configure postcss
   */
  postcssOptions?: IBundlerWebpackConfig['postcssLoader'];

  /**
   * configure autoprefixer
   */
  autoprefixer?: Autoprefixer.Options;

  /**
   * configure extra babel presets
   */
  extraBabelPresets?: IBundlerWebpackConfig['extraBabelPresets'];

  /**
   * configure extra babel plugins
   */
  extraBabelPlugins?: IBundlerWebpackConfig['extraBabelPlugins'];
}

export interface RedbudBundlessConfig extends RedbudBaseConfig {
  /**
   * source code directory
   * @default src
   */
  input?: string;

  /**
   * output directory
   */
  output?: string;

  /**
   * specific transformer
   * @note  redbud will auto-select transformer by default (babel for browser files, esbuild for node files)
   */
  transformer?: `${RedbudJSTransformerTypes}`;

  /**
   * override config for each sub-directory or file via key-value
   */
  overrides?: Record<
    string,
    Omit<RedbudBundlessConfig, 'input'> & RedbudBaseConfig
  >;

  /**
   * ignore specific directories & files via ignore syntax
   */
  ignores?: string[];
}

export interface RedbudBundleConfig extends RedbudBaseConfig {
  /**
   * bundle entry config
   * @default src/index.{js,ts,jsx,tsx}
   * @note    support to override config for each entry via key-value
   */
  entry?:
    | string
    | Record<string, Omit<RedbudBundleConfig, 'entry'> & RedbudBaseConfig>;

  /**
   * bundle output path
   * @default dist/umd
   */
  output?: string;

  /**
   * external dependencies
   * @note  like umi externals
   */
  externals?: Record<string, string>;

  /**
   * modify webpack config via webpack-chain
   */
  chainWebpack?: (
    memo: IWebpackChain,
    args: { env: string; webpack: Compiler['webpack'] },
  ) => IWebpackChain;
}

export interface RedbudPreBundleConfig {
  /**
   * dependencies or entries need to be pre-bundled
   */
  deps:
    | string[]
    | Record<string, { output?: string; minify?: boolean; dts?: boolean }>;

  /**
   * extra dep declarations need to be pre-bundled
   */
  extraDtsDeps?: string[];

  /**
   * extra dependencies & declarations need to be externalized
   * @note  all deps & package.json dependencies will be added to externals by default
   */
  extraExternals: Record<string, string>;
}

export interface RedbudConfig extends RedbudBaseConfig {
  extends?: string;

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

  /**
   * deps pre-bundle config
   */
  prebundle?: RedbudPreBundleConfig;
}
