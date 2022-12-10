import type { Api } from './types';

export default (api: Api) => {
  [
    'addJSTransformer',
    'addRegularCheckup',
    'addSourceCheckup',
    'addImportsCheckup',
  ].forEach((name) => {
    api.registerMethod({ name });
  });
};
