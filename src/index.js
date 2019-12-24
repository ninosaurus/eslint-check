import { extname } from 'path';
import * as core from '@actions/core';
import Octokit from '@octokit/rest';
import * as github from '@actions/github';
import { graphql } from '@octokit/graphql';
import {
  createCheck,
  updateCheck,
  getPullRequestInfo
} from './github';
import * as CONST from './constants';
import {
  exitWithError,
  isFileOk
} from './utils';
import eslint from './eslint';

const eslintConfigPath = core.getInput('eslint-config-path', { required: true });
const eslintignorePath = core.getInput('eslintignore-path', { required: true });
const repoToken = core.getInput('repo-token', { required: true });
const customDirectory = core.getInput('custom-directory', { required: true });

const {
  GITHUB_WORKSPACE
} = process.env;

async function run() {
  const octokit = new Octokit({
    auth: `token ${repoToken}`,
    userAgent: 'Branch Protection script',
    baseUrl: `https://api.${CONST.GITHUB_URL}`,
    log: {
      debug: () => {
      },
      info: () => {
      },
      warn: console.warn,
      error: console.error
    },
    previews: ['antiope-preview']
  });

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${repoToken}`
    }
  });
  const { context } = github;
  const { owner, repo } = context.repo;

  const prInfo = await getPullRequestInfo({
    graphqlWithAuth,
    prNumber: context.issue.number,
    owner,
    repo
  });

  const sha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
  const files = prInfo.repository.pullRequest.files.nodes;

  const filesToLint = files
    .filter((file) => CONST.EXTENSIONS_TO_LINT.includes(extname(file.path)) && isFileOk(file.path))
    .map((file) => file.path);
  if (filesToLint.length < 1) {
    const extensionsString = CONST.EXTENSIONS_TO_LINT.join(', ');
    console.warn(
      `No files with [${extensionsString}] extensions added or modified in this PR, nothing to lint...`
    );
    return;
  }

  const id = await createCheck({
    owner,
    sha,
    octokit,
    repo
  });

  try {
    const { conclusion, output } = await eslint({
      files: filesToLint,
      eslintConfigPath,
      eslintignorePath,
      githubWorkspace: GITHUB_WORKSPACE,
      customDirectory,
      title: CONST.CHECK_NAME
    });

    await updateCheck({
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
    await updateCheck({
      id,
      conclusion: 'failure',
      repo,
      owner,
      octokit,
      sha
    });
    exitWithError(err);
  }
}

run()
  .catch(exitWithError);
