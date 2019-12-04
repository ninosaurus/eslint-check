"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _path = require("path");

var _fs = require("fs");

var core = _interopRequireWildcard(require("@actions/core"));

var _actionsToolkit = require("actions-toolkit");

var _rest = _interopRequireDefault(require("@octokit/rest"));

var github = _interopRequireWildcard(require("@actions/github"));

var _graphql = require("@octokit/graphql");

var _check = require("./check");

var CONST = _interopRequireWildcard(require("./constants"));

var _eslint_cli = _interopRequireDefault(require("./eslint_cli"));

const eslintConfigPath = core.getInput('eslint-config-path', {
  required: true
});
const repoToken = core.getInput('repo-token', {
  required: true
});
const customDirectory = core.getInput('custom-directory', {
  required: true
}); // const tools = new Toolkit();

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
  console.error('Error', err.stack);

  if (err.data) {
    console.error(err.data);
  }

  core.setFailed(err.message);
}

async function run() {
  const octokit = new _rest.default({
    auth: `token ${repoToken}`,
    userAgent: 'Branch Protection script',
    baseUrl: `https://api.${CONST.GITHUB_URL}`,
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    previews: ['antiope-preview']
  });

  const graphqlWithAuth = _graphql.graphql.defaults({
    headers: {
      authorization: `token ${repoToken}`
    }
  });

  const {
    context
  } = github;
  const {
    owner,
    repo
  } = context.repo;
  const prInfo = await graphqlWithAuth(gql`
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
  });
  const sha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
  const id = await (0, _check.createCheck)({
    owner,
    sha,
    octokit,
    repo
  });
  console.info(`Created check. Id: ${id}`);
  const files = prInfo.repository.pullRequest.files.nodes;
  const filesToLint = files.filter(file => CONST.EXTENSIONS_TO_LINT.has((0, _path.extname)(file.path)) && isFileOk(file.path)).map(file => file.path);

  if (filesToLint.length < 1) {
    const extensionsString = CONST.EXTENSIONS_TO_LINT.join(', ');
    console.warn(`No files with [${extensionsString}] extensions added or modified in this PR, nothing to lint...`);
    return;
  }

  try {
    const {
      conclusion,
      output
    } = await (0, _eslint_cli.default)({
      filesToLint,
      eslintConfigPath,
      githubWorkspace: GITHUB_WORKSPACE,
      customDirectory,
      title: CONST.CHECK_NAME
    });
    await (0, _check.updateCheck)({
      id,
      conclusion,
      output,
      repo,
      owner,
      sha
    });

    if (conclusion === 'failure') {
      core.setFailed('ESLint found some errors');
    }
  } catch (err) {
    await (0, _check.updateCheck)({
      id,
      conclusion: 'failure',
      repo,
      owner,
      sha
    });
    exitWithError(err);
  }
}

run().catch(exitWithError);