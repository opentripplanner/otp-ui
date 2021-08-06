import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import {
  DefaultDeparture,
  DefaultTransitFare,
  DefaultTNCFare,
  DefaultCalories,
  DefaultCaloriesDetails
} from "./defaults";
import * as Styled from "./styled";
import TripDetail from "./trip-detail";

export default function TripDetails({
  Calories,
  CaloriesDetails,
  className,
  Departure,
  DepartureDetails,
  FareDetails,
  itinerary,
  longDateFormat,
  timeOptions,
  title,
  TransitFare,
  TNCFare
}) {
  // process the transit fare
  const fareResult = coreUtils.itinerary.calculateFares(itinerary);
  const { minTNCFare, transitFare } = fareResult;
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            <TransitFare fareData={fareResult} />
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <TNCFare fareData={fareResult} itinerary={itinerary} />
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
      <Styled.TripDetailsHeader>{title}</Styled.TripDetailsHeader>
      <Styled.TripDetailsBody>
        <TripDetail
          description={
            DepartureDetails && (
              <DepartureDetails startTime={itinerary.startTime} />
            )
          }
          icon={<CalendarAlt size={17} />}
          summary={
            <Styled.Timing>
              <Departure
                longDateFormat={longDateFormat}
                startTime={itinerary.startTime}
                timeOptions={timeOptions}
              />
            </Styled.Timing>
          }
        />
        {fare && (
          <TripDetail
            description={FareDetails && <FareDetails fareData={fareResult} />}
            icon={<MoneyBillAlt size={17} />}
            summary={fare}
          />
        )}
        {caloriesBurned > 0 && (
          <TripDetail
            icon={<Heartbeat size={17} />}
            summary={
              <Styled.CaloriesSummary>
                <Calories calories={caloriesBurned} />
              </Styled.CaloriesSummary>
            }
            description={
              CaloriesDetails && (
                <Styled.CaloriesDescription>
                  <CaloriesDetails
                    bikeDuration={bikeDuration}
                    calories={caloriesBurned}
                    walkDuration={walkDuration}
                  />
                </Styled.CaloriesDescription>
              )
            }
          />
        )}
      </Styled.TripDetailsBody>
    </Styled.TripDetails>
  );
}

TripDetails.propTypes = {
  Calories: PropTypes.elementType,
  CaloriesDetails: PropTypes.elementType,
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  Departure: PropTypes.elementType,
  DepartureDetails: PropTypes.elementType,
  FareDetails: PropTypes.elementType,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** the desired format to use for a long date */
  longDateFormat: PropTypes.string,
  title: PropTypes.string,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType,
  TransitFare: PropTypes.elementType,
  TNCFare: PropTypes.elementType
};

TripDetails.defaultProps = {
  Calories: DefaultCalories,
  CaloriesDetails: DefaultCaloriesDetails,
  className: null,
  Departure: DefaultDeparture,
  DepartureDetails: null,
  FareDetails: null,
  longDateFormat: null,
  title: "Trip Details",
  timeOptions: null,
  TransitFare: DefaultTransitFare,
  TNCFare: DefaultTNCFare
};
