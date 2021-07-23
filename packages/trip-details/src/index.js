import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import {
  DefaultDepart,
  DefaultTransitFare,
  DefaultTNCFare,
  DefaultCaloriesBurned,
  DefaultCaloriesBurnedDescription
} from "./defaults";
import * as Styled from "./styled";
import TripDetail from "./trip-detail";

export default function TripDetails({
  className,
  itinerary,
  longDateFormat,
  messages,
  timeOptions
}) {
  messages = coreUtils.messages.mergeMessages(
    TripDetails.defaultProps.messages,
    messages
  );

  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateFares(itinerary);
  const { minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            {messages.transitFare || (
              <DefaultTransitFare fareResult={fareResult} />
            )}
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            {messages.tncFare || (
              <DefaultTNCFare fareResult={fareResult} itinerary={itinerary} />
            )}
          </Styled.TNCFare>
        )}
      </Styled.Fare>
    );
  }

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return (
    <Styled.TripDetails className={className}>
      <Styled.TripDetailsHeader>{messages.title}</Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          description={messages.departDescription}
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              {messages.depart || (
                <DefaultDepart
                  itinerary={itinerary}
                  longDateFormat={longDateFormat}
                  timeOptions={timeOptions}
                />
              )}
            </Styled.Timing>
          }
        />
        {fare && (
          <TripDetail
            description={messages.transitFareDescription}
            icon={<MoneyBillAlt size={17} />}
            summary={fare}
          />
        )}
        {caloriesBurned > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <Styled.CaloriesSummary>
                {messages.caloriesBurned || (
                  <DefaultCaloriesBurned caloriesBurned={caloriesBurned} />
                )}
              </Styled.CaloriesSummary>
            }
            description={
              <Styled.CaloriesDescription>
                {messages.caloriesBurnedDescription || (
                  <DefaultCaloriesBurnedDescription
                    bikeDuration={bikeDuration}
                    walkDuration={walkDuration}
                  />
                )}
              </Styled.CaloriesDescription>
            }
          />
        )}
      </Styled.TripDetailsBody>
    </Styled.TripDetails>
  );
}

TripDetails.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** the desired format to use for a long date */
  longDateFormat: PropTypes.string,
  /**
   * messages to use for l10n/i8n
   *
   * Note: messages with default null values included here for visibility.
   * Overriding with truthy content will cause the expandable help
   * message to appear in trip details.
   */
  messages: PropTypes.shape({
    caloriesBurned: PropTypes.string,
    caloriesBurnedDescription: PropTypes.element,
    depart: PropTypes.element,
    departDescription: PropTypes.element,
    title: PropTypes.string,
    tncFare: PropTypes.element,
    transitFare: PropTypes.element,
    transitFareDescription: PropTypes.element
  }),
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType
};

TripDetails.defaultProps = {
  className: null,
  longDateFormat: null,
  messages: {
    caloriesBurned: "Calories Burned",
    // FIXME: Add templated string description.
    caloriesBurnedDescription: null,
    depart: null,
    departDescription: null,
    title: "Trip Details",
    tncFare: null,
    transitFare: null,
    transitFareDescription: null
  },
  timeOptions: null
};
