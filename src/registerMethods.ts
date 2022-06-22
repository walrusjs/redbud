import { Api } from './types';

export default (api: Api) => {
  ['onFoo'].forEach((name) => {
    api.registerMethod({ name });
  });
};
