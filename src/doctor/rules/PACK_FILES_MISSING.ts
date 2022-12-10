import { winPath } from '@umijs/utils';
import path from 'path';
import type { DoctorReport } from '..';
import type { Api } from '../../types';

export default (api: Api) => {
  api.addRegularCheckup(
    ({ bundleConfigs, bundlessConfigs, preBundleConfig }) => {
      if (api.pkg.files) {
        const files: string[] = api.pkg.files;
        const entities: string[] = [];
        const errors: DoctorReport = [];

        // dist entities
        bundleConfigs.forEach((c) => entities.push(c.output.path));
        bundlessConfigs.forEach((c) => entities.push(c.output));
        Object.values(preBundleConfig.deps).forEach((c) =>
          entities.push(
            winPath(path.relative(api.cwd, path.dirname(c.output))),
          ),
        );
        Object.values(preBundleConfig.dts).forEach((c) =>
          entities.push(
            winPath(path.relative(api.cwd, path.basename(c.output))),
          ),
        );

        // TODO: main/module entities
        // TODO: outside import entities (eg: template)

        entities.forEach((output) => {
          if (files.every((f) => !output.startsWith(f))) {
            errors.push({
              type: 'error',
              problem: `The output entity \'${output}\` is not in the \`files\` field of the package.json file, it will not be published`,
              solution: 'Add it to the `files` field of the package.json file',
            });
          }
        });

        return errors;
      }
    },
  );
};
