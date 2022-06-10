import type { JSTransformer } from '../types';

/**
 * esbuild transformer
 */
const esbuildTransformer: JSTransformer = function (content) {
  // TODO: transform content
  return content;
};

export default esbuildTransformer;
