import { chokidar, logger, rimraf } from '@umijs/utils';
import path from 'path';
import { Api, RedbudConfig } from '../types';
import bundle from './bundle';
import bundless from './bundless';
import { createConfigProviders } from './config';

function getProviderOutputs(
  providers: ReturnType<typeof createConfigProviders>,
) {
  const set = new Set<string>();

  [
    providers.bundle?.configs,
    providers.bundless.esm?.configs,
    providers.bundless.cjs?.configs,
  ].forEach((configs) => {
    configs?.forEach((config) => {
      set.add(
        typeof config.output === 'string' ? config.output : config.output!.path,
      );
    });
  });

  return Array.from(set);
}

interface BuilderOpts {
  userConfig: RedbudConfig;
  cwd: string;
  pkg: Api['pkg'];
  clean?: boolean;
  quiet?: boolean;
  buildDependencies?: string[];
}

interface WatchBuilderResult {
  close: chokidar.FSWatcher['close'];
}

// overload normal/watch mode
function builder(opts: BuilderOpts): Promise<void>;
function builder(
  opts: BuilderOpts & { watch: true },
): Promise<WatchBuilderResult>;

async function builder(
  opts: BuilderOpts & { watch?: true },
): Promise<WatchBuilderResult | void> {
  const configProviders = createConfigProviders(
    opts.userConfig,
    opts.pkg,
    opts.cwd,
  );
  const outputs = getProviderOutputs(configProviders);
  const watchers: chokidar.FSWatcher[] = [];

  if (opts.clean !== false) {
    // clean output directories
    logger.info('Clean output directories');
    outputs.forEach((output) => {
      rimraf.sync(path.join(opts.cwd, output));
    });
  }

  if (!opts.watch && configProviders.bundle) {
    await bundle({
      cwd: opts.cwd,
      configProvider: configProviders.bundle,
      buildDependencies: opts.buildDependencies,
    });
  }

  if (configProviders.bundless.esm) {
    const watcher = await bundless({
      cwd: opts.cwd,
      configProvider: configProviders.bundless.esm,
      watch: opts.watch,
      quiet: opts.quiet,
    });

    opts.watch && watchers.push(watcher);
  }

  if (configProviders.bundless.cjs) {
    const watcher = await bundless({
      cwd: opts.cwd,
      configProvider: configProviders.bundless.cjs,
      watch: opts.watch,
      quiet: opts.quiet,
    });

    opts.watch && watchers.push(watcher);
  }

  if (opts.watch) {
    return {
      async close() {
        await Promise.all(watchers.map((watcher) => watcher.close()));
      },
    };
  }
}

export default builder;
