import { setupWorker } from "msw";
import { withReactIntl } from "storybook-react-intl/dist/cjs/withReactIntl";

import locationFieldHandlers from "../packages/location-field/src/mocks/handlers";
import itineraryBodyHandlers from "../packages/itinerary-body/src/__mocks__/handlers";
import geocoderHandlers from "../packages/geocoder/src/test-fixtures/handlers";

import { reactIntl } from './react-intl.js';

// Only install worker when running in browser
if (typeof global.process === "undefined") {
  const worker = setupWorker(
    ...locationFieldHandlers,
    ...itineraryBodyHandlers,
    ...geocoderHandlers
  );
  worker.start({ onUnhandledRequest: "bypass" });
}

export const parameters = {
  a11y: {
    config: {
      rules: [
        {
          //  moved to technical backlog
          id: "aria-required-parent",
          reviewOnFail: true,
        },
        {
          // Appears to be a bug with our stories (they do some weird hacks that are not done in production)
          id: "duplicate-id",
          reviewOnFail: true
        },
        {
          // Appears to be a bug with our stories (they do some weird hacks that are not done in production)
          id: "duplicate-id-active",
          reviewOnFail: true
        },
        {
          // Appears to be a bug with our stories (they do some weird hacks that are not done in production)
          id: "duplicate-id-aria",
          reviewOnFail: true
        },
        {
          // Not really applicable to stories and causes problems with the WithMap decorator
          id: "landmark-unique", 
          enabled: false
        }
      ],
    },
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  locale: reactIntl.defaultLocale,
  locales: {
    "en-US": { title: "English (US)" },
    fr: { title: "Français" },
    es: { title: "Español" },
    vi: { title: "Tiếng Việt" },
    ko: { title: "한국어" },
    zh: { title: "中文" },
    unknown: { title: "Unsupported locale" }
  },
  reactIntl
};

// Per https://www.npmjs.com/package/@storybook/addon-storyshots,
// explicitly export the storybook-react-intl decorator
// so it is included in jest snapshots.
export const decorators = [withReactIntl];
