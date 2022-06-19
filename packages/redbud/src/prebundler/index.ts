import { chalk, logger, winPath } from '@umijs/utils';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { Extractor } from '@microsoft/api-extractor';
import ncc from '@vercel/ncc';
import { getConfig } from './config';

export default async (opts: Parameters<typeof getConfig>[0]) => {
  // patch @microsoft/api-extractor before prepare config
  await import('./patcher');

  const config = getConfig(opts);
  const count = Object.keys(config.deps).length;
  const startTime = Date.now();

  for (const dep in config.deps) {
    const { output, pkg, nccConfig } = config.deps[dep];
    const outputDir = path.dirname(output);

    logger.info(
      `Pre-bundle ${chalk.yellow(pkg.name)} to ${chalk.yellow(
        winPath(path.relative(opts.cwd, outputDir))
      )}`
    );

    await ncc(dep, nccConfig).then(({ code }: { code: string }) => {
      // create dist path
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // TODO: dist content validate

      // emit dist file
      fs.writeFileSync(output, code, 'utf-8');

      // emit package.json
      fs.writeFileSync(
        path.join(output, '../package.json'),
        JSON.stringify({
          name: pkg.name,
          author: pkg.author,
          license: pkg.license
        }),
        'utf-8'
      );
    });
  }

  // bundle dts
  Object.keys(config.dts).length && logger.event(`Generate declaration files...`);
  for (const dts in config.dts) {
    Extractor.invoke(config.dts[dts].maeConfig, {
      localBuild: true,
      showVerboseMessages: false
    });
  }

  if (count) {
    logger.event(`Pre-bundled successfully in ${Date.now() - startTime} ms (${count} deps)`);
  }
};
