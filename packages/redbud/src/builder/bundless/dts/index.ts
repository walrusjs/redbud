import path from 'path';
// @ts-ignore
import tsTransformPaths from '../../../../compiled/@zerollup/ts-transform-paths';

interface GetDeclarationsOptions {
  /** 当前的工作目录 */
  cwd: string;
}

interface Output {
  file: string;
  content: string;
  sourceFile: string;
}

/**
 * 获取Ts文件的类型定义
 * @param inputFiles
 * @param opts
 * @returns
 */
export async function getDeclarations(inputFiles: string[], opts: GetDeclarationsOptions) {
  const output: Output[] = [];
  const ts = await import('typescript');

  const tsconfigPath = ts.findConfigFile(opts.cwd, ts.sys.fileExists);

  if (tsconfigPath) {
    const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    const tsconfig = ts.parseJsonConfigFileContent(
      tsconfigFile.config,
      ts.sys,
      path.dirname(tsconfigPath)
    );

    const tsHost = ts.createCompilerHost(tsconfig.options);

    tsHost.writeFile = (fileName, declaration, _a, _b, sourceFiles = []) => {
      let sourceFile = sourceFiles![0].fileName;

      if (path.isAbsolute(sourceFile)) {
        sourceFile = path.relative(opts.cwd, sourceFile);
      }

      output.push({
        file: path.basename(fileName),
        content: declaration,
        sourceFile: sourceFile
      });
    };

    const program = ts.createProgram(inputFiles, tsconfig.options, tsHost);

    const transformer = tsTransformPaths(program);

    if (transformer.afterDeclarations) {
      program.emit(undefined, undefined, undefined, true, {
        afterDeclarations: [transformer.afterDeclarations]
      });
    }
  }

  return output;
}
