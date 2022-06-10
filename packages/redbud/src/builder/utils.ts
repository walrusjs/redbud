import { createConfigProviders } from './config';

export function getProviderOutputs(providers: ReturnType<typeof createConfigProviders>) {
  const set = new Set<string>();
  const types: (keyof typeof providers)[] = ['bundle', 'bundless'];

  types.forEach((type) => {
    providers[type]?.configs.forEach((config) => {
      set.add(typeof config.output === 'string' ? config.output : config.output!.path);
    });
  });

  return Array.from(set);
}
