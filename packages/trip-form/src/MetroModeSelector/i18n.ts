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
        id: `otpUi.ModeSelector.labels.TRANSIT`,
        description: `Metro Mode Selector Label (TRANSIT)`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.TRANSIT`]
      });
    case "WALK":
      return intl.formatMessage({
        id: `otpUi.ModeSelector.labels.WALK`,
        description: `Metro Mode Selector Label (WALK)`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.WALK`]
      });
    case "BICYCLE":
      return intl.formatMessage({
        id: `otpUi.ModeSelector.labels.BICYCLE`,
        description: `Metro Mode Selector Label (BICYCLE)`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.BICYCLE`]
      });
    case "CAR":
      return intl.formatMessage({
        id: `otpUi.ModeSelector.labels.CAR`,
        description: `Metro Mode Selector Label (CAR)`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.CAR`]
      });
    case "RENT":
      return intl.formatMessage({
        id: `otpUi.ModeSelector.labels.RENT`,
        description: `Metro Mode Selector Label (RENT)`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.RENT`]
      });
    // Default case adds support for custom mode buttons
    default:
      return intl.formatMessage({
        id: `otpUi.ModeSelector.labels.${key}`,
        description: `Metro Mode Selector Label (${key})`,
        defaultMessage: defaultMessages[`otpUi.ModeSelector.labels.${key}`]
      });
  }
}
