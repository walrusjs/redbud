import type {
  RedbudBaseConfig,
  RedbudBuildTypes,
  RedbudBundleConfig,
  RedbudBundlessConfig,
  RedbudBundlessTypes
} from '../types';

/**
 * declare bundler config
 */
export interface BundleConfig
  extends RedbudBaseConfig,
    Omit<RedbudBundleConfig, 'entry' | 'output'> {
  type: RedbudBuildTypes.BUNDLE;
  bundler: 'webpack';
  entry: string;
  output: {
    filename: string;
    path: string;
  };
}

/**
 * declare bundless config
 */
export interface BundlessConfig
  extends RedbudBaseConfig,
    Omit<RedbudBundlessConfig, 'input' | 'overrides'> {
  type: RedbudBuildTypes.BUNDLESS;
  format: RedbudBundlessTypes;
  input: string;
}

/**
 * declare union builder config
 */
export type BuilderConfig = BundleConfig | BundlessConfig;
