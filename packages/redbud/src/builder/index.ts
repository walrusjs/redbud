import { rimraf } from '@umijs/utils';
import { bundle } from './bundle';
import { bundless } from './bundless';
import { createConfigProviders } from './config';
import { getProviderOutputs } from './utils';

import type { Api, RedbudConfig } from '../types';

interface Opts {
  cwd: string;
  userConfig: RedbudConfig;
  pkg: Api['pkg'];
}

export async function builder(opts: Opts) {
  const configProviders = createConfigProviders(opts.userConfig, opts.pkg);
  const outputs = getProviderOutputs(configProviders);

  // 清空输出目录
  outputs.forEach((output) => {
    rimraf.sync(output);
  });

  if (configProviders.bundle) {
    await bundle({ cwd: opts.cwd, configProvider: configProviders.bundle });
  }

  if (configProviders.bundless) {
    await bundless({ cwd: opts.cwd, configProvider: configProviders.bundless });
  }
}
