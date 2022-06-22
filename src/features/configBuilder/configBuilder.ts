import {
  addLoader as addBundlessLoader,
  LoaderItem,
} from '../../builder/bundless/loaders';
import {
  addTransformer as addJSTransformer,
  TransformerItem,
} from '../../builder/bundless/loaders/javascript';
import { Api, RedbudJSTransformerTypes } from '../../types';

export default async (api: Api) => {
  // collect all bundless loaders
  const bundlessLoaders: LoaderItem[] = await api.applyPlugins({
    key: 'addBundlessLoader',
    initialValue: [
      {
        id: 'js-loader',
        test: /((?<!\.d)\.ts|\.(jsx?|tsx))$/,
        loader: require.resolve('../../builder/bundless/loaders/javascript'),
      },
    ],
  });

  // register bundless loaders
  bundlessLoaders.forEach((l) => addBundlessLoader(l));

  // collect all bundless js transformers
  const jsTransformers: TransformerItem[] = await api.applyPlugins({
    key: 'addJSTransformer',
    initialValue: [
      {
        id: RedbudJSTransformerTypes.BABEL,
        transformer: require.resolve(
          '../../builder/bundless/loaders/javascript/babel',
        ),
      },
      {
        id: RedbudJSTransformerTypes.ESBUILD,
        transformer: require.resolve(
          '../../builder/bundless/loaders/javascript/esbuild',
        ),
      },
    ],
  });

  // register js transformers
  jsTransformers.forEach((t) => addJSTransformer(t));
};
