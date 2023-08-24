import coreUtils from "@opentripplanner/core-utils";
import { FareProductSelector } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";
import { Leaf } from "@styled-icons/fa-solid/Leaf";
import { Route } from "@styled-icons/fa-solid/Route";
import { flatten } from "flat";
import * as S from "./styled";
import TripDetail from "./trip-detail";
import FareLegTable from "./fare-table";
import { boldText, renderFare } from "./utils";

import { TimeActiveDetailsProps, TripDetailsProps } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

function CO2DescriptionLink(contents: ReactElement): ReactElement {
  return (
    <a
      href="https://www.itf-oecd.org/sites/default/files/life-cycle-assessment-calculations-2020.xlsx"
      rel="noopener noreferrer"
      target="_blank"
    >
      {contents}
    </a>
  );
}
/**
 * Default rendering if no component is provided for the TimeActiveDetails
 * slot in the TripDetails component.
 */
function DefaultTimeActiveDetails({
  bikeMinutes,
  walkMinutes
}: TimeActiveDetailsProps): ReactElement {
  return (
    <FormattedMessage
      defaultMessage={
        defaultMessages["otpUi.TripDetails.timeActiveDescription"]
      }
      description="Text describing the walking and biking durations of a trip."
      id="otpUi.TripDetails.timeActiveDescription"
      values={{
        bikeMinutes,
        strong: boldText,
        walkMinutes
      }}
    />
  );
}

/**
 * Renders trip details such as departure instructions, fare amount, and minutes active.
 */
export function TripDetails({
  className = "",
  co2Config,
  defaultFareType,
  DepartureDetails = null,
  displayTimeActive = true,
  FareDetails = null,
  fareDetailsLayout,
  fareKeyNameMap = {},
  itinerary,
  TimeActiveDetails = DefaultTimeActiveDetails
}: TripDetailsProps): ReactElement {
  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateTncFares(itinerary);
  const { currencyCode, maxTNCFare, minTNCFare } = fareResult;

  const { companies, fareTypes } = itinerary.legs.reduce<{
    companies: string;
    fareTypes: FareProductSelector[];
  }>(
    (prev, leg) => {
      if (leg.rideHailingEstimate) {
        prev.companies = leg.rideHailingEstimate.provider.id;
      }

      if (leg.fareProducts) {
        leg.fareProducts.forEach(fp => {
          const mediumId = fp.product.medium?.id;
          const riderCategoryId = fp.product.riderCategory?.id;
          if (
            !prev.fareTypes.find(
              ft =>
                ft.mediumId === mediumId &&
                ft.riderCategoryId === riderCategoryId
            )
          ) {
            prev.fareTypes.push({ mediumId, riderCategoryId });
          }
        });
      }
      return prev;
    },
    { companies: "", fareTypes: [] }
  );

  let fare;
  if (fareTypes.length > 0 && defaultFareType) {
    const defaultFareTotal = coreUtils.itinerary.getItineraryCost(
      itinerary.legs,
      defaultFareType.mediumId,
      defaultFareType.riderCategoryId
    );
    // Depending on if there are additional fares to display either render a <span> or a <details>
    const TransitFareWrapper =
      fareTypes.length > 1 ? S.TransitFare : S.TransitFareSingle;

    const fareNameFallback = (
      <FormattedMessage
        defaultMessage={defaultMessages["otpUi.TripDetails.transitFare"]}
        description="Text showing the price of tickets on public transportation."
        id="otpUi.TripDetails.transitFare"
      />
    );

    fare = defaultFareTotal?.amount && (
      <S.Fare>
        <TransitFareWrapper>
          <summary style={{ display: fareTypes.length > 1 ? "list-item" : "" }}>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.TripDetails.transitFareEntry"]
              }
              description="Text showing the price of tickets on public transportation."
              id="otpUi.TripDetails.transitFareEntry"
              values={{
                name:
                  fareKeyNameMap[defaultFareType.headerKey] || fareNameFallback,
                strong: boldText,
                value: renderFare(
                  defaultFareTotal.currency?.code || "USD",
                  defaultFareTotal?.amount
                )
              }}
            />
          </summary>
          {fareDetailsLayout ? (
            // Show full ƒare details by leg
            <FareLegTable layout={fareDetailsLayout} legs={itinerary.legs} />
          ) : (
            // Just show the fares for each payment type
            fareTypes.map(fareType => {
              // Don't show the default fare twice!
              if (fareType) {
                return null;
              }
              return (
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.TripDetails.transitFareEntry"]
                  }
                  description="Text showing the price of tickets on public transportation."
                  id="otpUi.TripDetails.transitFareEntry"
                  key={Object.values(fareType).join("-")}
                  values={{
                    name:
                      fareKeyNameMap[defaultFareType.headerKey] ||
                      fareNameFallback,
                    strong: boldText,
                    value: renderFare(
                      defaultFareTotal.currency?.code || "USD",
                      defaultFareTotal?.amount /
                        defaultFareTotal?.currency?.digits
                    )
                  }}
                />
              );
            })
          )}
        </TransitFareWrapper>
      </S.Fare>
    );
  }
  const tncFare = minTNCFare !== 0 && (
    <S.Fare>
      <S.TNCFare>
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.tncFare"]}
          description="Text showing the price paid to transportation network companies."
          id="otpUi.TripDetails.tncFare"
          values={{
            companies: (
              // S.TNCFareCompanies capitalizes the TNC company ID (e.g. "COMPANY")
              // after it is converted to lowercase, so it renders as "Company".
              <S.TNCFareCompanies>{companies.toLowerCase()}</S.TNCFareCompanies>
            ),
            maxTNCFare: renderFare(currencyCode, maxTNCFare),
            minTNCFare: renderFare(currencyCode, minTNCFare),
            strong: boldText
          }}
        />
      </S.TNCFare>
    </S.Fare>
  );

  const departureDate = new Date(itinerary.startTime);

  // Compute total time spent active.

  // TODO: separate into two reducers
  let walkDurationSeconds = 0;
  let bikeDurationSeconds = 0;
  itinerary.legs.forEach(leg => {
    if (leg.mode.startsWith("WALK")) walkDurationSeconds += leg.duration;
    if (leg.mode.startsWith("BICYCLE")) bikeDurationSeconds += leg.duration;
  });
  const bikeMinutes = Math.round(bikeDurationSeconds / 60);
  const walkMinutes = Math.round(walkDurationSeconds / 60);
  const minutesActive = bikeMinutes + walkMinutes;

  // Calculate CO₂ if it's not provided by the itinerary
  const co2 =
    itinerary.co2 ||
    (co2Config?.enabled &&
      coreUtils.itinerary.calculateEmissions(
        itinerary,
        co2Config?.carbonIntensity,
        co2Config?.units
      ));

  // Parse flex info and generate appropriate strings
  const containsFlex = itinerary.legs.some(coreUtils.itinerary.isFlex);
  const pickupBookingInfo = itinerary.legs
    .map(leg => leg.pickupBookingInfo)
    .filter(info => !!info);
  const dropOffBookingInfo = itinerary.legs
    .map(leg => leg.dropOffBookingInfo)
    .filter(info => !!info);
  const totalDistance = itinerary.legs.reduce(
    (total, leg) => total + leg.distance,
    0
  );

  return (
    <S.TripDetails className={className}>
      {/* this can be presentation as S.TripDetails is already labeled by this */}
      <S.TripDetailsHeader id="trip-details-header">
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
        {!!fare && (
          <TripDetail
            // Any custom description for the transit fare needs to be handled by the slot.
            description={
              FareDetails && (
                <FareDetails
                  legs={itinerary.legs}
                  maxTNCFare={maxTNCFare}
                  minTNCFare={minTNCFare}
                />
              )
            }
            icon={<MoneyBillAlt size={17} />}
            summary={fare}
          />
        )}
        {tncFare && (
          <TripDetail
            // Any custom description for the transit fare needs to be handled by the slot.
            description={
              FareDetails && (
                <FareDetails
                  legs={itinerary.legs}
                  maxTNCFare={maxTNCFare}
                  minTNCFare={minTNCFare}
                />
              )
            }
            icon={<MoneyBillAlt size={17} />}
            summary={tncFare}
          />
        )}
        {displayTimeActive && minutesActive > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.TripDetails.minutesActive"]
                }
                description="Text showing the number of minutes spent walking or biking throughout trip."
                id="otpUi.TripDetails.minutesActive"
                values={{
                  minutes: minutesActive,
                  strong: boldText
                }}
              />
            }
            description={
              TimeActiveDetails && (
                <TimeActiveDetails
                  bikeMinutes={bikeMinutes}
                  walkMinutes={walkMinutes}
                />
              )
            }
          />
        )}
        {co2 > 0 && co2Config?.enabled && (
          <TripDetail
            icon={<Leaf size={17} />}
            summary={
              <S.CO2Summary>
                <FormattedMessage
                  defaultMessage={defaultMessages["otpUi.TripDetails.co2"]}
                  description="Text showing the quantity of CO₂ emitted by this trip."
                  id="otpUi.TripDetails.co2"
                  values={{
                    co2: (
                      <FormattedNumber
                        value={Math.round(co2)}
                        // eslint-disable-next-line react/style-prop-object
                        style="unit"
                        unit={co2Config?.units || "gram"}
                        unitDisplay="narrow"
                      />
                    ),
                    strong: boldText
                  }}
                />
              </S.CO2Summary>
            }
            description={
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.TripDetails.co2description"]
                }
                description="Text explaining how the CO₂ emissions are calculated."
                id="otpUi.TripDetails.co2description"
                values={{
                  link: CO2DescriptionLink,
                  totalDistance
                }}
              />
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

// Rename styled components for export.
export { S as Styled, FareLegTable };
