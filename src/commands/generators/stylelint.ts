import { GeneratorType } from '@umijs/core';
import { logger } from '@umijs/utils';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Api } from '../../types';
import { GeneratorHelper } from './utils';

export default (api: Api) => {
  api.describe({
    key: 'generator:stylelint',
  });

  api.registerGenerator({
    key: 'stylelint',
    name: 'Enable Stylelint',
    description: 'Setup Stylelint Configuration',
    type: GeneratorType.enable,
    checkEnable: () => {
      return (
        !existsSync(join(api.paths.cwd, '.stylelintrc')) &&
        !existsSync(join(api.paths.cwd, 'stylelint.config.js'))
      );
    },
    disabledDescription:
      'Stylelint has already enabled. You can remove .stylelintrc/stylelint.config.js, then run this again to re-setup.',
    fn: async () => {
      const h = new GeneratorHelper(api);

      const deps = {
        '@umijs/lint': '^4',
        stylelint: '^14.11.0',
      };

      h.addDevDeps(deps);
      h.addScript('lint:css', 'stylelint "{src,test}/**/*.{css,less}"');

      writeFileSync(
        join(api.cwd, '.stylelintrc'),
        `
{
  "extends": "@umijs/lint/dist/config/stylelint"
}
`.trimStart(),
      );

      logger.info('Write .stylelintrc');

      h.installDeps();
    },
  });
};
