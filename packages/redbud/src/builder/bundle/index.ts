import { JSMinifier } from '@umijs/bundler-webpack/dist/types';
import { chalk, importLazy, logger } from '@umijs/utils';
import path from 'path';

import type { BundleConfigProvider } from '../config';

const bundler: typeof import('@umijs/bundler-webpack') = importLazy(
  path.dirname(require.resolve('@umijs/bundler-webpack/package.json'))
);

export async function bundle(opts: { cwd: string; configProvider: BundleConfigProvider }) {
  for (const config of opts.configProvider.configs) {
    logger.info(
      `Bundle from ${chalk.yellow(path.relative(opts.cwd, config.entry))} to ${chalk.yellow(
        path.join(config.output.path, config.output.filename)
      )}`
    );

    const { plugins: extraPostCSSPlugins, ...postcssLoader } = config.postcssOptions || {};

    await bundler.build({
      cwd: opts.cwd,
      config: {
        alias: config.alias,
        autoprefixer: config.autoprefixer,
        chainWebpack: config.chainWebpack,
        define: config.define,
        externals: config.externals,
        outputPath: config.output.path,

        // 是否开启压缩
        jsMinifier: JSMinifier.none,

        // postcss config
        extraPostCSSPlugins,
        postcssLoader
      },
      entry: {
        [path.parse(config.output.filename).name]: path.join(opts.cwd, config.entry)
      },
      extraBabelPresets: config.extraBabelPresets,
      extraBabelPlugins: config.extraBabelPlugins,

      // configure library related options
      chainWebpack(memo: any) {
        memo.output.libraryTarget('umd');

        // 默认输出 sourcemap
        memo.devtool('source-map');

        // modify webpack target
        if (config.platform === 'node') {
          memo.target('node');
        }

        return memo;
      }
    });
  }
}
