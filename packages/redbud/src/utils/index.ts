/**
 * 获取包的名称
 * @param name
 * @returns
 */
export function getPkgName(name: string) {
  return name?.startsWith('@') ? name.split('/')[1] : name;
}
