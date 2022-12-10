import { semver } from '@umijs/utils';
import path from 'path';
import {
  Api,
  RedbudBaseConfig,
  RedbudJSTransformerTypes,
  RedbudPlatformTypes,
} from '../types';
import type { BundlessConfig } from './config';

export function addSourceMappingUrl(code: string, loc: string) {
  return (
    code +
    '\n//# sourceMappingURL=' +
    path.basename(loc.replace(/\.(jsx|tsx?)$/, '.js.map'))
  );
}

export function getIsLTRReact17(pkg: Api['pkg']) {
  const reactVer = Object.assign(
    {},
    pkg.dependencies,
    pkg.peerDependencies,
  ).react;
  return semver.subset(reactVer, '>=17.0.0-0');
}

export function getBaseTransformReactOpts(pkg: Api['pkg']) {
  const reactVer = Object.assign(
    {},
    pkg.dependencies,
    pkg.peerDependencies,
  ).react;
  let opts: Record<string, any> = {};

  if (reactVer) {
    const isLTRReact17 = getIsLTRReact17(pkg);

    opts = {
      // force use production mode, to make sure dist of dev/build are consistent
      // ref: https://github.com/umijs/umi/blob/6f63435d42f8ef7110f73dcf33809e6cda750332/packages/babel-preset-umi/src/index.ts#L45
      development: false,
      // use legacy jsx runtime for react@<17
      runtime: isLTRReact17 ? 'automatic' : 'classic',
      ...(isLTRReact17 ? {} : { importSource: undefined }),
    };
  }

  return opts;
}

export function getBabelPresetReactOpts(pkg: Api['pkg']) {
  return {
    ...getBaseTransformReactOpts(pkg),
  };
}

export function getSWCTransformReactOpts(pkg: Api['pkg']) {
  return {
    ...getBaseTransformReactOpts(pkg),
  };
}

export function ensureRelativePath(relativePath: string) {
  // prefix . for same-level path
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }
  return relativePath;
}

const defaultCompileTarget: Record<
  RedbudPlatformTypes,
  Record<RedbudJSTransformerTypes, any>
> = {
  [RedbudPlatformTypes.BROWSER]: {
    [RedbudJSTransformerTypes.BABEL]: { ie: 11 },
    [RedbudJSTransformerTypes.ESBUILD]: ['chrome65'],
    [RedbudJSTransformerTypes.SWC]: { chrome: 65 },
  },
  [RedbudPlatformTypes.NODE]: {
    [RedbudJSTransformerTypes.BABEL]: { node: 14 },
    [RedbudJSTransformerTypes.ESBUILD]: ['node14'],
    [RedbudJSTransformerTypes.SWC]: { node: 14 },
  },
};

export function getBundleTargets({ targets }: RedbudBaseConfig) {
  if (!targets || !Object.keys(targets).length) {
    return defaultCompileTarget[RedbudPlatformTypes.BROWSER][
      RedbudJSTransformerTypes.BABEL
    ];
  }

  return targets;
}

export function getBundlessTargets(config: BundlessConfig) {
  const { platform, transformer, targets } = config;

  // targets is undefined or empty, fallback to default
  if (!targets || !Object.keys(targets).length) {
    return defaultCompileTarget[platform!][transformer!];
  }
  // esbuild accept string or string[]
  if (transformer === RedbudJSTransformerTypes.ESBUILD) {
    return Object.keys(targets).map((name) => `${name}${targets![name]}`);
  }

  return targets;
}
