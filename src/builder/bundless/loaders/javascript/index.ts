import { getTsconfig } from '../../dts';
import type { BundlessLoader, JSTransformer, LoaderOutput } from '../types';

const transformers: Record<string, JSTransformer> = {};

export interface ITransformerItem {
  id: string;
  transformer: string;
}

/**
 * add javascript transformer
 * @param item
 */
export function addTransformer(item: ITransformerItem) {
  const mod = require(item.transformer);
  const transformer: JSTransformer = mod.default || mod;

  transformers[item.id] = transformer;
}

/**
 * builtin javascript loader
 */
const jsLoader: BundlessLoader = function (content) {
  const transformer = transformers[this.config.transformer!];
  const outputOpts: LoaderOutput['options'] = {};

  // specify output ext for non-js file
  if (/\.(jsx|tsx?)$/.test(this.resource)) {
    outputOpts.ext = '.js';
  }

  // mark for output declaration file
  if (
    /\.tsx?$/.test(this.resource) &&
    getTsconfig(this.context!)?.options.declaration
  ) {
    outputOpts.declaration = true;
  }

  const ret = transformer.call(
    {
      config: this.config,
      pkg: this.pkg,
      paths: {
        cwd: this.cwd,
        fileAbsPath: this.resource,
        itemDistAbsPath: this.itemDistAbsPath,
      },
    },
    content!.toString(),
  );

  // handle async transformer
  if (ret instanceof Promise) {
    const cb = this.async();

    ret.then(
      (r) => {
        outputOpts.map = r[1];
        this.setOutputOptions(outputOpts);
        cb(null, r[0]);
      },
      (e) => cb(e),
    );
  } else {
    outputOpts.map = ret[1];
    this.setOutputOptions(outputOpts);
    return ret[0];
  }
};

export default jsLoader;
