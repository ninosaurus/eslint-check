import * as CONST from './constants';

const gql = (s) => s.join('');

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

export async function getPullRequestInfo(
  {
    graphqlWithAuth, owner, repo, prNumber
  }
) {
  return graphqlWithAuth(
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
      owner,
      name: repo,
      prNumber
    }
  );
}
