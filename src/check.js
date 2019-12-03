export async function createCheck(
  {
    owner, repo,
    sha, octokit
  }
) {
  const { data } = await octokit.checks.create({
    owner,
    repo,
    name: 'eslint-check',
    started_at: new Date(),
    status: 'in_progress',
    head_sha: sha,
    mediaType
  });

  const { id } = data;
  return id;
}

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
    name: 'eslint-check',
    completed_at: new Date(),
    status: 'completed',
    head_sha: sha,
    conclusion,
    output
  });
}
