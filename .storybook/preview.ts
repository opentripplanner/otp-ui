import { setupWorker } from "msw";

import locationFieldHandlers from "../packages/location-field/src/mocks/handlers";
import itineraryBodyHandlers from "../packages/itinerary-body/src/__mocks__/handlers";
import geocoderHandlers from "../packages/geocoder/src/test-fixtures/handlers";
import tileLayerHandlers from '../packages/otp2-tile-overlay/src/mocks/handlers'

import { reactIntl } from './react-intl.ts';
import { Preview } from "@storybook/react";
import { mockDateDecorator } from "storybook-mock-date-decorator";

// Only install worker when running in browser
if (typeof global.process === "undefined") {
  const worker = setupWorker(
    ...locationFieldHandlers,
    ...itineraryBodyHandlers,
    ...geocoderHandlers,
    ...tileLayerHandlers
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
          // Appears to be a story bug
          id: "duplicate-id",
          reviewOnFail: true
        },
        {
          // Appears to be a story bug
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
  reactIntl
};

const preview: Preview = {
  decorators: [mockDateDecorator],
  globals: {
    locale: reactIntl.defaultLocale,
    locales: {
      "en-US": { title: "English (US)" },
      fr: { title: "Français" },
      es: { title: "Español" },
      vi: { title: "Tiếng Việt" },
      ko: { title: "한국어" },
      zh: { title: "中文" },
      unknown: { title: "Unsupported locale" }
    }
  },
  parameters
}

export default preview