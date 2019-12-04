import { extname } from 'path';
import { existsSync } from 'fs';
import * as core from '@actions/core';
// import { Toolkit } from 'actions-toolkit';
// import Octokit from '@octokit/rest';
import * as github from '@actions/github';
import { graphql } from '@octokit/graphql';
import { createCheck, updateCheck } from './check';
import * as CONST from './constants';

import eslint from './eslint_cli';

const eslintConfigPath = core.getInput('eslint-config-path', { required: true });
const repoToken = core.getInput('repo-token', { required: true });
const customDirectory = core.getInput('custom-directory', { required: true });

// const tools = new Toolkit();

const gql = (s) => s.join('');

const {
  GITHUB_WORKSPACE
} = process.env;

const isFileOk = (path) => {
  try {
    if (existsSync(path)) {
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

// const gitHubUrl = 'github.com';

async function run() {
  // const octokit = new Octokit({
  //   auth: `token ${repoToken}`,
  //   userAgent: 'Branch Protection script',
  //   baseUrl: `https://api.${gitHubUrl}`,
  //   log: {
  //     debug: () => { },
  //     info: () => { },
  //     warn: console.warn,
  //     error: console.error
  //   },
  //   previews: ['antiope-preview']
  // });

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${repoToken}`
    }
  });
  const { context } = github;
  const { owner, repo } = context.repo;

  const prInfo = await graphqlWithAuth(
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
  // console.log(prInfo);
  const sha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;

  const id = await createCheck({
    owner,
    sha,
    repo
  });
  console.info(`Created check. Id: ${id}`);
  const files = prInfo.repository.pullRequest.files.nodes;

  const filesToLint = files
    .filter((file) => CONST.EXTENSIONS_TO_LINT.has(extname(file.path)) && isFileOk(file.path))
    .map((file) => file.path);
  if (filesToLint.length < 1) {
    console.warn(
      `No files with [${[...CONST.EXTENSIONS_TO_LINT].join(
        ', '
      )}] extensions added or modified in this PR, nothing to lint...`
    );
    return;
  }

  try {
    console.info('Started linting...');

    const { conclusion, output } = await eslint({
      filesToLint,
      eslintConfigPath,
      githubWorkspace: GITHUB_WORKSPACE,
      customDirectory,
      title: CONST.CHECK_NAME
    });

    console.info('Ended linting.');
    console.info({
      conclusion,
      summary: output.summary
    });
    await updateCheck({
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
    await updateCheck({
      id,
      conclusion: 'failure',
      repo,
      owner,
      sha
    });
    exitWithError(err);
  }
}

run()
  .catch(exitWithError);
