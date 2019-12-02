import { join, resolve } from 'path';
import { CLIEngine } from 'eslint';
import * as github from '@actions/github';
import * as core from '@actions/core';
import { Toolkit } from 'actions-toolkit';

const { readdirSync } = require('fs');

const tools = new Toolkit();
const request = require('./request');

const gql = (s) => s.join('');

const {
  GITHUB_SHA, GITHUB_TOKEN, GITHUB_WORKSPACE,
  GITHUB_REPOSITORY,
  CUSTOM_DIRECTORY
} = process.env;

const getDirectories = (source) => readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (CUSTOM_DIRECTORY) {
  const directory = join(process.cwd(), CUSTOM_DIRECTORY);
  tools.log.info(`New directory: ${directory}`);
  process.chdir(directory);
  tools.log.info(getDirectories(process.cwd()));
}

const checkName = 'ESLint check';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
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
    extensions: ['.js', '.jsx', '.tsx'],
    ignorePath: '.gitignore'
  });
  const report = cli.executeOnFiles(files);

  // fixableErrorCount, fixableWarningCount are available too
  const { results, errorCount, warningCount } = report;

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const result of results) {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);
    tools.log.info({
      filePath,
      GITHUB_WORKSPACE,
      path
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const msg of messages) {
      const {
        line, severity,
        ruleId, message
      } = msg;
      const annotationLevel = levels[severity];
      annotations.push({
        path,
        start_line: line,
        end_line: line,
        annotation_level: annotationLevel,
        message: `[${ruleId}] ${message}`
      });
    }
  }

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
  tools.log.info(process.env);
  tools.log.info(process.cwd());
  tools.log.info('Creating check...');
  const id = await createCheck();
  tools.log.info('Created check.');
  try {
    const octokit = new github.GitHub(
      core.getInput('repo-token', { required: true })
    );
    const { context } = github;
    console.log(context);
    process.exit(78);
    // const { repo } = context;
    // const { owner } = repo;
    // var compare = await client.Repository.Commit.Compare(owner, repo, "master", "branch")
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
    const currentSha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
    const files = prInfo.repository.pullRequest.files.nodes;
    tools.log.info(files);

    tools.log.info('Started linting...');
    const { conclusion, output } = eslint(files);
    tools.log.info('Ended linting.');
    tools.log.info(output.summary);
    await updateCheck(id, conclusion, output);
    if (conclusion === 'failure') {
      process.exit(78);
    }
  } catch
    (err) {
    await updateCheck(id, 'failure');
    exitWithError(err);
  }
}

run()
  .catch(exitWithError);
