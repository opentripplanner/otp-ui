import flatten from "flat";

/** Locales supported in the storybook "Globe" dropdown menu. */
const locales = ["en-US", "fr", "unknown"];

/** List of packages that will have localization support in Storybook. */ 
const packages = [
  "location-field",
  "trip-details"
];

/** Messages for all packages AND locales above. */
const messages = {};
packages.forEach((pkg) => {
  locales.forEach((locale) => {
    try {
      messages[locale] = {
        ...messages.[locale],
        ...flatten(require(`../packages/${pkg}/i18n/${locale}.yml`))
      };
    } catch (e) {
      // There is no yml files for the "unknown" locale,
      // so it should fail and we won't display a message for that case.
      if (locale !== "unknown") console.error(e);
    }    
  });
});

// TODO place any (date, time, etc) format parameters here.
const formats = {};

export const reactIntl = {
  defaultLocale: "en-US",
  formats,
  locales,
  messages
};
