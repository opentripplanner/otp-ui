import { setupWorker } from "msw/browser";

import locationFieldHandlers from "../packages/location-field/src/mocks/handlers";
import itineraryBodyHandlers from "../packages/itinerary-body/src/__mocks__/handlers";
import geocoderHandlers from "../packages/geocoder/src/test-fixtures/handlers";
import tileLayerHandlers from '../packages/otp2-tile-overlay/src/mocks/handlers'
import baseMapHandlers from '../packages/base-map/src/mocks/handlers';
import parameters from './previewParameters'

import { reactIntl } from './react-intl.ts';
import { Preview } from "@storybook/react";
import { mockDateDecorator } from "storybook-mock-date-decorator";

// Only install worker when running in browser
if (typeof global.process === "undefined") {
  const worker = setupWorker(
    ...locationFieldHandlers,
    ...itineraryBodyHandlers,
    ...geocoderHandlers,
    ...tileLayerHandlers,
    ...baseMapHandlers
  );
  worker.start({ onUnhandledRequest: "bypass" });
}

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