import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { flatten } from "flat";
import * as S from "./styled";
import { TripDetailsProps } from "./types";
import FlexBookingInfo from "./components/flex-booking-info";
import FaresV2Table from "./components/fares-v2-table";
import Emissions from "./components/emissions";
import Fares from "./components/fares";
import TimeActive, { DefaultTimeActiveDetails } from "./components/time-active";
import DepartureDate from "./components/departure-date";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

function cn(className: string, arg1: string): string {
  return className ? `${className} ${arg1}` : arg1;
}

/**
 * Renders trip details such as departure instructions, fare amount, and minutes active.
 */
export function TripDetails({
  className = "",
  co2Config,
  defaultFareType,
  DepartureDetails = null,
  FareDetails = null,
  itinerary,
  showApproximateMinutesActive,
  TimeActiveDetails = DefaultTimeActiveDetails
}: TripDetailsProps): ReactElement {
  return (
    <S.TripDetails className={cn(className, "trip-details")}>
      {/* this can be presentation as S.TripDetails is already labeled by this */}
      <S.TripDetailsHeader id="trip-details-header">
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.title"]}
          description="Title (heading) text of the component."
          id="otpUi.TripDetails.title"
        />
      </S.TripDetailsHeader>
      <S.TripDetailsBody>
        <DepartureDate
          itinerary={itinerary}
          DepartureDetails={DepartureDetails}
        />
        <Fares
          itinerary={itinerary}
          FareDetails={FareDetails}
          defaultFareType={defaultFareType}
        />
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
export { S as Styled, FaresV2Table };
