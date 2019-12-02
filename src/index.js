import { join, extname, resolve } from 'path';
import { CLIEngine } from 'eslint';
import * as github from '@actions/github';
import * as core from '@actions/core';
import { Toolkit } from 'actions-toolkit';
import { readdirSync, existsSync } from 'fs';

const eslintConfigPath = core.getInput('eslint-config-path', { required: true });
const repoToken = core.getInput('repo-token', { required: true });
const customDirectory = core.getInput('custom-directory', { required: true });

const tools = new Toolkit();
const request = require('./request');

const gql = (s) => s.join('');

const {
  GITHUB_SHA, GITHUB_WORKSPACE,
  GITHUB_REPOSITORY
} = process.env;

const getDirectories = (source) => readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const isFileOk = (path) => {
  try {
    if (existsSync(path)) {
      console.log(`Path: ${path} is valid`);
      return;
    }
  } catch (err) {
    console.error(err);
  }
  console.log(`Path: ${path} is not valid`);
};

if (customDirectory) {
  const directory = join(process.cwd(), customDirectory);
  tools.log.info(`New directory: ${directory}`);
  process.chdir(directory);
  tools.log.info(getDirectories(process.cwd()));
}

const checkName = 'ESLint check';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${repoToken}`,
  'User-Agent': 'eslint-action'
};

async function createCheck() {
  const body = {
    name: checkName,
    head_sha: GITHUB_SHA,
    status: 'in_progress',
    started_at: new Date()
  };

  const { data } = await request(`https://api.github.com/repos/${GITHUB_REPOSITORY}/check-runs`, {
    method: 'POST',
    headers,
    body
  });
  const { id } = data;
  return id;
}

function eslint(files) {
  const cli = new CLIEngine({
    // useEslintrc: false,
    // configFile: resolve(GITHUB_WORKSPACE, eslintConfigPath),
    extensions: ['.js', '.jsx', '.tsx']
    // cwd: resolve(GITHUB_WORKSPACE, customDirectory)
  });
  // console.log(process.cwd(), GITHUB_WORKSPACE);
  const report = cli.executeOnFiles(files);
  // fixableErrorCount, fixableWarningCount are available too
  const { results, errorCount, warningCount } = report;

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const result of results) {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);
    console.log(cli.getConfigForFile(filePath));
    // eslint-disable-next-line no-restricted-syntax
    for (const msg of messages) {
      const {
        line, severity,
        ruleId, message
      } = msg;
      console.log(msg);
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
      title: checkName,
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  };
}

async function updateCheck(id, conclusion, output) {
  const body = {
    name: checkName,
    head_sha: GITHUB_SHA,
    status: 'completed',
    completed_at: new Date(),
    conclusion,
    output
  };

  await request(`https://api.github.com/repos/${GITHUB_REPOSITORY}/check-runs/${id}`, {
    method: 'PATCH',
    headers,
    body
  });
}

function exitWithError(err) {
  tools.log.error('Error', err.stack);
  if (err.data) {
    tools.log.error(err.data);
  }
  process.exit(1);
}

async function run() {
  // tools.log.info(process.env);
  // tools.log.info(process.cwd());
  const id = await createCheck();
  tools.log.info(`Created check. Id: ${id}`);
  try {
    const octokit = new github.GitHub(repoToken);
    const { context } = github;
    const prInfo = await octokit.graphql(
      gql`
      query($owner: String!, $name: String!, $prNumber: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $prNumber) {
            files(first: 100) {
              nodes {
                path
              }
            }
            commits(last: 1) {
              nodes {
                commit {
                  oid
                }
              }
            }
          }
        }
      }
    `,
      {
        owner: context.repo.owner,
        name: context.repo.repo,
        prNumber: context.issue.number
      }
    );
    // const currentSha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
    // tools.log.info('Commit from GraphQL:', currentSha);
    const files = prInfo.repository.pullRequest.files.nodes;
    // tools.log.info(files);
    const EXTENSIONS_TO_LINT = new Set([
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx'
    ]);
    const filesToLint = files
      .filter((file) => EXTENSIONS_TO_LINT.has(extname(file.path)))
      .map((file) => resolve(GITHUB_WORKSPACE, file.path));
    if (filesToLint.length < 1) {
      tools.log.warn(
        `No files with [${[...EXTENSIONS_TO_LINT].join(
          ', '
        )}] extensions added or modified in this PR, nothing to lint...`
      );
      return;
    }

    // filesToLint.forEach(isFileOk);

    tools.log.info('Started linting...');
    const { conclusion, output } = eslint(filesToLint);
    tools.log.info('Ended linting.');
    tools.log.info(conclusion, output.summary);
    await updateCheck(id, conclusion, output);
    if (conclusion === 'failure') {
      process.exit(78);
    }
  } catch (err) {
    await updateCheck(id, 'failure');
    exitWithError(err);
  }
}

run()
  .catch(exitWithError);
