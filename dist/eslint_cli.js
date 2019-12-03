"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eslint;

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

const getDirectories = source => (0, _fs.readdirSync)(source, {
  withFileTypes: true
}).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

async function eslint(files, eslintConfigPath, githubWorkspace, customDirectory) {
  console.log(_path.default.join(process.cwd(), customDirectory, 'node_modules/eslint'));
  console.log({
    cwd: process.cwd()
  });
  const {
    CLIEngine
  } = await Promise.resolve().then(() => (0, _interopRequireWildcard2.default)(require(`${_path.default.join(process.cwd(), customDirectory, 'node_modules/eslint')}`))).then(module => {
    console.log('resolved', module);
    return module.default;
  });
  const cli = new CLIEngine({
    // useEslintrc: false,
    // configFile: path.join(githubWorkspace, eslintConfigPath),
    extensions: ['.js', '.jsx', '.tsx']
  });
  console.log(files);
  const report = cli.executeOnFiles(files); // fixableErrorCount, fixableWarningCount are available too

  const {
    results,
    errorCount,
    warningCount
  } = report;
  const levels = ['', 'warning', 'failure'];
  const annotations = []; // eslint-disable-next-line no-restricted-syntax

  for (const result of results) {
    const {
      filePath,
      messages
    } = result;
    const path = filePath.substring(githubWorkspace.length + 1); // eslint-disable-next-line no-restricted-syntax

    for (const msg of messages) {
      const {
        line,
        severity,
        ruleId,
        message
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