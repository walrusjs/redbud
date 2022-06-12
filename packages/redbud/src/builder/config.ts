import { JSMinifier } from '@umijs/bundler-webpack/dist/types';
import fs from 'fs';
import { Minimatch } from 'minimatch';
import { RedbudBuildTypes, RedbudJSTransformerTypes, RedbudPlatformTypes } from '../types';
import { getUmdName } from '../utils';

import type { Api, RedbudConfig } from '../types';
import type { BuilderConfig, BundleConfig, BundlessConfig } from './types';

/**
 * 解析用户配置
 * @param userConfig
 * @returns
 */
export function normalizeUserConfig(userConfig: RedbudConfig, pkg: Api['pkg']) {
  const configs: BuilderConfig[] = [];
  const { umd, esm, ...baseConfig } = userConfig;

  // normalize umd config
  if (umd) {
    const outputPath = umd.output || 'dist/umd';

    let getUmdNameOpts = {
      suffix: '',
      minifier: false
    };

    if (!outputPath.endsWith('umd')) {
      getUmdNameOpts.suffix = 'umd';
    }

    const defaultOutputFilename = {
      normal: getUmdName(pkg, 'index', getUmdNameOpts),
      minify: getUmdName(pkg, 'index', {
        ...getUmdNameOpts,
        minifier: true
      })
    };

    const entryConfig = umd.entry;
    const bundleConfig: Omit<BundleConfig, 'entry'> = {
      type: RedbudBuildTypes.BUNDLE,
      bundler: 'webpack',
      ...baseConfig,
      ...umd,
      output: {
        filename: `${defaultOutputFilename.normal}.js`,
        path: outputPath
      }
    };

    if (typeof entryConfig === 'object') {
      Object.keys(entryConfig).forEach((entry) => {
        configs.push({
          ...bundleConfig,

          // override all configs from entry config
          ...entryConfig[entry],
          entry,

          // override output
          output: {
            filename: `${entry}.umd.js`,
            path: entryConfig[entry].output || bundleConfig.output.path
          }
        });
      });
    } else {
      // generate single entry to single config
      configs.push(
        ...[
          {
            ...bundleConfig,
            jsMinifier: JSMinifier.none,

            // default to bundle src/index
            entry: entryConfig || 'src/index'
          },
          {
            ...bundleConfig,
            jsMinifier: JSMinifier.esbuild,
            output: {
              ...bundleConfig.output,
              filename: `${defaultOutputFilename.minify}.js`
            },

            // default to bundle src/index
            entry: entryConfig || 'src/index'
          }
        ]
      );
    }
  }

  if (esm) {
    const { overrides = {}, ...esmBaseConfig } = esm;
    const bundlessPlatform = esmBaseConfig.platform || userConfig.platform;

    const bundlessConfig: Omit<BundlessConfig, 'input'> = {
      type: RedbudBuildTypes.BUNDLESS,
      ...baseConfig,
      ...esmBaseConfig
    };

    configs.push({
      input: 'src',
      output: 'dist/esm',
      transformer:
        bundlessPlatform === RedbudPlatformTypes.NODE
          ? RedbudJSTransformerTypes.ESBUILD
          : RedbudJSTransformerTypes.BABEL,

      ...bundlessConfig,

      ignores: Object.keys(overrides).map((i) => `${i}/*`)
    });

    Object.keys(overrides).forEach((oInput) => {
      const overridePlatform = overrides[oInput].platform || bundlessPlatform;

      configs.push({
        // default to use auto transformer
        transformer:
          overridePlatform === RedbudPlatformTypes.NODE
            ? RedbudJSTransformerTypes.ESBUILD
            : RedbudJSTransformerTypes.BABEL,

        ...bundlessConfig,

        // override all configs for different input
        ...overrides[oInput],

        // specific different input
        input: oInput,

        // transform another child overides to ignores
        // for support to transform src/a and src/a/child with different configs
        ignores: Object.keys(overrides)
          .filter((i) => i.startsWith(oInput))
          .map((i) => `${i}/*`)
      });
    });
  }

  return configs;
}

class Minimatcher {
  matcher?: InstanceType<typeof Minimatch>;

  ignoreMatchers: InstanceType<typeof Minimatch>[] = [];

  constructor(pattern: string, ignores: string[] = []) {
    this.matcher = new Minimatch(fs.lstatSync(pattern).isDirectory() ? `${pattern}/**` : pattern);
    ignores.forEach((i) => {
      this.ignoreMatchers.push(new Minimatch(i, { dot: true }));

      // see also: https://github.com/isaacs/node-glob/blob/main/common.js#L37
      if (i.slice(-3) === '/**') {
        this.ignoreMatchers.push(new Minimatch(i.replace(/(\/\*\*)+$/, ''), { dot: true }));
      }
    });
  }

  match(filePath: string) {
    return this.matcher!.match(filePath) && this.ignoreMatchers.every((m) => !m.match(filePath));
  }
}

class ConfigProvider {
  pkg: ConstructorParameters<typeof ConfigProvider>[0];

  constructor(pkg: Api['pkg']) {
    this.pkg = pkg;
  }

  onConfigChange() {
    // not implemented
  }
}

export class BundleConfigProvider extends ConfigProvider {
  type = RedbudBuildTypes.BUNDLE;

  configs: BundleConfig[] = [];

  constructor(configs: BundleConfig[], pkg: ConstructorParameters<typeof ConfigProvider>[0]) {
    super(pkg);
    this.configs = configs;
  }
}

export class BundlessConfigProvider extends ConfigProvider {
  type = RedbudBuildTypes.BUNDLESS;

  configs: BundlessConfig[] = [];

  input = '';

  output = '';

  matchers: InstanceType<typeof Minimatcher>[] = [];

  constructor(configs: BundlessConfig[], pkg: ConstructorParameters<typeof ConfigProvider>[0]) {
    super(pkg);
    this.configs = configs;
    this.input = configs[0].input;
    this.output = configs[0].output!;
    configs.forEach((config) => {
      this.matchers.push(new Minimatcher(config.input, config.ignores));
    });
  }

  getConfigForFile(filePath: string) {
    return this.configs[this.matchers.findIndex((m) => m.match(filePath))];
  }
}

/**
 * 创建配置提供者
 * @param userConfig 用户配置
 * @param pkg package.json
 * @returns
 */
export function createConfigProviders(userConfig: RedbudConfig, pkg: Api['pkg']) {
  const providers: {
    bundless?: BundlessConfigProvider;
    bundle?: BundleConfigProvider;
  } = {};
  const configs = normalizeUserConfig(userConfig, pkg);

  const { bundle, bundless } = configs.reduce(
    (r, config) => {
      if (config.type === RedbudBuildTypes.BUNDLE) {
        r.bundle.push(config);
      } else if (config.type === RedbudBuildTypes.BUNDLESS) {
        r.bundless.push(config);
      }

      return r;
    },
    { bundle: [], bundless: [] } as {
      bundle: BundleConfig[];
      bundless: BundlessConfig[];
    }
  );

  if (bundle.length) {
    providers.bundle = new BundleConfigProvider(bundle, pkg);
  }

  if (bundless.length) {
    providers.bundless = new BundlessConfigProvider(bundless, pkg);
  }

  return providers;
}
