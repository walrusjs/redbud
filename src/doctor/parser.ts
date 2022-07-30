import {
  build,
  type OnResolveArgs,
} from '@umijs/bundler-utils/compiled/esbuild';
import fs from 'fs';
import path from 'path';
import { getCache } from '../utils';

export type DoctorSourceParseResult = {
  imports: Omit<OnResolveArgs, 'pluginData'>[];
};

export default async (
  fileAbsPath: string,
): Promise<DoctorSourceParseResult> => {
  const cache = getCache('doctor-parser');
  // format: {path:mtime}
  const cacheKey = [fileAbsPath, fs.statSync(fileAbsPath).mtimeMs].join(':');
  const cacheRet = cache.getSync(cacheKey, '');
  const ret: DoctorSourceParseResult = { imports: [] };

  if (cacheRet) return cacheRet;

  await build({
    // do not emit file
    write: false,
    // enable bundle for trigger onResolve hook, but all deps will be externalized
    bundle: true,
    logLevel: 'silent',
    format: 'esm',
    target: 'esnext',
    // esbuild need relative entry path
    entryPoints: [path.basename(fileAbsPath)],
    absWorkingDir: path.dirname(fileAbsPath),
    plugins: [
      {
        name: 'plugin-redbud-doctor',
        setup: (builder) => {
          builder.onResolve({ filter: /.*/ }, ({ pluginData, ...args }) => {
            if (args.kind !== 'entry-point') {
              ret.imports.push(args);

              return {
                path: args.path,
                // make all deps external
                external: true,
              };
            }
          });
        },
      },
    ],
  });

  cache.set(cacheKey, ret);

  return ret;
};
