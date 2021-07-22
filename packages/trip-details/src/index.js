import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt, Heartbeat, MoneyBillAlt } from "styled-icons/fa-solid";

import * as Styled from "./styled";
import TripDetail from "./trip-detail";

/**
 * Default rendering for the departure date/time.
 */
function renderDefaultDepart(itinerary, longDateFormat, timeOptions) {
  const date = moment(itinerary.startTime);
  return (
    <>
      Depart <b>{date.format(longDateFormat)}</b>
      <> at </>
      <b>{coreUtils.time.formatTime(itinerary.startTime, timeOptions)}</b>
    </>
  );
}

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
  const {
    centsToString,
    dollarsToString,
    maxTNCFare,
    minTNCFare,
    transitFare
  } = coreUtils.itinerary.calculateFares(itinerary);
  let companies;
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });
  let fare;
  if (transitFare || minTNCFare) {
    fare = (
      <Styled.Fare>
        {transitFare && (
          <Styled.TransitFare>
            {messages.transitFare}: <b>{centsToString(transitFare)}</b>
          </Styled.TransitFare>
        )}
        {minTNCFare !== 0 && (
          <Styled.TNCFare>
            <br />
            <Styled.TNCFareCompanies>
              {companies.toLowerCase()}
            </Styled.TNCFareCompanies>{" "}
            {messages.fare}:{" "}
            <b>
              {dollarsToString(minTNCFare)} - {dollarsToString(maxTNCFare)}
            </b>
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
              {messages.depart ||
                renderDefaultDepart(itinerary, longDateFormat, timeOptions)}
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
                {messages.caloriesBurned}: <b>{Math.round(caloriesBurned)}</b>
              </Styled.CaloriesSummary>
            }
            description={
              <Styled.CaloriesDescription>
                Calories burned is based on{" "}
                <b>{Math.round(walkDuration / 60)} minute(s)</b> spent walking
                and <b>{Math.round(bikeDuration / 60)} minute(s)</b> spent
                biking during this trip. Adapted from{" "}
                <a
                  href="https://health.gov/dietaryguidelines/dga2005/document/html/chapter3.htm#table4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Dietary Guidelines for Americans 2005, page 16, Table 4
                </a>
                .
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
    fare: PropTypes.string,
    transitFare: PropTypes.string,
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
    fare: "Fare",
    transitFare: "Transit Fare",
    transitFareDescription: null
  },
  timeOptions: null
};
