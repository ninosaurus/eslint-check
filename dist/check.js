"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCheck = createCheck;
exports.updateCheck = updateCheck;

var core = _interopRequireWildcard(require("@actions/core"));

var _request = _interopRequireDefault(require("./request"));

const repoToken = core.getInput('repo-token', {
  required: true
});
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${repoToken}`,
  'User-Agent': 'eslint-action'
};
const checkName = 'eslint check';

async function createCheck({
  owner,
  repo,
  sha
}) {
  const body = {
    name: checkName,
    head_sha: sha,
    status: 'in_progress',
    started_at: new Date(),
    external_id: '1'
  };
  const {
    data
  } = await (0, _request.default)(`https://api.github.com/repos/${owner}/${repo}/check-runs`, {
    method: 'POST',
    headers,
    body
  });
  const {
    id
  } = data;
  return id;
} // export async function createCheck1(
//   {
//     owner, repo,
//     sha, octokit
//   }
// ) {
//   const { data } = await octokit.checks.create({
//     owner,
//     repo,
//     name: 'eslint-check',
//     started_at: new Date(),
//     status: 'in_progress',
//     head_sha: sha
//   });
//
//   const { id } = data;
//   return id;
// }


async function updateCheck({
  id,
  conclusion,
  output,
  sha,
  owner,
  repo
}) {
  const body = {
    name: checkName,
    head_sha: sha,
    status: 'completed',
    completed_at: new Date(),
    conclusion,
    output
  };
  await (0, _request.default)(`https://api.github.com/repos/${owner}/${repo}/check-runs/${id}`, {
    method: 'PATCH',
    headers,
    body
  });
} // export async function updateCheck1(
//   {
//     octokit, id, conclusion,
//     output, owner, repo, sha
//   }
// ) {
//   await octokit.checks.create({
//     check_run_id: id,
//     owner,
//     repo,
//     name: 'eslint-check',
//     completed_at: new Date(),
//     status: 'completed',
//     head_sha: sha,
//     conclusion,
//     output
//   });
// }