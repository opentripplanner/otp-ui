import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import flatten from "flat";
import coreUtils from "@opentripplanner/core-utils";
import { FareProductSelector, Itinerary } from "@opentripplanner/types";
import { MoneyBillAlt } from "@styled-icons/fa-solid";
import * as S from "../styled";
import { boldText, renderFare } from "../utils";
import TripDetail from "../trip-detail";
import { FareConfig, FareDetailsProps } from "../types";
import FareLegTable from "./fare-table";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

export interface FaresProps {
  itinerary: Itinerary;
  FareDetails?: React.ElementType<FareDetailsProps>;
  fareConfig?: FareConfig;
}

export default function Fares({
  itinerary,
  FareDetails,
  fareConfig = {}
}: FaresProps): ReactElement | null {
  const fareResult = coreUtils.itinerary.calculateTncFares(itinerary);
  const { currencyCode, maxTNCFare, minTNCFare } = fareResult;

  const { defaultFareType, fareDetailsLayout, fareKeyNameMap } = fareConfig;

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

  return (
    <>
      {!!fare && (
        <TripDetail
          className="fares"
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
      {!!tncFare && (
        <TripDetail
          className="tnc-fare"
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
    </>
  );
}
