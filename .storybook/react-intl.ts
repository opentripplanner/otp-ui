import flatten from "flat";

export const isTestRunner = () => window.navigator.userAgent.match(/StorybookTestRunner/);

/** Locale supported in the storybook "Globe" dropdown menu. */
const locales = ["en-US", "fr", "es", "vi", "ko", "zh", "unknown"];

/**
 * List of packages that will have localization support in Storybook.
 * FIXME: remove in favor of a loop on package names.
 */ 
const packages = [
  "base-map",
  "endpoints-overlay",
  "from-to-location-picker",
  "itinerary-body",
  "location-field",
  "printable-itinerary",
  "map-popup",
  "transit-vehicle-overlay",
  "trip-details",
  "trip-form"
];

/** Messages for all packages AND locales above. */
const messages = {};

// Populate messages if not running snapshots.
// (Message printouts would be unnecessary replicated in snapshots without that check.)
if (typeof window !== "undefined") {

  packages.forEach((pkg) => {
    locales.forEach((locale) => {
      // Chinese-simplified is assigned a special file name by Weblate.
      const localeFile = locale === "zh" ? "zh_Hans" : locale;
      try {
        messages[locale] = {
          ...messages[locale],
          ...flatten(require(`../packages/${pkg}/i18n/${localeFile}.yml`).default)
        };
      } catch (e) {
        // There is no yml files for the "unknown" locale,
        // so it should fail, and we won't display an error message in that case.
        if (locale !== "unknown") console.error(e);
      }    
    });
  });
}

// TODO: place any applicable (date, time, etc) format parameters here.
const formats = {};

export const reactIntl = {
  defaultLocale: "en-US",
  formats,
  locales,
  messages,
  timeZone: 'America/Los_Angeles'
};
