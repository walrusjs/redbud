import type { ExtendedLoaderContext } from 'loader-runner';
import type { Api } from '../../../types';
import type { BundlessConfig } from '../../types';

export interface LoaderOutput {
  content: string;
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
  this: Omit<ExtendedLoaderContext, 'async'> &
    LoaderContext & {
      /**
       * configure output options for current file
       */
      setOutputOptions: (options: LoaderOutput['options']) => void;

      /**
       * complete async method type
       */
      async: () => (err: Error | null, result?: LoaderOutput['content']) => void;
    },
  content: string
) => LoaderOutput['content'] | void;

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
) => LoaderOutput['content'] | Promise<LoaderOutput['content']>;
