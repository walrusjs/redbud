import { resolve } from '@umijs/utils';
import { join } from 'path';
import { GeneratorHelper } from '../../commands/generators/utils';
import { Api, RedbudJSTransformerTypes } from '../../types';

export default (api: Api) => {
  api.onStart(() => {
    const hasSwcConfig = Object.entries(api.userConfig).some(([_, conf]) => {
      return conf?.transformer === RedbudJSTransformerTypes.SWC;
    });

    let swcInstalled = false;
    try {
      resolve.sync('@swc/core', { basedir: api.cwd });
      swcInstalled = true;
    } catch {}

    if (hasSwcConfig && !swcInstalled) {
      api.logger.info('Since swc is used, install @swc/core on demand.');

      const h = new GeneratorHelper(api);
      h.addDevDeps({
        '@swc/core': require(join(__dirname, '../../../package.json'))
          .devDependencies['@swc/core'],
      });

      // should install all dependencies
      const ORIGIN_NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      h.installDeps();
      process.env.NODE_ENV = ORIGIN_NODE_ENV;
    }
  });
};
