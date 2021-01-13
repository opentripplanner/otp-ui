# OTP-UI React Component Library

## Description

React component library, which can be used to build trip planner webapps.

See:

- [Examples and docs (via Storybook)](http://www.opentripplanner.org/otp-ui/?path=/story/itinerarybody--itinerarybody-with-walk-transit-walk-itinerary-with-custom-view-trip-button-activated-and-custom-route-abbreviation)
- [Current npm releases](https://www.npmjs.com/org/opentripplanner)
- [A reference implementation of otp-ui](https://github.com/opentripplanner/otp-react-redux) -- IMPORTANT NOTE: otp-ui use in otp-rr is a WIP / TBD

## Getting Started

```bash
 git checkout https://github.com/opentripplanner/otp-ui.git
 yarn install
 yarn dev # (opens storybook to running component library on localhost:5555)
```

## Development

Some packages in otp-ui depend on sibling packages (e.g., `@opentripplanner/core-utils` is used by many of its siblings). In order to test a package with local changes you have made to its sibling, you can run the following find/replace operations to make sure you're depending on your latest work (and not the released version):

1. In the `package.json` files for packages in which you want to test the sibling, find and replace (package-to-test being the package with local changes -- make sure these are committed to first to avoid the find/replace operations below polluting your work):

   > "@opentripplanner/package-to-test": **"current-version"**

   with

   > "@opentripplanner/package-to-test": **"file:../package-to-test"**

2. In your source files, find and replace:

   > opentripplanner/package-to-test/**lib**/types

   with

   > opentripplanner/package-to-test/**src**/types

3. Run:
   `yarn && yarn dev`

## Stack

> A Monorepo with multiple packages and a shared build, test, and release process.

- 🐉 [Lerna](https://lernajs.io/)  - The Monorepo manager
- 📦 [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)  -  Sane multi-package management
- 🚀 [React](https://reactjs.org/)  -  JavaScript library for user interfaces
- 💅 [styled-components](https://www.styled-components.com/)  -  CSS in JS elegance
- 🛠 [Babel](https://babeljs.io/)  -  Compiles next-gen JavaScript
- 📖 [Storybook](https://storybook.js.org/) - UI Component Environment
- 🃏 [Jest](https://jestjs.io/)  -  Unit/Snapshot Testing

## Usage

- `yarn dev` - This starts Storybook for viewing all the components locally.
- `yarn bootstrap` - This installs all of the packages and links dependent packages together.
- `yarn preppublish` - This babelfies all of the packages and creates `/lib` folders for each one.
- `yarn unit` - Run jest unit tests.
- `yarn coverage` - Shows jest unit coverage.
- `npx lerna changed` - Show which packages have changed.
- `npx lerna diff` - Show specifically what files have cause the packages to change.
- `npx lerna create <packageName>` - Creates new package and walks through setting up package.json

## Releasing

This project uses semantic-release to create releases to NPM. It is expect that contributors create [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) messages. These are then parsed by semantic-release which will automatically create an appropriate release for each package whenever a branch is merged to master.

Sometimes when creating new releases, it will be necessary to update numerous packages within this repo at once to a newer internal package version. For this purpose there is the `update-internal-dependencies` script. This should be ran manually as needed. By default, `yarn update-internal-dependencies` will update all dependencies with the `@opentripplanner` scope in all packages within this project. To only update specific dependencies, it is possible to run something like `yarn update-internal-dependencies core-utils base-map`. This would update all dependencies on either the `@opentripplanner/base-map` or the `@opentripplanner/core-utils` in all packages in this project.
