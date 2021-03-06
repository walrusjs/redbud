import fs from 'fs';
import { runLoaders } from 'loader-runner';
import type { Api } from '../../../types';
import { getCache } from '../../../utils';
import type { BundlessConfig } from '../../config';
import type { BundlessLoader, LoaderOutput } from './types';

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
  opts: { config: BundlessConfig; pkg: Api['pkg']; cwd: string },
) => {
  const cache = getCache('bundless-loader');
  // format: {path:mtime:config}
  const cacheKey = [
    fileAbsPath,
    fs.statSync(fileAbsPath).mtimeMs,
    JSON.stringify(opts.config),
  ].join(':');
  const cacheRet = await cache.get(cacheKey, '');

  // use cache first
  if (cacheRet) return Promise.resolve<LoaderOutput>(cacheRet);

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
    return new Promise<LoaderOutput | void>((resolve, reject) => {
      let outputOpts: LoaderOutput['options'] = {};

      runLoaders(
        {
          resource: fileAbsPath,
          loaders: [{ loader: matched.loader, options: matched.options }],
          context: {
            cwd: opts.cwd,
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
            const ret = {
              content: result[0] as unknown as string,
              options: outputOpts,
            };

            // save cache then resolve
            cache.set(cacheKey, ret);
            resolve(ret);
          } else {
            resolve(void 0);
          }
        },
      );
    });
  }
};
