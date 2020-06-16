# ||l @priestine/versions

![lint](https://github.com/priestine/versions/workflows/lint/badge.svg)
![ava](https://github.com/priestine/versions/workflows/AVA/badge.svg)

[![Maintainability](https://api.codeclimate.com/v1/badges/47fea726a5dfd86413cf/maintainability)](https://codeclimate.com/github/priestine/versions/maintainability)
[![codecov](https://codecov.io/gh/priestine/versions/branch/master/graph/badge.svg)](https://codecov.io/gh/priestine/versions)

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![@priestine/versions](https://img.shields.io/badge/versioning-%40priestine%2Fversions-E76D83.svg)](https://github.com/priestine/versions)

A tool for automating [Semantic Versioning](https://semver.org) on your project.

## Features

- ✅ Compatible with GitHub releases. _GitLab releases and direct git tagging (hello, BitBucket) on the way!_
- ⚙️ Bump versions for the code written in any programming language with no configuration - only git matters
- 📝 Automatically generated list of changes that is put into the release body. _An option to also write to a file will also be available!_
- 🤔 Works with [gitmoji](https://gitmoji.carloscuesta.me) commits convention. _[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and [turbo-git](https://github.com/labs-js/turbo-git) comming soon, as well as custom conventions you can set up for your project_

## Why

I'll tell you why a little bit later, when I have some free time.

## Getting Started

Using @priestine/versions is quite simple. You need Node installed and with that in place, you just `npx @priestine/versions`. Take a look at the examples provided below.

### Local Machine Example

Go to the folder where your project lives and:

```shell
npx @priestine/versions --token=$TOKEN --repository=avajs/ava
```

### GitHub Actions Example

```yml
# The name may be anything you like
name: Priestine Versioning
on:
 push:
  # The workflow will run when a push lands on the master branch
  branches: [master]
jobs:
 # This name may also be arbitrary
 versioning:
  # I didn't test it on Windows but it should not be important
  runs-on: ubuntu-latest
  steps:
   # Use checkout action to get the code
   - uses: actions/checkout@v2
     with:
      # Full depth is important because by default checkout action only fetches one commit
      fetch-depth: 0
   # Install Node to make @priestine/versions work
   - name: Setup Node
     uses: actions/setup-node@v1
     with:
      node-version: '12.x'
   # Do stuff
   - name: Publish new version if applicable
     run: npx @priestine/versions@latest --token=${{ secrets.PRIESTINE_VERSIONS_TOKEN }} --repository=$GITHUB_REPOSITORY
```

## Configuration

| CLI Option | Short Description           | CLI Usage                      |
| ---------- | --------------------------- | ------------------------------ |
| Token      | Access token for publishing | --token=\$SOME_TOKEN           |
| Repository | Owner/Repo                  | --repository=octocat/github    |
| Bump Patch | Force bumping patch version | --bump-patch[=<true \| false>] |
| Bump Minor | Force bumping minor version | --bump-minor[=<true \| false>] |
| Bump Major | Force bumping major version | --bump-patch[=<true \| false>] |

### Detailed description

#### Token

Token is used to publish the tag with associated release using GitHub API. For some reason, the `$GITHUB_TOKEN` that is automatically provided by GitHub Actions didn't work for me. So, for now, a custom token is needed. To make it work, you can just issue a token yourself. The token needs **read/write** access to the repository.

#### Repository

You MUST provide `--repository=$REPOSITORY` option that is usually available in CI tools already, e.g. `$GITHUB_REPOSITORY` in GitHub Actions. Internally, it is a part of the repository URL containing the owner and the repo name, e.g. **priestine/versions**. Even if your CI tool doesn't provide it, it's not too complicated so you can put it yourself.

#### Bump Patch

If, for some reason, you want to force bumping the patch version, even if it is not needed based on the types of commits you've made since the previous release, you can provide the `--bump-patch`. Keep in mind that this may negatively affect the appearance of your changelog.

#### Bump Minor

If, for some reason, you want to force bumping the minor version, even if it is not needed based on the types of commits you've made since the previous release, you can provide the `--bump-minor`. Keep in mind that this may negatively affect the appearance of your changelog.

#### Bump Major

If, for some reason, you want to force bumping the major version, even if it is not needed based on the types of commits you've made since the previous release, you can provide the `--bump-major`. Keep in mind that this may negatively affect the appearance of your changelog.

## Caveats

- **Help needed** - for some reason, `$GITHUB_TOKEN` did not work for me when I tried to use it for creating releases from GitHub Actions. I am not very skilled with this tool so there's probably me doing something wrong.
- Currently, @priestine/versions only works with GitHub (on-premise solutions not supported yet) and gitmoji as a commit convention.
