import { addLoader as addBundlessLoader } from '../../builder/bundless/loaders';

import { addTransformer as addJSTransformer } from '../../builder/bundless/loaders/javascript';
import { addTransformer as addLessTransformer } from '../../builder/bundless/loaders/less';

import { RedbudJSTransformerTypes } from '../../types';

import type { TransformerItem } from '../../builder/bundless/loaders/javascript';
import type { LoaderItem } from '../../builder/bundless/loaders/types';
import type { Api } from '../../types';

export default async (api: Api) => {
  // collect all bundless loaders
  const bundlessLoaders: LoaderItem[] = await api.applyPlugins({
    key: 'addBundlessLoader',
    initialValue: [
      {
        id: 'js-loader',
        test: /((?<!\.d)\.ts|\.(jsx?|tsx))$/,
        loader: require.resolve('../../builder/bundless/loaders/javascript')
      },
      {
        id: 'less-loader',
        test: /\.(less)(\?.*)?$/,
        loader: require.resolve('../../builder/bundless/loaders/less')
      }
    ]
  });

  // register bundless loaders
  bundlessLoaders.forEach((l) => addBundlessLoader(l));

  // collect all bundless js transformers
  const jsTransformers: TransformerItem[] = await api.applyPlugins({
    key: 'addJSTransformer',
    initialValue: [
      {
        id: RedbudJSTransformerTypes.BABEL,
        transformer: require.resolve('../../builder/bundless/loaders/javascript/babel')
      },
      {
        id: RedbudJSTransformerTypes.ESBUILD,
        transformer: require.resolve('../../builder/bundless/loaders/javascript/esbuild')
      }
    ]
  });

  const lessTransformers: TransformerItem[] = await api.applyPlugins({
    key: 'addLessTransformer',
    initialValue: [
      {
        id: 'less',
        transformer: require.resolve('../../builder/bundless/loaders/less/less')
      }
    ]
  });

  // register js transformers
  jsTransformers.forEach((t) => addJSTransformer(t));

  // register less transformers
  lessTransformers.forEach((t) => addLessTransformer(t));
};
