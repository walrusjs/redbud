import { Api } from './types';

export default (api: Api) => {
  api.onStart(() => {});
  return {
    plugins: [
      require.resolve('./registerMethods'),

      // commands
      require.resolve('./commands/dev'),
      require.resolve('./commands/build'),
      require.resolve('./commands/changelog'),
      require.resolve('./commands/prebundle'),
      require.resolve('./commands/release'),
      require.resolve('./commands/version'),

      // features
      require.resolve('./features/configBuilder/configBuilder'),
      require.resolve('./features/configPlugins/configPlugins'),
    ],
  };
};
