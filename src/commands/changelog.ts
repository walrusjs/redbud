import { logger } from '@umijs/utils';
import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'changelog',
    description: 'changelog (unavailable)',
    fn({ args }) {
      args;
      logger.info(`changelog`);
    },
  });
};
