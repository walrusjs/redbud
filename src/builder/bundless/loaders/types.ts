import type { ExtendedLoaderContext } from 'loader-runner';
import type { Api } from '../../../types';
import type { IBundlessConfig } from '../../config';

export interface ILoaderOutput {
  content: string;
  options: {
    ext?: string;
    declaration?: boolean;
  };
}

export interface ILoaderContext {
  /**
   * final bundless config
   */
  config: IBundlessConfig;
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
    ILoaderContext & {
      cwd: string;
      /**
       * configure output options for current file
       */
      setOutputOptions: (options: ILoaderOutput['options']) => void;

      /**
       * complete async method type
       */
      async: () => (
        err: Error | null,
        result?: ILoaderOutput['content'],
      ) => void;
    },
  content: string,
) => ILoaderOutput['content'] | void;

/**
 * bundless transformer type
 */
export type JSTransformer = (
  this: ILoaderContext & {
    paths: {
      cwd: string;
      fileAbsPath: string;
    };
  },
  content: Parameters<BundlessLoader>[0],
) => ILoaderOutput['content'] | Promise<ILoaderOutput['content']>;
