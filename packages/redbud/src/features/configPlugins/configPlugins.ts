import { Api } from '../../types';
import { getSchemas } from './schema';

export default (api: Api) => {
  const configDefaults: Record<string, any> = {};

  const schemas = getSchemas();
  for (const key of Object.keys(schemas)) {
    const config: Record<string, any> = {
      schema: schemas[key] || ((joi: any) => joi.any())
    };
    if (key in configDefaults) {
      config.default = configDefaults[key];
    }
    api.registerPlugins([
      {
        id: `virtual: config-${key}`,
        key: key,
        config
      }
    ]);
  }
};
