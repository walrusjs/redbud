import builder from '../builder';
import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'build',
    description: 'build for production',
    options: `
--no-clean  do not clean all output directories before build
`,
    async fn({ args }) {
      await builder({
        userConfig: api.config,
        cwd: api.cwd,
        pkg: api.pkg,
        clean: args.clean,
        quiet: args.quiet,
      });
    },
  });
};
