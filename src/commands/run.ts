import { fsExtra, resolve } from '@umijs/utils';
import assert from 'assert';
import { fork } from 'child_process';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { Api } from '../types';

export default (api: Api) => {
  api.describe({
    key: 'run',
    config: {
      schema(Joi) {
        return Joi.object({
          globals: Joi.array().items(Joi.string()),
        });
      },
    },
  });

  api.registerCommand({
    name: 'run',
    description: 'run scripts',
    fn: ({ args }) => {
      const globals: string[] = api.config.run?.globals || [];
      const [scriptFilePath, ...restArgs] = args._;
      const absScriptFilePath = join(api.cwd, scriptFilePath);

      const fileName = getFileNameByPath(absScriptFilePath);
      assert(fileName, `${absScriptFilePath} is not a valid file`);
      assert(
        /\.([jt])s$/.test(fileName),
        `${fileName} is not a valid js or ts file`,
      );
      const absTmpFilePath = join(
        api.paths.absNodeModulesPath,
        '.cache',
        'redbud-plugin-run',
        fileName,
      );
      fsExtra.mkdirpSync(dirname(absTmpFilePath));
      writeFileSync(
        absTmpFilePath,
        `${globals.map(
          (item) => `import '${item}'\n`,
        )}import '${absScriptFilePath}';`,
        'utf-8',
      );
      const tsxPath = getBinPath();
      fork(tsxPath, [absTmpFilePath, ...restArgs], { stdio: 'inherit' });
    },
  });
};

export function getBinPath() {
  const pkgPath = resolve.sync('tsx/package.json', { basedir: __dirname });
  const pkgContent = require(pkgPath);

  return join(dirname(pkgPath), pkgContent.bin);
}

export function getFileNameByPath(params: string) {
  return params.split('/').at(-1);
}
