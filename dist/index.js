"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _path = require("path");

var core = _interopRequireWildcard(require("@actions/core"));

var _rest = _interopRequireDefault(require("@octokit/rest"));

var github = _interopRequireWildcard(require("@actions/github"));

var _graphql = require("@octokit/graphql");

var _github2 = require("./github");

var CONST = _interopRequireWildcard(require("./constants"));

var _utils = require("./utils");

var _eslint = _interopRequireDefault(require("./eslint"));

const eslintConfigPath = core.getInput('eslint-config-path', {
  required: true
});
const repoToken = core.getInput('repo-token', {
  required: true
});
const customDirectory = core.getInput('custom-directory', {
  required: true
});
const {
  GITHUB_WORKSPACE
} = process.env;

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
  const prInfo = await (0, _github2.getPullRequestInfo)({
    graphqlWithAuth,
    prNumber: context.issue.number,
    owner,
    repo
  });
  const sha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
  const files = prInfo.repository.pullRequest.files.nodes;
  const id = await (0, _github2.createCheck)({
    owner,
    sha,
    octokit,
    repo
  });
  const filesToLint = files.filter(file => CONST.EXTENSIONS_TO_LINT.has((0, _path.extname)(file.path)) && (0, _utils.isFileOk)(file.path)).map(file => file.path);

  if (filesToLint.length < 1) {
    const extensionsString = CONST.EXTENSIONS_TO_LINT.join(', ');
    console.warn(`No files with [${extensionsString}] extensions added or modified in this PR, nothing to lint...`);
    return;
  }

  try {
    const {
      conclusion,
      output
    } = await (0, _eslint.default)({
      files: filesToLint,
      eslintConfigPath,
      githubWorkspace: GITHUB_WORKSPACE,
      customDirectory,
      title: CONST.CHECK_NAME
    });
    await (0, _github2.updateCheck)({
      id,
      conclusion,
      output,
      octokit,
      repo,
      owner,
      sha
    });

    if (conclusion === 'failure') {
      core.setFailed('ESLint found some errors');
    }
  } catch (err) {
    await (0, _github2.updateCheck)({
      id,
      conclusion: 'failure',
      repo,
      owner,
      octokit,
      sha
    });
    (0, _utils.exitWithError)(err);
  }
}

run().catch(_utils.exitWithError);