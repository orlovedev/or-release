# Publishing releases to NPM

[en](./npm.en.md) ∘ [ru](./npm.ru.md)

This document briefly describes the automation of the process of publishing new release to **NPM**. It is also applicable for publishing to other registries, including **GitHub Packages**. For details, see the examples below. The process itself is quite straightforward:

- A CI job is needed to be created, that will be run on publising a new release/tag
- The codebase needs to be prepared for publishing (e.g., transpiling Babel/TypeScript)
- The release/tag version needs to be put in `package.json` **version**
- `NODE_AUTH_TOKEN` environment variable needs to be provided to be able to publish
- now we are ready to publish to NPM

## GitHub Actions

```yml
# ./.github/workflows/npm-publish-workflow.yml
name: Publish Node.js Package
on:
 release:
  # Only execute this workflow when a GitHub release is released.
  types: [released]
jobs:
 npm:
  runs-on: ubuntu-latest
  steps:
   - uses: actions/checkout@v2
   - uses: actions/setup-node@v1
     with:
      node-version: '12.x'
      # If you want to publish to a different registry, you can set it
      # here. E.g. for publishing to GitHub Packages, replace this with
      # "https://npm.pkg.github.com/".
      registry-url: 'https://registry.npmjs.org'
      # If you use scoped packages, put the scope here. If you don't,
      # just remove this property altogether.
      scope: '@priestine'
   - name: Set env
     # This command extracts the release tag value and assigns it to a
     # RELEASE_VERSION env variable.
     run: echo ::set-env name=RELEASE_VERSION::${GITHUB_REF#refs/*/}
   - name: Install dependencies
     run: npm ci
     # This step should contain the processes needed to make your
     # codebase look the way you expect it to be in the registry.
   - name: Transpile to JavaScript
     run: npm run build
     # This step puts the release tag value to package.json -> version.
   - run: |
      sed -i s/"\"version\":.*/\"version\": \"$RELEASE_VERSION\","/ package.json
   - name: Publish to NPM
     run: npm publish
     env:
      # To keep private things private, use GitHub Secrets.
      # @see https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
