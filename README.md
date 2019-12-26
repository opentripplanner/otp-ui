# OTP-UI React Component Library

## Description

React component library, which can be used to build trip planner webapps.

See:

- [Examples and docs (via Storybook)](https://opentripplanner.github.io/otp-ui/?path=/story/locationicon--to-locationicon)
- [Current npm releases](https://www.npmjs.com/org/opentripplanner)
- [A reference implementation of otp-ui](https://github.com/opentripplanner/otp-react-redux) -- IMPORTANT NOTE: otp-ui use in otp-rr is a WIP / TBD

## Getting Started

```bash
 git checkout https://github.com/opentripplanner/otp-ui.git
 yarn install
 yarn dev # (opens storybook to running component library on localhost:5555)
```

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

## Lerna Publish to NPM

Some commands you might need to execute for lerna to publish to npm:

```bash
 npm login
 npm config set access public
 yarn lerna changed
 yarn lerna publish
 yarn deploy-storybook
```
