import { flatten } from "flat";
import { IntlShape } from "react-intl";

import defaultEnglishMessages from "../../i18n/en-US.yml";
// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

export default function generateModeButtonLabel(
  key: string,
  intl: IntlShape,
  defaultLabel?: string
): string {
  switch (key.toLocaleLowerCase()) {
    case "transit":
      return intl.formatMessage({
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.transit`],
        description: `Metro Mode Selector Label (transit)`,
        id: `otpUi.ModeSelector.labels.transit`
      });
    case "walk":
      return intl.formatMessage({
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.walk`],
        description: `Metro Mode Selector Label (walk)`,
        id: `otpUi.ModeSelector.labels.walk`
      });
    case "bicycle":
      return intl.formatMessage({
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.bicycle`],
        description: `Metro Mode Selector Label (bicycle)`,
        id: `otpUi.ModeSelector.labels.bicycle`
      });
    case "car":
      return intl.formatMessage({
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.car`],
        description: `Metro Mode Selector Label (car)`,
        id: `otpUi.ModeSelector.labels.car`
      });
    case "rent":
      return intl.formatMessage({
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.rent`],
        description: `Metro Mode Selector Label (rent)`,
        id: `otpUi.ModeSelector.labels.rent`
      });
    // Default case adds support for custom mode buttons
    default:
      return intl.formatMessage({
        defaultMessage:
          defaultLabel || defaultMessages[`otpUi.ModeSelector.labels.${key}`],
        description: `Metro Mode Selector Label (${key})`,
        id: `otpUi.ModeSelector.labels.${key}`
      });
  }
}
