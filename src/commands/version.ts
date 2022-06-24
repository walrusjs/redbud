import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'version',
    alias: 'v',
    description: 'show redbud version',
    fn({ args }) {
      const version = require('../../package.json').version;
      if (!args.quiet) {
        console.log(`redbud@${version}`);
      }
      return version;
    },
  });
};
