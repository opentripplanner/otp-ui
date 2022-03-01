import flatten from "flat";

/** Locales supported in the storybook "Globe" dropdown menu. */
const locales = ["en-US", "fr", "unknown"];

/** List of packages that will have localization support in Storybook. */ 
const packages = [
  "location-field",
  "trip-details"
];

/** Messages for all packages AND locales above. */
const messages = packages.reduce((allMessages, pkg) => ({
  ...allMessages,
  ...locales.reduce((packageMessages, locale) => {
    try {
      return {
        ...packageMessages,
        [locale]: flatten(require(`../packages/${pkg}/i18n/${locale}.yml`))
      };
    } catch (e) {
      if (locale !== "unknown") console.error(e)
      return packageMessages;
    }
  }, {})
}), {})

// TODO place any (date, time, etc) format parameters here.
const formats = {};

export const reactIntl = {
  defaultLocale: "en-US",
  formats,
  locales,
  messages
};
