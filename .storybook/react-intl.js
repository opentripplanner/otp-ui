import flatten from "flat";

const locales = ["en-US", "fr"];

const messages = locales.reduce((acc, lang) => ({
  ...acc,
  [lang]: flatten(require(`../packages/location-field/i18n/${lang}.yml`))
}), {});

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: "en-US",
  formats,
  locales,
  messages,
};
