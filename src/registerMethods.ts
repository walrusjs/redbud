import { Api } from './types';

export default (api: Api) => {
  ['addJSTransformer'].forEach((name) => {
    api.registerMethod({ name });
  });
};
