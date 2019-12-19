# OTP-UI React Component Library

## Description

React component library, which can be used to build trip planner webapps. See https://github.com/opentripplanner/otp-react-redux for a reference implementation of otp-ui (IMPORTANT: WIP / TBD...on using otp-ui in otp-rr). See https://www.npmjs.com/org/opentripplanner for current releases.

## Getting Started

```bash
 git checkout
 yarn install
 yarn build
 yarn dev
```

## Storybook Demo

> see https://ibi-group.github.io/otp-ui

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
- `yarn build` - This babelfies all of the packages and creates `/lib` folders for each one.
- `yarn unit` - Run jest unit tests.
- `yarn coverage` - Shows jest unit coverage.

## Lerna

- `lerna changed` - Show which packages have changed.
- `lerna diff` - Show specifically what files have cause the packages to change.
- `lerna create <packageName>` - Creates new package and walks through setting up package.json

## Lerna Publish to NPM

Some commands you might need to execute for npm:

```bash
 npm login
 npm config set access public
 npx lerna publish
```

## Linking

When linking inside of the Monorepo, everything works as expected. If you are trying to consume packages from this Monorepo _in a different application_ locally, using `npm link` or `yarn link` [does not work as expected](https://github.com/yarnpkg/yarn/issues/5538). However, we have a workaround for the time being.

1. Run `yarn build`
2. Run `yarn dev`
3. Change the `package.json` of the consumer from `$YOUR_PACKAGE_NAME` (which lives inside the monorepo) to `file:./../monorepo/packages/$YOUR_PACKAGE_NAME`
4. Run `rm -rf node_modules && yarn` in the consumer
5. 🎉

## Contributing

All formatting and linting should be taken care of for you using [stylelint](https://github.com/stylelint/stylelint), [ESLint](https://eslint.org/), and [Prettier](https://prettier.io/). You should also consider installing an extension for CSS syntax highlighting.

- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
- [webstorm-styled-components](https://github.com/styled-components/webstorm-styled-components)
- [Other IDEs](https://www.styled-components.com/docs/tooling#syntax-highlighting)
