import { glob, lodash } from '@umijs/utils';
import fs from 'fs';
import path from 'path';
import {
  BundleConfig,
  BundlessConfig,
  normalizeUserConfig as getBuildConfig,
} from '../builder/config';
import { DEFAULT_BUNDLESS_IGNORES } from '../constants';
import { getConfig as getPreBundleConfig } from '../prebundler/config';
import { RedbudBuildTypes, type Api } from '../types';
import sourceParser from './parser';

export type DoctorReport = {
  type: 'error' | 'warn';
  problem: string;
  solution: string;
}[];

/**
 * register all built-in rules
 */
export function registerRules(api: Api) {
  const ruleDir = path.join(__dirname, 'rules');
  const rules = fs
    .readdirSync(ruleDir, { withFileTypes: true })
    .filter((f) => f.isFile() && /(?<!\.d)\.(j|t)s$/.test(f.name))
    .map((f) => path.join(ruleDir, f.name));

  api.registerPlugins(rules);
}

/**
 * get top-level source dirs from configs
 */
export function getSourceDirs(
  bundleConfigs: BundleConfig[],
  bundlessConfigs: BundlessConfig[],
) {
  const configDirs = lodash.uniq([
    ...bundleConfigs.map((c) => path.dirname(c.entry)),
    ...bundlessConfigs.map((c) => c.input),
  ]);

  return [...configDirs].filter((d, i) =>
    configDirs.every((dir, j) => i === j || !d.startsWith(dir)),
  );
}

export default async (api: Api): Promise<DoctorReport> => {
  // generate configs
  const [bundleConfigs, bundlessConfigs] = getBuildConfig(
    api.config,
    api.pkg,
  ).reduce<[BundleConfig[], BundlessConfig[]]>(
    (ret, config) => {
      if (config.type === RedbudBuildTypes.BUNDLE) {
        ret[0].push(config);
      } else {
        ret[1].push(config);
      }

      return ret;
    },
    [[], []],
  );
  const preBundleConfig = getPreBundleConfig({
    userConfig: api.config.prebundle || { deps: [] },
    pkg: api.pkg,
    cwd: api.cwd,
  });

  // collect all source files
  const sourceDirs = getSourceDirs(bundleConfigs, bundlessConfigs);
  const sourceFiles = sourceDirs.reduce<string[]>(
    (ret, dir) =>
      ret.concat(
        glob.sync(`${dir}/**`, {
          cwd: api.cwd,
          ignore: DEFAULT_BUNDLESS_IGNORES,
          nodir: true,
        }),
      ),
    [],
  );

  // collect all alias & externals
  // TODO: split bundle & bundless checkup, because externals not work for bundle
  const mergedAlias: Record<string, string[]> = {};
  const mergedExternals: Record<string, true> = {};

  [...bundleConfigs, ...bundlessConfigs].forEach((c) => {
    Object.entries(c.alias || {}).forEach(([k, v]) => {
      mergedAlias[k] ??= [];
      mergedAlias[k].push(v);
    });

    if ('externals' in c) {
      Object.entries(c.externals || {}).forEach(([k, v]) => {
        mergedExternals[k] = true;
      });
    }
  });

  // regular checkup
  const regularReport: DoctorReport = await api.applyPlugins({
    key: 'addRegularCheckup',
    args: { bundleConfigs, bundlessConfigs, preBundleConfig },
  });

  // source checkup
  const sourceReport: DoctorReport = [];

  for (const file of sourceFiles) {
    sourceReport.push(
      ...(await api.applyPlugins({
        key: 'addSourceCheckup',
        args: {
          file,
          content: fs.readFileSync(path.join(api.cwd, file), 'utf-8'),
        },
      })),
    );
  }

  // imports checkup
  const importsReport: DoctorReport = [];

  for (const file of sourceFiles) {
    importsReport.push(
      ...(await api.applyPlugins({
        key: 'addImportsCheckup',
        args: {
          file,
          imports: (await sourceParser(path.join(api.cwd, file))).imports,
          mergedAlias,
          mergedExternals,
        },
      })),
    );
  }

  return [
    ...regularReport.filter(Boolean),
    ...sourceReport.filter(Boolean),
    ...importsReport.filter(Boolean),
  ];
};
