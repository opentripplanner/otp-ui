import flatten from "flat";
// @ts-expect-error FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";

import * as S from "./styled";
import TripDetail from "./trip-detail";

import { CaloriesDetailsProps, TripDetailsProps } from "./types";

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
// TODO: Find a better place for this utility.
function boldText(contents: ReactElement): ReactElement {
  return <strong>{contents}</strong>;
}

/**
 * Render formatted fare.
 * @param currencyCode The ISO currency code to use (USD, GBP, EUR).
 * @param fare The fare value, in currency units, to be shown.
 * @returns The formatted fare value according to the selected locale.
 */
function renderFare(currencyCode: string, fare: number): ReactElement {
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

/**
 * Helper function to specify the link to dietary table.
 */
function dietaryLink(contents: ReactElement): ReactElement {
  return (
    <a
      href="https://health.gov/dietaryguidelines/dga2005/document/html/chapter3.htm#table4"
      rel="noopener noreferrer"
      target="_blank"
    >
      {contents}
    </a>
  );
}

/**
 * Default rendering if no component is provided for the CaloriesDetails
 * slot in the TripDetails component.
 */
function DefaultCaloriesDetails({
  bikeSeconds,
  calories,
  walkSeconds
}: CaloriesDetailsProps): ReactElement {
  return (
    <FormattedMessage
      defaultMessage={defaultMessages["otpUi.TripDetails.caloriesDescription"]}
      description="Text describing how the calories relate to the walking and biking duration of a trip."
      id="otpUi.TripDetails.caloriesDescription"
      values={{
        bikeMinutes: Math.round(bikeSeconds / 60),
        calories: Math.round(calories),
        dietaryLink,
        strong: boldText,
        walkMinutes: Math.round(walkSeconds / 60)
      }}
    />
  );
}

/**
 * Renders trip details such as departure instructions, fare amount, and calories spent.
 */
export function TripDetails({
  CaloriesDetails = DefaultCaloriesDetails,
  className = "",
  DepartureDetails = null,
  FareDetails = null,
  itinerary
}: TripDetailsProps): ReactElement {
  const firstTncLeg = itinerary.legs.find(leg => leg.tncData);
  const tncCompany = firstTncLeg ? firstTncLeg.tncData.company : "";

  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateFares(itinerary);
  const { currencyCode, maxTNCFare, minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <S.Fare>
        {transitFare && (
          <S.TransitFare>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.transitFare"]}
              description="Text showing the price of tickets on public transportation."
              id="otpUi.TripDetails.transitFare"
              values={{
                strong: boldText,
                transitFare: renderFare(currencyCode, transitFare / 100)
              }}
            />
          </S.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <S.TNCFare>
            <br />
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.tncFare"]}
              description="Text showing the price paid to transportation network companies."
              id="otpUi.TripDetails.tncFare"
              values={{
                companies: (
                  // S.TNCFareCompanies capitalizes the TNC company ID (e.g. "COMPANY")
                  // after it is converted to lowercase, so it renders as "Company".
                  <S.TNCFareCompanies>
                    {tncCompany.toLowerCase()}
                  </S.TNCFareCompanies>
                ),
                maxTNCFare: renderFare(currencyCode, maxTNCFare),
                minTNCFare: renderFare(currencyCode, minTNCFare),
                strong: boldText
              }}
            />
          </S.TNCFare>
        )}
      </S.Fare>
    );
  }

  const departureDate = moment(itinerary.startTime);

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return (
    <S.TripDetails className={className}>
      <S.TripDetailsHeader>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.title"]}
          description="Title (heading) text of the component."
          id="otpUi.TripDetails.title"
        />
      </S.TripDetailsHeader>
      <S.TripDetailsBody>
        <TripDetail
          // Any custom description for the Departure message needs to be handled by the slot.
          description={
            DepartureDetails && (
              <DepartureDetails departureDate={departureDate} />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <S.Timing>
              <FormattedMessage
                defaultMessage={defaultMessages["otpUi.TripDetails.departure"]}
                description="Text showing the departure date/time for a trip."
                id="otpUi.TripDetails.departure"
                values={{
                  departureDate,
                  strong: boldText
                }}
              />
            </S.Timing>
          }
        />
        {fare && (
          <TripDetail
            // Any custom description for the transit fare needs to be handled by the slot.
            description={
              FareDetails && (
                <FareDetails
                  maxTNCFare={maxTNCFare}
                  minTNCFare={minTNCFare}
                  transitFare={transitFare}
                />
              )
            }
            icon={<MoneyBillAlt size={17} />}
            summary={fare}
          />
        )}
        {caloriesBurned > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <S.CaloriesSummary>
                <FormattedMessage
                  defaultMessage={defaultMessages["otpUi.TripDetails.calories"]}
                  description="Text showing the number of calories for the walking and biking legs of a trip."
                  id="otpUi.TripDetails.calories"
                  values={{
                    calories: caloriesBurned,
                    strong: boldText
                  }}
                />
              </S.CaloriesSummary>
            }
            description={
              CaloriesDetails && (
                <CaloriesDetails
                  bikeSeconds={bikeDuration}
                  calories={caloriesBurned}
                  walkSeconds={walkDuration}
                />
              )
            }
          />
        )}
      </S.TripDetailsBody>
    </S.TripDetails>
  );
}

export default TripDetails;
