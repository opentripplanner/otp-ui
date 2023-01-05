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
  intl: IntlShape
): string {
  switch (key) {
    case "TRANSIT":
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.TRANSIT`,
        description: `Metro Mode Selector Label (TRANSIT)`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.TRANSIT`]
      });
    case "WALK":
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.WALK`,
        description: `Metro Mode Selector Label (WALK)`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.WALK`]
      });
    case "BICYCLE":
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.BICYCLE`,
        description: `Metro Mode Selector Label (BICYCLE)`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.BICYCLE`]
      });
    case "CAR":
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.CAR`,
        description: `Metro Mode Selector Label (CAR)`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.CAR`]
      });
    case "RENT":
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.RENT`,
        description: `Metro Mode Selector Label (RENT)`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.RENT`]
      });
    // Default case adds support for custom mode buttons
    default:
      return intl.formatMessage({
        id: `otpUi.modeSelector.labels.${key}`,
        description: `Metro Mode Selector Label (${key})`,
        defaultMessage: defaultMessages[`otpUi.modeSelector.labels.${key}`]
      });
  }
}
