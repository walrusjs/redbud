import type { Api } from '../../types';

export default (api: Api) => {
  api.addRegularCheckup(() => {
    if (!api.pkg.files) {
      return {
        type: 'warn',
        problem:
          'No `files` field in the package.json file, all the non-gitignore files will be published',
        solution:
          'Describe the entries that need to be published in `files` field of the package.json file',
      };
    }
  });
};
