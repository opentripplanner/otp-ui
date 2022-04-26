import flatten from "flat";

/**
 * Copied from https://stackoverflow.com/questions/50940640/how-to-determine-if-jest-is-running-the-code-or-not
 */
export function isRunningJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

/** Locales supported in the storybook "Globe" dropdown menu. */
const locales = ["en-US", "fr", "unknown"];

/** List of packages that will have localization support in Storybook. */ 
const packages = [
  "from-to-location-picker",
  "itinerary-body",
  "location-field",
  "printable-itinerary",
  "trip-details",
  "trip-form"
];

/** Messages for all packages AND locales above. */
const messages = {};

if (!isRunningJest()) {
  // Populate messages if not running snapshots.
  // (Message printouts would be unnecessary replicated in snapshots without that check.)
  packages.forEach((pkg) => {
    locales.forEach((locale) => {
      try {
        messages[locale] = {
          ...messages[locale],
          ...flatten(require(`../packages/${pkg}/i18n/${locale}.yml`))
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
  messages
};
