import fs from 'fs';
import { runLoaders } from 'loader-runner';
import type { Api } from '../../../types';
import type { BundlessConfig } from '../../types';
import type { BundlessLoader, LoaderItem, LoaderOuput } from './types';

const loaders: LoaderItem[] = [];

/**
 * add loader
 * @param item  loader item
 */
export function addLoader(item: LoaderItem) {
  if (!['string', 'function'].includes(typeof item.test) && !(item.test instanceof RegExp)) {
    throw new Error(
      `Unsupported loader test in \`${item.id}\`, only string, function and regular expression are available.`
    );
  }

  loaders.push(item);
}

export default async (fileAbsPath: string, opts: { config: BundlessConfig; pkg: Api['pkg'] }) => {
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
    return new Promise<
      { content: string; options: { ext?: string; declaration?: boolean } } | undefined
    >((resolve, reject) => {
      let outputOpts: LoaderOuput['options'] = {};

      runLoaders(
        {
          resource: fileAbsPath,
          loaders: [{ loader: matched.loader, options: matched.options }],
          context: {
            config: opts.config,
            pkg: opts.pkg,
            setOuputOptions(opts: any) {
              outputOpts = opts;
            }
          } as Partial<ThisParameterType<BundlessLoader>>,
          readResource: fs.readFile.bind(fs)
        },
        (err, { result }) => {
          if (err) {
            reject(err);
          } else if (result) {
            resolve({
              content: result[0] as unknown as string,
              options: outputOpts
            });
          } else {
            resolve(void 0);
          }
        }
      );
    });
  }
};
