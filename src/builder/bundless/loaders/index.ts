import fs from 'fs';
import { runLoaders } from 'loader-runner';
import type { Api } from '../../../types';
import type { IBundlessConfig } from '../../config';
import type { BundlessLoader, ILoaderOutput } from './types';

/**
 * loader item type
 */
export interface LoaderItem {
  id: string;
  test: string | RegExp | ((path: string) => boolean);
  loader: string;
  options?: Record<string, any>;
}

const loaders: LoaderItem[] = [];

/**
 * add loader
 * @param item  loader item
 */
export function addLoader(item: LoaderItem) {
  // only support simple test type currently, because the webpack condition is too complex
  // refer: https://github.com/webpack/webpack/blob/0f6c78cca174a73184fdc0d9c9c2bd376b48557c/lib/rules/RuleSetCompiler.js#L211
  if (
    !['string', 'function'].includes(typeof item.test) &&
    !(item.test instanceof RegExp)
  ) {
    throw new Error(
      `Unsupported loader test in \`${item.id}\`, only string, function and regular expression are available.`,
    );
  }

  loaders.push(item);
}

/**
 * loader module base on webpack loader-runner
 */
export default async (
  fileAbsPath: string,
  opts: { config: IBundlessConfig; pkg: Api['pkg'] },
) => {
  // get matched loader by test
  const matched = loaders.find((item) => {
    switch (typeof item.test) {
      case 'string':
        return fileAbsPath.startsWith(item.test);

      case 'function':
        return item.test(fileAbsPath);

      default:
        // assume it is RegExp instance
        return item.test.test(fileAbsPath);
    }
  });

  if (matched) {
    // run matched loader
    return new Promise<ILoaderOutput | void>((resolve, reject) => {
      let outputOpts: ILoaderOutput['options'] = {};

      runLoaders(
        {
          resource: fileAbsPath,
          loaders: [{ loader: matched.loader, options: matched.options }],
          context: {
            config: opts.config,
            pkg: opts.pkg,
            setOutputOptions(opts) {
              outputOpts = opts;
            },
          } as Partial<ThisParameterType<BundlessLoader>>,
          readResource: fs.readFile.bind(fs),
        },
        (err, { result }) => {
          if (err) {
            reject(err);
          } else if (result) {
            // FIXME: handle buffer type?
            resolve({
              content: result[0] as unknown as string,
              options: outputOpts,
            });
          } else {
            resolve(void 0);
          }
        },
      );
    });
  }
};
