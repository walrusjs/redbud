import type { RedbudConfig } from './types';

type ConfigType = RedbudConfig;

export function defineConfig(config: ConfigType): ConfigType {
  return config;
}
