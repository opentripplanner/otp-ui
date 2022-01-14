import flatten from "flat";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import React from "react";
import { FormattedMessage, IntlShape } from "react-intl";

// eslint-disable-next-line prettier/prettier
import type { CustomQueryParameters } from "../types";

// Load the default messages.
import defaultEnglishMessages from "../../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: Record<string, string> = flatten(
  defaultEnglishMessages
);

const { hasTransit } = coreUtils.itinerary;
const METERS_PER_MILE = 1609;
const SECONDS_PER_HOUR = 3600;

/**
 * Gets a list of duration options.
 */
function getDurationOptions(intl, minuteOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return minuteOptions.map(minutes => ({
    text:
      minutes === 60
        ? intl.formatNumber(1, {
            style: "unit",
            unit: "hour",
            unitDisplay: "long"
          })
        : intl.formatNumber(minutes, {
            style: "unit",
            unit: "minute",
            unitDisplay: "long"
          }),
    value: minutes
  }));
}

/**
 * Gets a list of distance options in miles.
 */
function getDistanceOptionsInMiles(intl, mileOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return mileOptions.map(miles => ({
    text: intl.formatMessage(
      {
        defaultMessage: `${miles} miles`,
        description: "Displays a distance in miles",
        id: "otpUi.queryParameters.distanceInMiles"
      },
      {
        // 1 mile = 100 "centimiles". Pass that so that formatjs can pick up
        // English exceptions for 1/10 mile, 1/4 mile, etc.
        // (Decimal numbers don't work for the case selector.)
        centimiles: miles * 100,
        miles
      }
    ).trim(),
    value: miles * METERS_PER_MILE
  }));
}

/**
 * Gets a list of speed options in miles per hour.
 */
function getSpeedOptionsInMilesPerHour(intl, milesPerHourOptions) {
  // intl is needed because <FormattedMessage> can't be used inside <option>.
  return milesPerHourOptions.map(mph => ({
    text: intl.formatMessage(
      {
        defaultMessage: `${mph} mph`,
        description: "Displays a speed in miles per hour",
        id: "otpUi.queryParameters.speedInMilesPerHour"
      },
      {
        mph
      }
    ),
    value: Number(((mph * METERS_PER_MILE) / SECONDS_PER_HOUR).toFixed(2))
  }));
}

/**
 * Gets the bike trip optimization options.
 */
function getBikeTripOptions(intl, queryParams) {
  const opts = [
    {
      text: intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.queryParameters.optimizeBikeSpeed"],
        description: "Option label for speed",
        id: "otpUi.queryParameters.optimizeBikeSpeed"
      }),
      value: "QUICK"
    },
    {
      text: intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.queryParameters.optimizeBikeFriendly"],
        description: "Option label for bike-friendly trips",
        id: "otpUi.queryParameters.optimizeBikeFriendly"
      }),
      value: "SAFE"
    },
    {
      text: intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.queryParameters.optimizeBikeFlat"],
        description: "Option label for flat bike trips",
        id: "otpUi.queryParameters.optimizeBikeFlat"
      }),
      value: "FLAT"
    }
  ];

  // Include transit-specific option, if applicable
  if (hasTransit(queryParams.mode)) {
    opts.splice(1, 0, {
      text: intl.formatMessage({
        defaultMessage:
          defaultMessages["otpUi.queryParameters.optimizeTransfers"],
        description: "Option label for fewest transfers",
        id: "otpUi.queryParameters.optimizeTransfers"
      }),
      value: "TRANSFERS"
    });
  }

  return opts;
}

/**
 * Obtains a set of custom query parameters with localized labels and options.
 */
export function getQueryParamMessagesWithI18n(
  intl: IntlShape
): CustomQueryParameters {
  return {
    maxWalkDistance: {
      label: (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.queryParameters.maxWalkDistance"]
          }
          description="Max walk distance label"
          id="otpUi.queryParameters.maxWalkDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [0.1, 0.25, 0.5, 0.75, 1, 2, 5])
    },
    maxBikeDistance: {
      label: (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.queryParameters.maxBikeDistance"]
          }
          description="Max bike distance label"
          id="otpUi.queryParameters.maxBikeDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [
        0.25,
        0.5,
        0.75,
        1,
        2,
        3,
        5,
        10,
        20,
        30
      ])
    },
    optimize: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.optimizeFor"]}
          description="Optimize selector label"
          id="otpUi.queryParameters.optimizeFor"
        />
      ),
      options: [
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.queryParameters.optimizeQuick"],
            description: "Option label for quickest trips",
            id: "otpUi.queryParameters.optimizeQuick"
          }),
          value: "QUICK"
        },
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.queryParameters.optimizeTransfers"],
            description: "Option label for fewest transfers",
            id: "otpUi.queryParameters.optimizeTransfers"
          }),
          value: "TRANSFERS"
        }
      ]
    },
    optimizeBike: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.optimizeFor"]}
          description="Optimize selector label"
          id="otpUi.queryParameters.optimizeFor"
        />
      ),
      options: queryParams => getBikeTripOptions(intl, queryParams)
    },
    maxWalkTime: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxWalkTime"]}
          description="Max walk time label"
          id="otpUi.queryParameters.maxWalkTime"
        />
      ),
      options: getDurationOptions(intl, [5, 10, 15, 20, 30, 45, 60])
    },
    walkSpeed: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.walkSpeed"]}
          description="Max walk speed label"
          id="otpUi.queryParameters.walkSpeed"
        />
      ),
      options: getSpeedOptionsInMilesPerHour(intl, [2, 3, 4])
    },
    maxBikeTime: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.maxBikeTime"]}
          description="Max bike time label"
          id="otpUi.queryParameters.maxBikeTime"
        />
      ),
      options: getDurationOptions(intl, [5, 10, 15, 20, 30, 45, 60])
    },
    bikeSpeed: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.bikeSpeed"]}
          description="Bike speed selector label"
          id="otpUi.queryParameters.bikeSpeed"
        />
      ),
      options: getSpeedOptionsInMilesPerHour(intl, [6, 8, 10, 12])
    },
    maxEScooterDistance: {
      label: (
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.queryParameters.maxEScooterDistance"]
          }
          description="Max e-scooter distance label"
          id="otpUi.queryParameters.maxEScooterDistance"
        />
      ),
      options: getDistanceOptionsInMiles(intl, [
        0.25,
        0.5,
        0.75,
        1,
        2,
        3,
        5,
        10,
        20,
        30
      ])
    },
    watts: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.watts"]}
          description="E-scooter power label"
          id="otpUi.queryParameters.watts"
        />
      ),
      options: [
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.queryParameters.watts125kidsHoverboard"],
            description: "Label for a kid's e-scooter",
            id: "otpUi.queryParameters.watts125kidsHoverboard"
          }),
          value: 125
        },
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages[
                "otpUi.queryParameters.watts250entryLevelEscooter"
              ],
            description: "Label for an entry-level e-scooter",
            id: "otpUi.queryParameters.watts250entryLevelEscooter"
          }),
          value: 250
        },
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages["otpUi.queryParameters.watts500robustEscooter"],
            description: "Label for a robust e-scooter",
            id: "otpUi.queryParameters.watts500robustEscooter"
          }),
          value: 500
        },
        {
          text: intl.formatMessage({
            defaultMessage:
              defaultMessages[
                "otpUi.queryParameters.watts1500powerfulEscooter"
              ],
            description: "Label for a powerful e-scooter",
            id: "otpUi.queryParameters.watts1500powerfulEscooter"
          }),
          value: 1500
        }
      ]
    },
    wheelchair: {
      label: (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.queryParameters.wheelchair"]}
          description="Label for wheelchair option"
          id="otpUi.queryParameters.wheelchair"
        />
      )
    }
  };
}
