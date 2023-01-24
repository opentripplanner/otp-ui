import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { flatten } from "flat";
import { FareTableText } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

/**
 * Format text bold (used with FormattedMessage).
 */
export function boldText(contents: ReactElement): ReactElement {
  return <strong>{contents}</strong>;
}

/**
 * Render formatted fare.
 * @param currencyCode The ISO currency code to use (USD, GBP, EUR).
 * @param fare The fare value, in currency units, to be shown.
 * @returns The formatted fare value according to the selected locale.
 */
export function renderFare(currencyCode: string, fare: number): ReactElement {
  return (
    <FormattedNumber
      currency={currencyCode}
      // For dollars in locales such as 'fr',
      // this will limit the display to just the dollar sign
      // (otherwise it will render e.g. '2,50 $US' instead of '2,50 $').
      currencyDisplay="narrowSymbol"
      value={fare}
      // eslint-disable-next-line react/style-prop-object
      style="currency"
    />
  );
}

export const getFormattedTextForConfigKey = (textKey: FareTableText) => {
  switch (textKey) {
    case FareTableText.cash:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.cash"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.cash"
        />
      );
    case FareTableText.electronic:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.electronic"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.electronic"
        />
      );
    case FareTableText.youth:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.youth"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.youth"
        />
      );
    case FareTableText.senior:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.senior"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.senior"
        />
      );
    case FareTableText.special:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.special"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.special"
        />
      );
    case FareTableText.regular:
    default:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TripDetails.fareDetailsHeaders.regular"]
          }
          id="otpUi.TripDetails.fareDetailsHeaders.regular"
        />
      );
  }
};
