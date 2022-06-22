import { logger } from '@umijs/utils';
import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'release',
    description: 'release',
    fn({ args }) {
      args;
      logger.info(`release`);
    },
  });
};
