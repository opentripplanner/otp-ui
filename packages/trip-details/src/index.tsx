import coreUtils from "@opentripplanner/core-utils";
import { FareProductSelector } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";
import { flatten } from "flat";
import * as S from "./styled";
import TripDetail from "./trip-detail";
import FareLegTable from "./components/fare-table";
import { boldText, renderFare } from "./utils";

import { TripDetailsProps } from "./types";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";
import FlexBookingInfo from "./components/flex-booking-info";
import Emissions from "./components/emissions";
import TimeActive, { DefaultTimeActiveDetails } from "./components/time-active";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

/**
 * Renders trip details such as departure instructions, fare amount, and minutes active.
 */
export function TripDetails({
  className = "",
  co2Config,
  defaultFareType,
  DepartureDetails = null,
  FareDetails = null,
  fareDetailsLayout,
  fareKeyNameMap = {},
  itinerary,
  showApproximateMinutesActive,
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

    fare = defaultFareTotal !== undefined && (
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
        <TimeActive
          itinerary={itinerary}
          TimeActiveDetails={TimeActiveDetails}
          showApproximateMinutesActive={showApproximateMinutesActive}
        />
        <FlexBookingInfo itinerary={itinerary} />
        <Emissions itinerary={itinerary} co2Config={co2Config} />
      </S.TripDetailsBody>
    </S.TripDetails>
  );
}

export default TripDetails;

// Rename styled components for export.
export { S as Styled, FareLegTable };
