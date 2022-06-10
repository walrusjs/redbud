import path from 'path';
// @ts-ignore
import tsTransformPaths from '../../../../compiled/@zerollup/ts-transform-paths';

export async function getDeclarations(inputFiles: string[], opts: { cwd: string }) {
  const output: { file: string; content: string; sourceFile: string }[] = [];
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

    tsHost.writeFile = (fileName, declaration, _a, _b, sourceFiles) => {
      output.push({
        file: path.basename(fileName),
        content: declaration,
        sourceFile: sourceFiles![0].fileName
      });
    };

    const program = ts.createProgram(inputFiles, tsconfig.options as any, tsHost);

    const transformer = tsTransformPaths(program);

    if (transformer.afterDeclarations) {
      program.emit(undefined, undefined, undefined, true, {
        afterDeclarations: [transformer.afterDeclarations]
      });
    }
  }

  return output;
}
