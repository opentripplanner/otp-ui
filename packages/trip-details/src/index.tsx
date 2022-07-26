import flatten from "flat";
import coreUtils from "@opentripplanner/core-utils";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";
import { Route } from "@styled-icons/fa-solid/Route";

import * as S from "./styled";
import TripDetail from "./trip-detail";
import FareLegTable from "./fare-table";
import { boldText, renderFare } from "./utils";

import {
  CaloriesDetailsProps,
  TransitFareProps,
  TripDetailsProps
} from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

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
 * Helper component that renders a transit fare entry.
 */
const TransitFare = ({
  fareKey,
  fareNameFallback,
  fareKeyNameMap,
  transitFares
}: TransitFareProps): ReactElement => {
  const currentFare = transitFares[fareKey];

  return (
    <span>
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.TripDetails.transitFareEntry"]}
        description="Text showing the price of tickets on public transportation."
        id="otpUi.TripDetails.transitFareEntry"
        values={{
          name: fareKeyNameMap[fareKey] || fareNameFallback || fareKey,
          strong: boldText,
          value: renderFare(
            currentFare.currency.currencyCode,
            currentFare.cents / 100
          )
        }}
      />
    </span>
  );
};

/**
 * Renders trip details such as departure instructions, fare amount, and calories spent.
 */
export function TripDetails({
  CaloriesDetails = DefaultCaloriesDetails,
  className = "",
  defaultFareKey = "regular",
  DepartureDetails = null,
  FareDetails = null,
  fareDetailsLayout,
  fareKeyNameMap = {},
  itinerary
}: TripDetailsProps): ReactElement {
  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateTncFares(itinerary);
  const { maxTNCFare, minTNCFare, tncCurrencyCode } = fareResult;
  const transitFares = itinerary?.fare?.fare;
  const fareDetails = itinerary.fare?.details;

  let companies = "";
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });
  let fare;

  const fareKeys = transitFares && Object.keys(transitFares).sort();

  if (transitFares && fareKeys.length > 0) {
    let defaultFare = defaultFareKey;
    if (!transitFares[defaultFareKey]) {
      defaultFare = "regular";
    }

    // Depending on if there are additional fares to display either render a <span> or a <details>
    const TransitFareWrapper =
      transitFares && fareKeys.length > 1 ? S.TransitFare : S.TransitFareSingle;

    fare = (
      <S.Fare>
        <TransitFareWrapper>
          <summary
            role="button"
            style={{ display: fareKeys.length > 1 ? "list-item" : "" }}
          >
            <TransitFare
              fareNameFallback={
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.TripDetails.transitFare"]
                  }
                  description="Text showing the price of tickets on public transportation."
                  id="otpUi.TripDetails.transitFare"
                />
              }
              fareKey={defaultFare}
              fareKeyNameMap={fareKeyNameMap}
              transitFares={transitFares}
            />
          </summary>
          {fareDetailsLayout ? (
            // Show full ƒare details by leg
            <FareLegTable
              layout={fareDetailsLayout}
              legs={itinerary.legs}
              transitFareDetails={fareDetails}
              transitFares={transitFares}
            />
          ) : (
            // Just show the fares for each payment type
            fareKeys.map(fareKey => {
              // Don't show the default fare twice!
              if (fareKey === defaultFare) {
                return null;
              }
              return (
                <TransitFare
                  fareKey={fareKey}
                  key={fareKey}
                  fareKeyNameMap={fareKeyNameMap}
                  transitFares={transitFares}
                />
              );
            })
          )}
        </TransitFareWrapper>
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
                    {companies.toLowerCase()}
                  </S.TNCFareCompanies>
                ),
                maxTNCFare: renderFare(tncCurrencyCode, maxTNCFare),
                minTNCFare: renderFare(tncCurrencyCode, minTNCFare),
                strong: boldText
              }}
            />
          </S.TNCFare>
        )}
      </S.Fare>
    );
  }

  const departureDate = new Date(itinerary.startTime);

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  // Parse flex info and generate appropriate strings
  const containsFlex = itinerary.legs.some(coreUtils.itinerary.isFlex);
  const pickupBookingInfo = itinerary.legs
    .map(leg => leg.pickupBookingInfo)
    .filter(info => !!info);
  const dropOffBookingInfo = itinerary.legs
    .map(leg => leg.dropOffBookingInfo)
    .filter(info => !!info);

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
                  transitFares={transitFares}
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
        {containsFlex && (
          <TripDetail
            summary={
              <S.FlexSummary>
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.TripDetails.tripIncludesFlex"]
                  }
                  description="Text stating that portions of the trip include a flex (on-demand) transit service."
                  id="otpUi.TripDetails.tripIncludesFlex"
                  values={{
                    extraMessage: [
                      ...new Set([
                        ...pickupBookingInfo.map(info => info.message),
                        ...dropOffBookingInfo.map(info => info.message)
                      ])
                    ].join(" ")
                  }}
                />
              </S.FlexSummary>
            }
            icon={<Route size={17} />}
          />
        )}
      </S.TripDetailsBody>
    </S.TripDetails>
  );
}

export default TripDetails;

// Rename styled components for export
export { S as Styled };
