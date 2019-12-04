import * as CONST from './constants';
// import * as core from '@actions/core';
// import request from './request';

// const repoToken = core.getInput('repo-token', { required: true });
// const headers = {
//   'Content-Type': 'application/json',
//   Accept: 'application/vnd.github.antiope-preview+json',
//   Authorization: `Bearer ${repoToken}`,
//   'User-Agent': 'eslint-action'
// };

// export async function createCheck({ owner, repo, sha }) {
//   const body = {
//     name: CONST.CHECK_NAME,
//     head_sha: sha,
//     status: 'in_progress',
//     started_at: new Date(),
//     external_id: '1'
//   };
//
//   const { data } = await request(`https://api.github.com/repos/${owner}/${repo}/check-runs`, {
//     method: 'POST',
//     headers,
//     body
//   });
//   const { id } = data;
//   return id;
// }

export async function createCheck(
  {
    owner, repo,
    sha, octokit
  }
) {
  const { data } = await octokit.checks.create({
    owner,
    repo,
    name: CONST.CHECK_NAME,
    started_at: new Date(),
    status: 'in_progress',
    head_sha: sha
  });

  const { id } = data;
  return id;
}

// export async function updateCheck(
//   {
//     id, conclusion, status = 'completed',
//     output, sha, owner, repo
//   }
// ) {
//   const body = {
//     name: CONST.CHECK_NAME,
//     head_sha: sha,
//     status,
//     completed_at: new Date(),
//     conclusion,
//     output
//   };
//
//   await request(`https://api.github.com/repos/${owner}/${repo}/check-runs/${id}`, {
//     method: 'PATCH',
//     headers,
//     body
//   });
// }

export async function updateCheck(
  {
    octokit, id, conclusion,
    output, owner, repo, sha
  }
) {
  await octokit.checks.create({
    check_run_id: id,
    owner,
    repo,
    name: CONST.CHECK_NAME,
    completed_at: new Date(),
    status: 'completed',
    head_sha: sha,
    conclusion,
    output
  });
}
