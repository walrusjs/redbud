import type { DoctorReport } from '..';
import type { Api } from '../../types';

export default (api: Api) => {
  api.addImportsCheckup(({ imports, mergedAlias, mergedExternals }) => {
    const errors: DoctorReport = [];

    imports.forEach((i) => {
      const pkgName = i.path.match(/^(?:@[\w-]+\/)?[\w-]+/i)?.[0];
      const aliasKeys = Object.keys(mergedAlias);

      if (
        pkgName &&
        !api.pkg.dependencies?.[pkgName] &&
        !api.pkg.peerDependencies?.[pkgName] &&
        aliasKeys.every((k) => k !== i.path && !i.path.startsWith(`${k}/`)) &&
        !mergedExternals[i.path]
      ) {
        errors.push({
          type: 'error',
          problem: `Source depend on \`${pkgName}\` but it is not in the \`dependencies\` or \`peerDependencies\``,
          solution:
            'Add it to the `dependencies` or `peerDependencies` of the package.json file',
        });
      }
    });

    return errors;
  });
};
