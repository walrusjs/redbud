import { chalk, lodash, logger } from '@umijs/utils';
import { Api } from '../types';

export default (api: Api) => {
  api.registerCommand({
    name: 'help',
    alias: 'h',
    description: 'show redbud usage',
    configResolveMode: 'loose',
    fn() {
      const subCommand = api.args._[0];
      if (subCommand) {
        if (subCommand in api.service.commands) {
          showHelp(api.service.commands[subCommand]);
        } else {
          logger.error(`Invalid sub command ${subCommand}.`);
        }
      } else {
        showHelps(api.service.commands);
      }
    },
  });
};

function showHelp(command: any) {
  console.log(
    [
      `\nUsage: redbud ${command.name}${command.options ? ` [options]` : ''}`,
      command.description ? `\n${chalk.gray(command.description)}.` : '',
      command.options ? `\n\nOptions:\n${padLeft(command.options)}` : '',
      command.details ? `\n\nDetails:\n${padLeft(command.details)}` : '',
    ].join(''),
  );
}

function showHelps(commands: Api['service']['commands']) {
  console.log(`
Usage: redbud <command> [options]

Commands:
${getDeps(commands)}
`);
  console.log(
    `Run \`${chalk.bold(
      'redbud help <command>',
    )}\` for more information of specific commands.`,
  );
  console.log(
    `Visit ${chalk.bold(
      'https://github.com/umijs/redbud-next',
    )} to learn more about redbud.`,
  );
}

function getDeps(commands: any) {
  return Object.keys(commands)
    .map((key) => {
      return `    ${chalk.green(lodash.padEnd(key, 10))}${
        commands[key].description || ''
      }`;
    })
    .join('\n');
}

function padLeft(str: string) {
  return str
    .trim()
    .split('\n')
    .map((line: string) => `    ${line}`)
    .join('\n');
}
