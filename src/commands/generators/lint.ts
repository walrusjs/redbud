import { GeneratorType } from '@umijs/core';
import { getNpmClient, logger } from '@umijs/utils';
import { Api } from '../../types';
import { GeneratorHelper } from './utils';

export default (api: Api) => {
  api.describe({
    key: 'generator:lint',
  });

  api.registerGenerator({
    key: 'lint',
    name: 'Enable Lint',
    description: 'Setup Lint Configuration',
    type: GeneratorType.generate,
    fn: async () => {
      const h = new GeneratorHelper(api);
      const generators = ['eslint', 'stylelint'];

      let allEnable = true;
      for (const type of generators) {
        const generator = api.service.generators[type] as any;

        const enable = await generator.checkEnable();
        if (enable) {
          await generator.fn();
        } else {
          allEnable = false;
          logger.warn(generator.disabledDescription);
        }
      }

      if (allEnable) {
        const npmClient = getNpmClient({ cwd: api.cwd });
        h.addScript(
          'lint',
          `${npmClient} run lint:es && ${npmClient} run lint:css`,
        );
      }
    },
  });
};
