
<p align="center">
  <a href="https://github.com/actions/javascript-action"><img alt="GitHub Actions status" src="https://github.com/actions/javascript-action/workflows/test-local/badge.svg"></a>
</p>

# ESLint checker

Use this action to check if changed files in pull request are matched with provided eslint rules.:rocket:

## Code example

```bash
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    name: ESLint checker

    strategy:
      matrix:
        node-version: ['12.*']

    steps:
      # To use this repository's private action, you must check out the repository
      - name: Checkout
        uses: actions/checkout@v1
        with:
          fetch-depth: 1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: npm install
        run: npm ci --ignore-scripts

      - name: Run ESLint
        uses: ./
        with:
          eslint-config-path: ".eslintrc"
          custom-directory: "./"
          repo-token: ${{secrets.GITHUB_TOKEN}}

```
