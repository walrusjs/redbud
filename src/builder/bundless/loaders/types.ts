import type { ExtendedLoaderContext } from 'loader-runner';
import type { Api } from '../../../types';
import type { BundlessConfig } from '../../config';

type SourceMap = string | null | undefined;

export interface LoaderOutput {
  content: string;
  options: {
    ext?: string;
    declaration?: boolean;
    map?: SourceMap;
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

/**
 * normal loader type (base on webpack loader)
 */
export type BundlessLoader = (
  this: Omit<ExtendedLoaderContext, 'async'> &
    LoaderContext & {
      cwd: string;

      itemDistAbsPath: string;

      /**
       * configure output options for current file
       */
      setOutputOptions: (options: LoaderOutput['options']) => void;

      /**
       * complete async method type
       */
      async: () => (
        err: Error | null,
        result?: LoaderOutput['content'],
      ) => void;
    },
  content: string,
) => LoaderOutput['content'] | void;

type JSTransformerResult = [LoaderOutput['content'], SourceMap?];

/**
 * bundless transformer type
 */
export type JSTransformer = (
  this: LoaderContext & {
    paths: {
      cwd: string;
      fileAbsPath: string;
      itemDistAbsPath: string;
    };
  },
  content: Parameters<BundlessLoader>[0],
) => JSTransformerResult | Promise<JSTransformerResult>;
