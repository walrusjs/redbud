import type { Api } from './types';

export default (api: Api) => {
  api.onStart(() => {});

  return {
    plugins: [
      // commands
      require.resolve('./commands/build'),
      require.resolve('./commands/version'),
      require.resolve('./commands/prebundle'),

      // features
      require.resolve('./features/configBuilder/configBuilder'),
      require.resolve('./features/configPlugins/configPlugins')
    ]
  };
};
