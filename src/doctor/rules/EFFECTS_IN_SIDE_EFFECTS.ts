import type { DoctorReport } from '..';
import type { Api } from '../../types';

export default (api: Api) => {
  let hasStyleProblem = false;

  api.addSourceCheckup(({ file, content }) => {
    if (
      api.pkg.sideEffects === false &&
      !hasStyleProblem &&
      /\.(j|t)sx?$/.test(file) &&
      /\simport\s+['"]\.[^'"]+\.(less|css|sass|scss)/.test(content)
    ) {
      hasStyleProblem = true;

      return {
        type: 'error',
        problem:
          'Source file contains style imports, and the `"sideEffects": false` will causes styles lost after tree-shaking',
        solution:
          'Correct `sideEffects` config in the package.json file, such as `"sideEffects": ["**/*.less"]`',
      };
    }
  });

  api.addRegularCheckup(() => {
    if (Array.isArray(api.pkg.sideEffects)) {
      const result: DoctorReport = [];

      api.pkg.sideEffects.forEach((s) => {
        if (s.startsWith('*.')) {
          result.push({
            type: 'warn',
            problem: `The \`${s}\` sideEffect syntax only match top-level files in Rollup.js, but match all in Webpack`,
            solution:
              'Prefix `**/` for this sideEffect value in the package.json file',
          });
        }
      });

      return result;
    }
  });
};
