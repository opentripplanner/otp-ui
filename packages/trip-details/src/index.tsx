import flatten from "flat";
// @ts-expect-error FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import * as Styled from "./styled";
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
function BoldText(contents: ReactElement): ReactElement {
  return <b>{contents}</b>;
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
        b: BoldText,
        bikeMinutes: Math.round(bikeSeconds / 60),
        calories: Math.round(calories),
        dietaryLink,
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
  let companies = "";
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });

  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateFares(itinerary);
  const { currencyCode, maxTNCFare, minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.transitFare"]}
              description="Text showing the price of tickets on public transportation."
              id="otpUi.TripDetails.transitFare"
              values={{
                b: BoldText,
                transitFare: (
                  <FormattedNumber
                    currency={currencyCode}
                    // For dollars in locales such as 'fr',
                    // this will limit the display to just the dollar sign
                    // (otherwise it will render e.g. '2,50 $US' instead of '2,50 $').
                    currencyDisplay="narrowSymbol"
                    value={transitFare / 100}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                  />
                )
              }}
            />
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.tncFare"]}
              description="Text showing the price paid to transportation network companies."
              id="otpUi.TripDetails.tncFare"
              values={{
                b: BoldText,
                companies: (
                  <Styled.TNCFareCompanies>
                    {companies.toLowerCase()}
                  </Styled.TNCFareCompanies>
                ),
                maxTNCFare: (
                  <FormattedNumber
                    currency={currencyCode}
                    currencyDisplay="narrowSymbol"
                    value={maxTNCFare}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                  />
                ),
                minTNCFare: (
                  <FormattedNumber
                    currency={currencyCode}
                    currencyDisplay="narrowSymbol"
                    value={minTNCFare}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                  />
                )
              }}
            />
          </Styled.TNCFare>
        )}
      </Styled.Fare>
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
    <Styled.TripDetails className={className}>
      <Styled.TripDetailsHeader>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.title"]}
          description="Title (heading) text of the component."
          id="otpUi.TripDetails.title"
        />
      </Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          // Any custom description for the Departure message needs to be handled by the slot.
          description={
            DepartureDetails && (
              <DepartureDetails departureDate={departureDate} />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <FormattedMessage
                defaultMessage={defaultMessages["otpUi.TripDetails.departure"]}
                description="Text showing the departure date/time for a trip."
                id="otpUi.TripDetails.departure"
                values={{
                  b: BoldText,
                  departureDate
                }}
              />
            </Styled.Timing>
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
              <Styled.CaloriesSummary>
                <FormattedMessage
                  defaultMessage={defaultMessages["otpUi.TripDetails.calories"]}
                  description="Text showing the number of calories for the walking and biking legs of a trip."
                  id="otpUi.TripDetails.calories"
                  values={{
                    b: BoldText,
                    calories: caloriesBurned
                  }}
                />
              </Styled.CaloriesSummary>
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
      </Styled.TripDetailsBody>
    </Styled.TripDetails>
  );
}

export default TripDetails;
