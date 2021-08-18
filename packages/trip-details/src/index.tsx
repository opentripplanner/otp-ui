import flatten from "flat";
import { MessageDescriptor } from "@formatjs/intl";
// @ts-expect-error FIXME: Create TypeScript types for core-utils packages.
import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import React, { ReactElement } from "react";
import { defineMessages, FormattedMessage, FormattedNumber } from "react-intl";
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
 * Construct full formatjs message definitions and pass them to defineMessages.
 */
// TODO: Find a better place for this utility.
function expandAndDefineMessages(
  prefix: string,
  entries: Record<string, string>
): Record<string, MessageDescriptor> {
  const messages: Record<string, MessageDescriptor> = {};
  Object.keys(entries).forEach((key: string) => {
    const id = `${prefix}.${key}`;
    messages[key] = {
      defaultMessage: defaultMessages[id],
      description: entries[key],
      id
    };
  });
  return defineMessages(messages);
}

// Internationalization messages definition. This is used for tooling purposes.
// Message descriptions and default messages are included so they can be captured
// with react-intl CLI and documentation.
// See https://formatjs.io/docs/react-intl/api#definemessagesdefinemessage
const messages = expandAndDefineMessages("otpUi.TripDetails", {
  calories:
    "Text showing the number of calories for the walking and biking legs of a trip.",
  caloriesDescription:
    "Text describing how the calories relate to the walking and biking duration of a trip.",
  departure: "Text showing the departure date/time for a trip.",
  title: "Title (heading) text of the component.",
  tncFare: "Text showing the price paid to transportation network companies.",
  transitFare: "Text showing the price paid for public transit tickets."
});

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
      defaultMessage={messages.caloriesDescription.defaultMessage}
      id={messages.caloriesDescription.id}
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
  currency = "USD",
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
  const { maxTNCFare, minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            <FormattedMessage
              defaultMessage={messages.transitFare.defaultMessage}
              id={messages.transitFare.id}
              values={{
                b: BoldText,
                transitFare: (
                  <FormattedNumber
                    currency={currency}
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
              defaultMessage={messages.tncFare.defaultMessage}
              id={messages.tncFare.id}
              values={{
                b: BoldText,
                companies: (
                  <Styled.TNCFareCompanies>
                    {companies.toLowerCase()}
                  </Styled.TNCFareCompanies>
                ),
                maxTNCFare: (
                  <FormattedNumber
                    currency={currency}
                    value={maxTNCFare}
                    // eslint-disable-next-line react/style-prop-object
                    style="currency"
                  />
                ),
                minTNCFare: (
                  <FormattedNumber
                    currency={currency}
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
          defaultMessage={messages.title.defaultMessage}
          id={messages.title.id}
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
                defaultMessage={messages.departure.defaultMessage}
                id={messages.departure.id}
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
                  defaultMessage={messages.calories.defaultMessage}
                  id={messages.calories.id}
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
