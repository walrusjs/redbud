import type { ExtendedLoaderContext } from 'loader-runner';
import type { Api } from '../../../types';
import type { BundlessConfig } from '../../types';

export interface LoaderOuput {
  result: string;
  options: {
    ext?: string;
    declaration?: boolean;
  };
}

export interface LoaderContext {
  /**
   * final bundless config
   */
  config: BundlessConfig;
  /**
   * project package.json
   */
  pkg: Api['pkg'];
}

export interface LoaderItem {
  id: string;
  test: string | RegExp | ((path: string) => boolean);
  loader: string;
  options?: Record<string, any>;
}

/**
 * normal loader type (base on webpack loader)
 */
export type BundlessLoader = (
  this: ExtendedLoaderContext &
    LoaderContext & {
      setOutputOptions: (options: LoaderOuput['options']) => void;
    },
  content: string
) => string;

/**
 * bundless transformer type
 */
export type JSTransformer = (
  this: LoaderContext & {
    paths: {
      cwd: string;
      fileAbsPath: string;
    };
  },
  content: Parameters<BundlessLoader>[0]
) => ReturnType<BundlessLoader>;
