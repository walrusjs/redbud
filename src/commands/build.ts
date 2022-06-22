import builder from '../builder';
import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'build',
    description: 'build',
    async fn() {
      await builder({
        userConfig: api.userConfig,
        cwd: api.cwd,
        pkg: api.pkg,
      });
    },
  });
};
