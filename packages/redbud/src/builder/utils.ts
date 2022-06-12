import { createConfigProviders } from './config';

export function getProviderOutputs(providers: ReturnType<typeof createConfigProviders>) {
  const set = new Set<string>();

  [
    providers.bundle?.configs,
    providers.bundless.esm?.configs,
    providers.bundless.cjs?.configs
  ].forEach((configs) => {
    configs?.forEach((config) => {
      set.add(typeof config.output === 'string' ? config.output : config.output!.path);
    });
  });

  return Array.from(set);
}
