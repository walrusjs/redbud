import { Api } from '../types';
import preBundle from '../prebundler';

export default (api: Api) => {
  // to avoid conflict with schema
  api.describe({ key: 'prebundle-command' });

  api.registerCommand({
    name: 'prebundle',
    description: 'prebundle',
    async fn() {
      await preBundle({
        userConfig: api.userConfig.prebundle,
        cwd: api.cwd,
        pkg: api.pkg,
      });
    },
  });
};
