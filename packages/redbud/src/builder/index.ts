import { rimraf } from '@umijs/utils';
import { bundle } from './bundle';
import { bundless } from './bundless';
import { createConfigProviders } from './config';
import { getProviderOutputs } from './utils';

import type { Api, RedbudConfig } from '../types';

export interface BuilderOptions {
  cwd: string;
  userConfig: RedbudConfig;
  pkg: Api['pkg'];
}

export async function builder(opts: BuilderOptions) {
  const configProviders = createConfigProviders(opts);
  const outputs = getProviderOutputs(configProviders);

  // 清空输出目录
  outputs.forEach((output) => {
    rimraf.sync(output);
  });

  if (configProviders.bundle) {
    await bundle({ cwd: opts.cwd, configProvider: configProviders.bundle });
  }

  if (configProviders.bundless.esm) {
    await bundless({
      cwd: opts.cwd,
      configProvider: configProviders.bundless.esm
    });
  }

  if (configProviders.bundless.cjs) {
    await bundless({
      cwd: opts.cwd,
      configProvider: configProviders.bundless.cjs
    });
  }
}
