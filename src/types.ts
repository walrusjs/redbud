import type { IServicePluginAPI, PluginAPI } from '@umijs/core';
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
   * @todo  real type definition
   */
  postcssOptions?: any;

  /**
   * configure autoprefixer
   * @todo  real type definition
   */
  autoprefixer?: any;

  /**
   * configure extra babel presets
   * @todo  real type definition
   */
  extraBabelPresets?: any[];

  /**
   * configure extra babel plugins
   * @todo  real type definition
   */
  extraBabelPlugins?: any[];
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
   * @todo  real type definition
   */
  chainWebpack?: (args: any) => any;
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
