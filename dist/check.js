"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCheck = createCheck;
exports.updateCheck = updateCheck;

async function createCheck({
  owner,
  repo,
  sha,
  octokit
}) {
  const {
    data
  } = await octokit.checks.create({
    owner,
    repo,
    name: 'eslint-check',
    started_at: new Date(),
    status: 'in_progress',
    head_sha: sha
  });
  const {
    id
  } = data;
  return id;
}

async function updateCheck({
  octokit,
  id,
  conclusion,
  output,
  owner,
  repo,
  sha
}) {
  await octokit.checks.create({
    check_run_id: id,
    owner,
    repo,
    name: 'eslint-check',
    completed_at: new Date(),
    status: 'completed',
    head_sha: sha,
    conclusion,
    output
  });
}