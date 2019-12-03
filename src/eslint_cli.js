import path from 'path';
import { readdirSync } from 'fs';

const getDirectories = (source) => readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

export default async function eslint(files, eslintConfigPath, githubWorkspace, customDirectory) {
  console.log(path.join(process.cwd(), customDirectory, 'node_modules/eslint'));
  console.log({
    cwd: process.cwd()
  });
  const { CLIEngine } = (await import(path.join(process.cwd(),
    customDirectory,
    'node_modules/eslint')).then(((module) => {
    console.log('resolved', module);
    return module.default;
  })));
  const cli = new CLIEngine({
    useEslintrc: false,
    configFile: path.join(githubWorkspace, eslintConfigPath),
    resolvePluginsRelativeTo: path.join(githubWorkspace, customDirectory, 'node_modules'),
    extensions: ['.js', '.jsx', '.tsx']
  });
  console.log(files);
  const report = cli.executeOnFiles(files);
  // fixableErrorCount, fixableWarningCount are available too
  const { results, errorCount, warningCount } = report;

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const result of results) {
    const { filePath, messages } = result;
    const path = filePath.substring(githubWorkspace.length + 1);
    // eslint-disable-next-line no-restricted-syntax
    for (const msg of messages) {
      const {
        line, severity,
        ruleId, message
      } = msg;
      const annotationLevel = levels[severity];
      if (!cli.isPathIgnored(filePath)) {
        annotations.push({
          path,
          start_line: line,
          end_line: line,
          annotation_level: annotationLevel,
          message: `[${ruleId}] ${message}`
        });
      }
    }
  }
  console.log(annotations);
  return {
    conclusion: errorCount > 0 ? 'failure' : 'success',
    output: {
      // title: checkName,
      title: 'testic',
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  };
}
