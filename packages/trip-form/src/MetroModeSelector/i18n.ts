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

function generateMainSettingLabel(key: string, intl: IntlShape): string {
  switch (key) {
    case "walkTolerance":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.walkTolerance-label"],
        description: `Metro Mode Selector Setting Label (Walk Tolerance)`,
        id: "otpUi.ModeSelector.settings.walkTolerance-label"
      });
    case "carTolerance":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.carTolerance-label"],
        description: `Metro Mode Selector Setting Label (Car Tolerance)`,
        id: "otpUi.ModeSelector.settings.carTolerance-label"
      });
    case "bikeTolerance":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.bikeTolerance-label"],
        description: `Metro Mode Selector Setting Label (Bike Tolerance)`,
        id: "otpUi.ModeSelector.settings.bikeTolerance-label"
      });
    case "wheelchair":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.wheelchair-label"],
        description: `Metro Mode Selector Setting Label (wheelchair)`,
        id: "otpUi.ModeSelector.settings.wheelchair-label"
      });
    case "addBus":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.addBus-label"],
        description: `Metro Mode Selector Setting Label (addBus)`,
        id: "otpUi.ModeSelector.settings.addBus-label"
      });
    case "addFerry":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.addFerry-label"],
        description: `Metro Mode Selector Setting Label (addFerry)`,
        id: "otpUi.ModeSelector.settings.addFerry-label"
      });
    case "addSubway":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.addSubway-label"],
        description: `Metro Mode Selector Setting Label (addSubway)`,
        id: "otpUi.ModeSelector.settings.addSubway-label"
      });
    case "addTram":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.addTram-label"],
        description: `Metro Mode Selector Setting Label (addTram)`,
        id: "otpUi.ModeSelector.settings.addTram-label"
      });
    case "addRail":
      return intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.ModeSelector.settings.addRail-label"],
        description: `Metro Mode Selector Setting Label (addRail)`,
        id: "otpUi.ModeSelector.settings.addRail-label"
      });
    default:
      return intl.formatMessage({
        defaultMessage:
          defaultMessages[`otpUi.ModeSelector.settings.${key}-label`],
        description: `Metro Mode Selector Setting Label (${key})`,
        id: `otpUi.ModeSelector.settings.${key}-label`
      });
  }
}

function generateSliderLabels(
  key: string,
  intl: IntlShape
): { labelLow: string; labelHigh: string } {
  switch (key) {
    case "bikeTolerance":
      return {
        labelLow: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.bikeTolerance-labelLow"
            ],
          description: `Metro Mode Selector Setting Slider Label Low (Bike Tolerance)`,
          id: "otpUi.ModeSelector.settings.bikeTolerance-labelLow"
        }),
        labelHigh: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.bikeTolerance-labelHigh"
            ],
          description: `Metro Mode Selector Setting Slider Label High (Bike Tolerance)`,
          id: "otpUi.ModeSelector.settings.bikeTolerance-labelHigh"
        })
      };
    case "carTolerance":
      return {
        labelLow: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.carTolerance-labelLow"
            ],
          description: `Metro Mode Selector Setting Slider Label Low (Car Tolerance)`,
          id: "otpUi.ModeSelector.settings.carTolerance-labelLow"
        }),
        labelHigh: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.carTolerance-labelHigh"
            ],
          description: `Metro Mode Selector Setting Slider Label High (Car Tolerance)`,
          id: "otpUi.ModeSelector.settings.carTolerance-labelHigh"
        })
      };
    case "walkTolerance":
      return {
        labelLow: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.walkTolerance-labelLow"
            ],
          description: `Metro Mode Selector Setting Slider Label Low (Walk Tolerance)`,
          id: "otpUi.ModeSelector.settings.walkTolerance-labelLow"
        }),
        labelHigh: intl.formatMessage({
          defaultMessage:
            defaultMessages[
              "otpUi.ModeSelector.settings.walkTolerance-labelHigh"
            ],
          description: `Metro Mode Selector Setting Slider Label High (Walk Tolerance)`,
          id: "otpUi.ModeSelector.settings.walkTolerance-labelHigh"
        })
      };
    default:
      return {
        labelLow: intl.formatMessage({
          defaultMessage:
            defaultMessages[`otpUi.ModeSelector.settings.${key}-labelLow`],
          description: `Metro Mode Selector Slider Label High (${key})`,
          id: `otpUi.ModeSelector.settings.${key}-labelLow`
        }),
        labelHigh: intl.formatMessage({
          defaultMessage:
            defaultMessages[`otpUi.ModeSelector.settings.${key}-labelHigh`],
          description: `Metro Mode Selector Slider Label Low (${key})`,
          id: `otpUi.ModeSelector.settings.${key}-labelHigh`
        })
      };
  }
}

export function generateModeSettingLabels(
  type: string,
  key: string,
  intl: IntlShape,
  defaultLabel: string
): { label: string; labelLow?: string; labelHigh?: string } {
  switch (type) {
    case "SLIDER":
      return {
        label: defaultLabel || generateMainSettingLabel(key, intl),
        ...generateSliderLabels(key, intl)
      };
    case "CHECKBOX":
    case "SUBMODE":
    case "DROPDOWN":
    default:
      return {
        label: defaultLabel || generateMainSettingLabel(key, intl)
      };
  }
}
