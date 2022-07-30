import {
  Api,
  RedbudJSTransformerTypes,
  RedbudPlatformTypes,
} from '../../types';

export default (api: Api) => {
  api.addRegularCheckup(({ bundlessConfigs }) => {
    if (
      bundlessConfigs.find(
        (c) =>
          c.transformer === RedbudJSTransformerTypes.BABEL &&
          c.platform === RedbudPlatformTypes.BROWSER,
      ) &&
      !api.pkg.dependencies?.['@babel/runtime']
    ) {
      return {
        type: 'warn',
        problem:
          '@babel/runtime is not installed, the inline runtime helpers will increase dist file size',
        solution:
          'Declare @babel/runtime as a dependency in the package.json file',
      };
    }
  });
};
