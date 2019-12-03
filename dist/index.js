"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _path = require("path");

var core = _interopRequireWildcard(require("@actions/core"));

var _actionsToolkit = require("actions-toolkit");

var _rest = _interopRequireDefault(require("@octokit/rest"));

var github = _interopRequireWildcard(require("@actions/github"));

var _fs = require("fs");

var _check = require("./check");

var _eslint_cli = _interopRequireDefault(require("./eslint_cli"));

const eslintConfigPath = core.getInput('eslint-config-path', {
  required: true
});
const repoToken = core.getInput('repo-token', {
  required: true
});
const customDirectory = core.getInput('custom-directory', {
  required: true
});
const tools = new _actionsToolkit.Toolkit();

const gql = s => s.join('');

const {
  GITHUB_WORKSPACE
} = process.env;

const isFileOk = path => {
  try {
    if ((0, _fs.existsSync)(path)) {
      console.log(`Path: ${path} is valid`);
      return true;
    }
  } catch (err) {
    console.error(err);
  }

  console.log(`Path: ${path} is not valid`);
  return false;
};

function exitWithError(err) {
  tools.log.error('Error', err.stack);

  if (err.data) {
    tools.log.error(err.data);
  }

  process.exit(1);
}

async function run() {
  const octokit = new _rest.default({
    auth: repoToken
  });
  tools.log.info(process.env);
  const {
    context
  } = github;
  const {
    sha
  } = context;
  const {
    owner,
    repo
  } = context.repo;
  const id = await (0, _check.createCheck)({
    octokit,
    owner,
    sha,
    repo
  });
  tools.log.info(`Created check. Id: ${id}`);

  try {
    const {
      context
    } = github;
    const prInfo = await octokit.graphql(gql`
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
    `, {
      owner: context.repo.owner,
      name: context.repo.repo,
      prNumber: context.issue.number
    }); // const currentSha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
    // tools.log.info('Commit from GraphQL:', currentSha);

    const files = prInfo.repository.pullRequest.files.nodes; // tools.log.info(files);

    const EXTENSIONS_TO_LINT = new Set(['.mjs', '.js', '.ts', '.jsx', '.tsx']);
    const filesToLint = files.filter(file => EXTENSIONS_TO_LINT.has((0, _path.extname)(file.path)) && isFileOk(file.path)) // .map((file) => resolve(GITHUB_WORKSPACE, file.path));
    .map(file => file.path);

    if (filesToLint.length < 1) {
      tools.log.warn(`No files with [${[...EXTENSIONS_TO_LINT].join(', ')}] extensions added or modified in this PR, nothing to lint...`);
      return;
    }

    tools.log.info('Started linting...');
    const {
      conclusion,
      output
    } = await (0, _eslint_cli.default)(filesToLint, eslintConfigPath, GITHUB_WORKSPACE, customDirectory);
    tools.log.info('Ended linting.');
    tools.log.info(conclusion, output.summary);
    await (0, _check.updateCheck)({
      id,
      conclusion,
      output,
      octokit,
      repo,
      owner,
      sha
    });

    if (conclusion === 'failure') {
      process.exit(78);
    }
  } catch (err) {
    await (0, _check.updateCheck)(id, 'failure');
    exitWithError(err);
  }
}

run().catch(exitWithError);