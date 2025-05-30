# OTP-UI React Component Library

[![Join the chat at https://gitter.im/opentripplanner/otp-react-redux](https://badges.gitter.im/repo.png)](https://gitter.im/opentripplanner/otp-react-redux)
[![Build process badge](https://img.shields.io/github/actions/workflow/status/opentripplanner/otp-ui/node-ci.yml)](https://github.com/opentripplanner/otp-ui/actions/workflows/node-ci.yml)

## Description

React component library, which can be used to build trip planner webapps.

See:

- [Examples and docs (via Storybook)](http://www.opentripplanner.org/otp-ui/?path=/story/itinerarybody--itinerarybody-with-walk-transit-walk-itinerary-with-custom-view-trip-button-activated-and-custom-route-abbreviation)
- [Current npm releases](https://www.npmjs.com/org/opentripplanner)
- [A reference implementation of otp-ui](https://github.com/opentripplanner/otp-react-redux) -- IMPORTANT NOTE: otp-ui use in otp-rr is a WIP / TBD

## Getting Started

```bash
 git checkout https://github.com/opentripplanner/otp-ui.git
 pnpm install
 pnpm dev
```

## Development

You can chat with the main OTP-RR developers in our [Gitter chat](https://gitter.im/opentripplanner/otp-react-redux). Support is not guaranteed, but we may be able to answer questions and assist people wishing to make contributions.

Some packages in otp-ui depend on sibling packages (e.g., `@opentripplanner/core-utils` is used by many of its siblings). Internal dependencies are handled with the `workspace:*` version, which is a notation provided by pnpm. This allows us to always reference the current internal dependency version. Therefore, before the storybook can be run, it's necessary to run `pnpm prepublish` so that all internal packages are built.

If the Storybook addon bar (a bar of controls at the bottom of the story) does not appear, you may need to clear localStorage by opening the browser console and typing `localStorage.clear()`.

### Storyshot testing

This repo utilizes the [Storyshot](https://storybook.js.org/docs/react/workflows/snapshot-testing) Storybook addon to perform snapshot tests of every story in this monorepo. Whenever the script `pnpm unit` is ran, the Storyshot addon will be included along with all the other tests. It will compare the initial output of every story to the saved snapshot of that story. This provides a quick way to make sure nothing drastic has changed and that every single story is able to initially render without an error. Storyshot doesn't snapshot all possible changes that can be done while interacting with story components. Often times these snapshots will need to be updated and that can be accomplished by running `pnpm update-snapshots`.

## Stack

> A Monorepo with multiple packages and a shared build, test, and release process.

- 🐉 [Lerna](https://lernajs.io/)  - The Monorepo manager
- 📦 [PNPM Workspaces](https://pnpm.io/workspaces)  -  Sane multi-package management
- 🚀 [React](https://reactjs.org/)  -  JavaScript library for user interfaces
- 💅 [styled-components](https://www.styled-components.com/)  -  CSS in JS elegance
- 🛠 [Babel](https://babeljs.io/)  -  Compiles next-gen JavaScript
- 📖 [Storybook](https://storybook.js.org/) - UI Component Environment
- 🃏 [Jest](https://jestjs.io/)  -  Unit/Snapshot Testing

## Usage

- `pnpm dev` - This starts Storybook for viewing all the components locally.
- `pnpm install` - This installs all of the packages and links dependent packages together.
- `pnpm preppublish` - This babelfies all of the packages and creates `/lib` and `/esm` folders for each one.
- `pnpm unit` - Run jest unit tests.
- `pnpm coverage` - Shows jest unit coverage.
- `pnpm clean` - Deletes all files in the gitignore (note: this can delete local editor settings)
- `pnpm pack-all` - Creates tarball packages for all non-private packages and displays their locations.
- `npx lerna changed` - Show which packages have changed.
- `npx lerna diff` - Show specifically what files have cause the packages to change.
- `npx lerna create <packageName>` - Creates new package and walks through setting up package.json

## Releasing

This project uses semantic-release to create releases to NPM. It is expect that contributors create [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) messages. These are then parsed by semantic-release which will automatically create an appropriate release for each package whenever a branch is merged to master.

## Local Testing

Internal package dependencies are referenced using the `workspace` [protocol provided by pnpm](https://pnpm.io/workspaces). This allows us to depend on our internal packages without keeping versions up to date, but these versions must be replaced with the actual version numbers prior to release. pnpm handles this when publishing automatically. However, if you wish to rely on an otp-ui package in a local filesystem project using the `file` protocol, you need to use `pnpm pack` to create a tarball of the package, then reference that tarball in the other project's package.json.

For example, to depend on core-utils locally, you can run `pnpm pack` from within the `packages/core-utils`. Next, in the other project, use a line like this to reference the resulting tarball. `"@opentripplanner/core-utils": "file:../otp-ui/packages/core-utils/opentripplanner-core-utils-12.0.2.tgz",`

### Package Tarball Creation

The `pnpm pack-all` command creates tarball packages for all non-private packages in the monorepo and displays their locations. This is useful for testing packages locally in another project.

When executed, this command runs `pnpm pack` for each non-private package and outputs the path to the generated tarball file. You can then reference these tarballs directly in other projects using the file protocol in your other project's package.json.

## Raster Tile Versions

As of Fall 2022, the otp-ui map layers have migrated from [Leaflet](https://leafletjs.com) to [MapLibreGL](https://maplibre.org/projects/maplibre-gl-js/). This migration was a breaking change, so existing uses of otp-ui should be unaffected. If you wish to migrate to the latest version, please see the [Migration Guide](https://github.com/opentripplanner/otp-ui/blob/master/VECTOR-TILES-MIGRATION-GUIDE.md).

We understand not all will want to upgrade to vector tiles right away, and so will be maintaining the _raster tile_ versions of all relevant packages for the foreseeable future.

The following table lists the last major version of each package which uses raster tiles. These major versions will receive fresh minor versions as updates are needed.

| Package                   | Latest Major Version with Raster Tiles |
| ------------------------- | -------------------------------------- |
| `base-map`                | 2                                      |
| `core-utils`              | 7                                      |
| `endpoints-overlay`       | 1                                      |
| `itinerary-body`          | 4                                      |
| `park-and-ride-overlay`   | 1                                      |
| `route-viewer-overlay`    | 1                                      |
| `stop-viewer-overlay`     | 1                                      |
| `stops-overlay`           | 4                                      |
| `transit-vehicle-overlay` | 2                                      |
| `transitive-overlay`      | 2                                      |
| `trip-viewer-overlay`     | 1                                      |
| `types`                   | 3                                      |
| `vehicle-rental-overlay`  | 1                                      |
| `zoom-based-markers`      | 1                                      |

## Internationalization

OTP-UI uses `react-intl` from the [`formatjs`](https://github.com/formatjs/formatjs) library for internationalization.
Both `react-intl` and `formatjs` take advantage of native internationalization features provided by web browsers.

Language-specific content is located in YML files under the `i18n` folder of packages that have internationalizable content
(e.g. `en-US.yml` for American English, `fr.yml` for generic French, etc.).

Note: Do not add comments to these YML files! Comments are removed by `yaml-sort` during pre-commit.
Instead, comments for other developers should be placed in the corresponding js/jsx/ts/tsx file.
Comments for translators should be entered into Weblate (see [Contributing Translations](#contributing-translations))

To use the YML files in your react-intl application:

- Merge the content of this file into the messages object that has your other localized strings,
- Flatten the ids, i.e. convert a structure such as
  ```
    otpUi > ItineraryBody > travelByMode > bike
  ```
  into
  ```
    otpUi.ItineraryBody.travelByMode.bike
  ```
- Pass the resulting object to the messages prop of `IntlProvider`.
  See `packages/from-to-location-picker/src/index.story.tsx` for an example of how to initialize localized messages with `IntlProvider`.

### Using internationalized content in the code

Access the internationalized content in code, typically using either

```jsx
import { FormattedMessage } from "react-intl";
...
<FormattedMessage id="..." />
```

or, if you need a `string`,

```js
// Obtain `intl` using `injectIntl` or `useIntl`.
intl.formatMessage({ id: ... })
```

where the id passed to `FormattedMessage` and `intl.formatMessage` can be literal or a computed value.
See [Internationalization checks and reporting](#internationalization-checks-and-reporting) for caveats.

### Internationalization checks and reporting

Code and translation integrity is checked by scripts that you can run locally.
`check:i18n-all` checks for all languages. `check:i18n-en-fr` checks for English (US) and French and is run on GitHub after each push.

These scripts check the following:

- All entries in the applicable translation files are used in the code.
- All message ids used in the code have translations.

For the scripts to work best, you should use **literal** ids as much as possible with `<FormattedMessage>` or `intl.formatMessage`.
This is because the scripts use the `formatJS` CLI, and the `formatJS` CLI simply ignores message ids that are not literals.

### Exceptions to checks

Exceptions to the checks above can be defined when:

- Reusing a message defined in another package,
- A message id needs to be computed, with some portion of it coming from a parameter,
  and implementing a `switch` case does not provide substantial benefits.

Exceptions are defined in optional files named `i18n-exceptions.json`. See the [scripts package README](./packages/scripts/README.md#exceptions) for setting these files up.

### Contributing translations

OTP-UI now uses [Hosted Weblate](https://www.weblate.org) to manage translations!

<figure>
  <a href="https://hosted.weblate.org/engage/otp-react-redux/">
    <img src="https://hosted.weblate.org/widgets/otp-react-redux/-/horizontal-auto.svg" alt="Translation status" />
  </a>
  <figcaption>Translation status for
    <a href="https://hosted.weblate.org/engage/otp-react-redux/">OTP-react-redux and OTP-UI on Hosted Weblate</a>
  </figcaption>
</figure>

Translations from the community are welcome and very much appreciated,
please see instructions at https://hosted.weblate.org/projects/otp-react-redux/.
Community input from Weblate will appear as pull requests with changes to files in the applicable `i18n` folders for our review.
(Contributions may be edited or rejected to remain in line with long-term project goals.)

If changes to a specific language file is needed but not enabled in Weblate, please open an issue or a pull request with the changes needed.
