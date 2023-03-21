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
 yarn dev # (installs packages, transpiles files, opens storybook to running component library on localhost:5555)
```

## Development

Some packages in otp-ui depend on sibling packages (e.g., `@opentripplanner/core-utils` is used by many of its siblings). In order to test a package with local changes you have made to its sibling, you can run the following find/replace operations to make sure you're depending on your latest work (and not the released version):

1. In the `package.json` files for packages in which you want to test the sibling, find and replace (package-to-test being the package with local changes -- make sure these are committed to first to avoid the find/replace operations below polluting your work):

   > "@opentripplanner/package-to-test": **"current-version"**

   with

   > "@opentripplanner/package-to-test": **"file:../package-to-test"**

2. Run:
   `yarn && yarn dev`

### Storyshot testing

This repo utilizes the [Storyshot](https://storybook.js.org/docs/react/workflows/snapshot-testing) Storybook addon to perform snapshot tests of every story in this monorepo. Whenever the script `yarn unit` is ran, the Storyshot addon will be included along with all the other tests. It will compare the initial output of every story to the saved snapshot of that story. This provides a quick way to make sure nothing drastic has changed and that every single story is able to initially render without an error. Storyshot doesn't snapshot all possible changes that can be done while interacting with story components. Often times these snapshots will need to be updated and that can be accomplished by running `yarn unit -u`.

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

### Using internationalizable content in the code

Use message id **literals** (no variables or other dynamic content) with either

```jsx
<FormattedMessage id="..." />
```

or

```js
intl.formatMessage({ id: ... })
```

The reason for passing **literals** to `FormattedMessage` and `intl.formatMessage` is that we have a checker script `yarn check:i18n` that is based on the `formatJS` CLI and that detects unused messages in the code and exports translation tables.
Passing variables or dynamic content will cause the `formatJS` CLI and the checker to ignore the corresponding messages and
incorrectly claim that a string is unused or missing from a translation file.

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
