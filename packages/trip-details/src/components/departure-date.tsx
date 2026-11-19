import { Itinerary } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import flatten from "flat";
import { boldText } from "../utils";
import { DepartureDetailsProps } from "../types";
import TripDetail from "../trip-detail";
import * as S from "../styled";

// Load the default messages.
import defaultEnglishMessages from "../../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

interface DepartureDateProps {
  startTime: Itinerary["startTime"];
  DepartureDetails?: React.ElementType<DepartureDetailsProps>;
  isBoarding: boolean;
}

export default function DepartureDate({
  startTime,
  DepartureDetails,
  isBoarding
}: DepartureDateProps): ReactElement {
  const departureDate = new Date(startTime);
  const values = { departureDate, strong: boldText };

  return (
    <TripDetail
      className="departure-date"
      // Any custom description for the Departure message needs to be handled by the slot.
      description={
        DepartureDetails && <DepartureDetails departureDate={departureDate} />
      }
      icon={<CalendarAlt size={17} />}
      summary={
        <S.Timing>
          {isBoarding ? (
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.boarding"]}
              description="Text showing when to board the first transit leg."
              id="otpUi.TripDetails.boarding"
              values={values}
            />
          ) : (
            <FormattedMessage
              defaultMessage={defaultMessages["otpUi.TripDetails.departure"]}
              description="Text showing the departure date/time for a trip."
              id="otpUi.TripDetails.departure"
              values={values}
            />
          )}
        </S.Timing>
      }
    />
  );
}
