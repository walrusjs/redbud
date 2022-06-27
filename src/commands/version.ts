import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'version',
    alias: 'v',
    description: 'show redbud version',
    fn({ args }) {
      const version = require('../../package.json').version;
      if (!args.quiet) {
        const versions = [`redbud@${version}`];
        // parts version
        const parts = ['@vercel/ncc', 'typescript', '@microsoft/api-extractor'];
        // @umijs/bundler-utils
        const utilsParts = ['@babel/core', 'esbuild'];
        // @umijs/bundler-webpack
        const bundlerParts = ['webpack'];
        utilsParts.forEach((part) => {
          const utilsPkg = require('@umijs/bundler-utils/package.json');
          const version =
            utilsPkg.devDependencies[part] || utilsPkg.dependencies[part];
          versions.push(`${part}@${version}`);
        });
        parts.forEach((part) => {
          versions.push(`${part}@${require(`${part}/package.json`).version}`);
        });
        bundlerParts.forEach((part) => {
          const webpackPkg = require('@umijs/bundler-webpack/package.json');
          const version =
            webpackPkg.devDependencies[part] || webpackPkg.dependencies[part];
          versions.push(`${part}@${version}`);
        });
        versions.forEach((version) => {
          console.log(version);
        });
      }
      return version;
    },
  });
};
