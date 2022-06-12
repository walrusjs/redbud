import type { Api } from '../types';

/**
 * 获取包的名称
 * @param name
 * @returns
 */
export function getPkgName(name: string) {
  return name?.startsWith('@') ? name.split('/')[1] : name;
}

interface GetUmdNameOptions {
  suffix?: string;
  minifier?: boolean;
}

export function getUmdName(
  pkg: Api['pkg'],
  defaultName: string = 'index',
  opts: GetUmdNameOptions = {}
) {
  const { suffix, minifier } = opts;
  const pkgName = getPkgName(pkg.name as string) ?? defaultName;

  return `${pkgName}${suffix ? '.' + suffix : ''}${minifier ? 'min' : ''}`;
}
