import flatten from "flat";

/** Locales supported in the storybook "Globe" dropdown menu. */
const locales = ["en-US", "fr"];

/** List of packages that will have localization support in Storybook. */ 
const packages = [
  "location-field"
];

/** Messages for all packages AND locales above. */
const messages = packages.reduce((allMessages, pkg) => ({
  ...allMessages,
  ...locales.reduce((packageMessages, locale) => ({
    ...packageMessages,
    [locale]: flatten(require(`../packages/${pkg}/i18n/${locale}.yml`))
  }), {})
}), {})

// TODO place any (date, time, etc) format parameters here.
const formats = {};

export const reactIntl = {
  defaultLocale: "en-US",
  formats,
  locales,
  messages
};
