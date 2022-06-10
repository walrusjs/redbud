import type { BundlessLoader, JSTransformer } from '../types';

const transformers: Record<string, JSTransformer> = {};

export interface TransformerItem {
  id: string;
  transformer: string;
}

/**
 * add javascript tranformer
 * @param item
 */
export function addTransformer(item: TransformerItem) {
  const mod = require(item.transformer);
  const transformer: JSTransformer = mod.default || mod;

  transformers[item.id] = transformer;
}

/**
 * builtin javascript loader
 */
const jsLoader: BundlessLoader = function (content) {
  const transformer = transformers[this.config.transformer!];

  // TODO: .mjs, .cjs support
  this.setOuputOptions({ ext: '.js', declaration: true });

  return transformer.call(
    {
      config: this.config,
      pkg: this.pkg,
      paths: {
        cwd: this.resourcePath!,
        fileAbsPath: this.resource
      }
    },
    content!.toString()
  );
};

export default jsLoader;
