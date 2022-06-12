import { transform } from '@umijs/bundler-utils/compiled/babel/core';
import path from 'path';
import { RedbudBundlessTypes } from '../../../../types';
import type { JSTransformer } from '../types';

/**
 * babel transformer
 */
const babelTransformer: JSTransformer = function (content) {
  const {
    extraBabelPlugins = [],
    extraBabelPresets = [],
    define,
    alias: oAlias = {}
  } = this.config;

  // transform alias to relative path for babel-plugin-module-resolver
  const alias = Object.entries(oAlias).reduce<typeof oAlias>((result, [name, target]) => {
    if (path.isAbsolute(target)) {
      result[name] = path.relative(this.paths.cwd, target);

      // prefix . for same-level path
      if (!result[name].startsWith('.')) {
        result[name] = `.${path.sep}${result[name]}`;
      }
    } else {
      result[name] = target;
    }

    return result;
  }, {});

  return transform(content, {
    filename: this.paths.fileAbsPath,
    presets: [
      [
        require.resolve('@umijs/babel-preset-umi'),
        {
          presetEnv: {
            modules: this.config.format === RedbudBundlessTypes.ESM ? false : 'auto'
          },
          presetReact: {},
          presetTypeScript: {},
          pluginTransformRuntime: {
            absoluteRuntime: false,
            version: this.pkg.dependencies?.['@babel/runtime']
          }
        }
      ],
      ...extraBabelPresets
    ],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          alias: alias,
          cwd: this.paths.cwd,
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json']
        }
      ],
      ...(define ? [[require.resolve('babel-plugin-transform-define'), define]] : []),
      ...extraBabelPlugins
    ]
  })!.code!;
};

export default babelTransformer;
