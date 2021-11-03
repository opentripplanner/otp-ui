import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";

import * as S from "./styled";
import TripDetail from "./trip-detail";

const TransitFare = ({ fareKey, fareNameFallback, keyMap, transitFares }) => {
  const currentFare = transitFares[fareKey];

  return (
    <span>
      {keyMap[fareKey] || fareNameFallback || fareKey}:{" "}
      <b>{currentFare.centsToString(currentFare.transitFare)}</b>
    </span>
  );
};
TransitFare.propTypes = {
  fareKey: PropTypes.string.isRequired,
  fareNameFallback: PropTypes.string,
  keyMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.string
  }).isRequired,
  transitFares: PropTypes.shape({
    centsToString: PropTypes.func,
    transitFare: PropTypes.number
  }).isRequired
};
TransitFare.defaultProps = {
  fareNameFallback: undefined
};

function TripDetails({
  className,
  configDefaultFare,
  itinerary,
  keyMap,
  longDateFormat,
  messages,
  routingType,
  timeOptions
}) {
  const date = moment(itinerary.startTime);
  messages = coreUtils.messages.mergeMessages(
    TripDetails.defaultProps.messages,
    messages
  );

  // process the transit fare
  const {
    maxTNCFare,
    minTNCFare,
    transitFares
  } = coreUtils.itinerary.calculateFares(itinerary, true);

  let defaultFare = configDefaultFare;
  if (!transitFares[configDefaultFare]) {
    defaultFare = "regular";
  }

  let companies;
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });
  let fare;

  const fareKeys = transitFares && Object.keys(transitFares).sort();

  if (transitFares && fareKeys.length > 0) {
    const { dollarsToString } = transitFares[defaultFare];
    // Depending on if there are additional fares to display either render a <span> or a <details>
    const TransitFareWrapper =
      transitFares && fareKeys.length > 1 ? S.TransitFare : S.TransitFareSingle;

    fare = (
      <S.Fare>
        <TransitFareWrapper>
          <summary style={{ display: fareKeys.length > 1 ? "list-item" : "" }}>
            <TransitFare
              fareNameFallback={messages.transitFare}
              fareKey={defaultFare}
              keyMap={keyMap}
              transitFares={transitFares}
            />
          </summary>
          {fareKeys.map(fareKey => {
            // Don't show the default fare twice!
            if (fareKey === defaultFare) {
              return null;
            }
            return (
              <TransitFare
                fareKey={fareKey}
                key={fareKey}
                keyMap={keyMap}
                transitFares={transitFares}
              />
            );
          })}
        </TransitFareWrapper>
        {minTNCFare !== 0 && (
          <S.TNCFare>
            <br />
            <S.TNCFareCompanies>
              {companies.toLowerCase()}
            </S.TNCFareCompanies>{" "}
            {messages.fare}:{" "}
            <b>
              {dollarsToString(minTNCFare)} - {dollarsToString(maxTNCFare)}
            </b>
          </S.TNCFare>
        )}
      </S.Fare>
    );
  }

  // Compute calories burned.
  const {
    bikeDuration,
    caloriesBurned,
    walkDuration
  } = coreUtils.itinerary.calculatePhysicalActivity(itinerary);

  return (
    <S.TripDetails className={className}>
      <S.TripDetailsHeader>{messages.title}</S.TripDetailsHeader>
      <S.TripDetailsBody>
        <TripDetail
          description={messages.departDescription}
          icon={<CalendarAlt size={17} />}
          summary={
            <S.Timing>
              <span>
                {messages.depart} <b>{date.format(longDateFormat)}</b>
              </span>
              {routingType === "ITINERARY" && (
                <span>
                  {" "}
                  {messages.at}{" "}
                  <b>
                    {coreUtils.time.formatTime(
                      itinerary.startTime,
                      timeOptions
                    )}
                  </b>
                </span>
              )}
            </S.Timing>
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
              <S.CaloriesSummary>
                {messages.caloriesBurned}: <b>{Math.round(caloriesBurned)}</b>
              </S.CaloriesSummary>
            }
            description={
              <S.CaloriesDescription>
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
              </S.CaloriesDescription>
            }
          />
        )}
      </S.TripDetailsBody>
    </S.TripDetails>
  );
}

TripDetails.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Determines which transit fare should be displayed by default, should there be multiple transit fare types */
  configDefaultFare: PropTypes.string,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** Mapping between fare keys and human-readable names for them */
  keyMap: PropTypes.shape({
    [PropTypes.string]: PropTypes.string
  }),
  /** the desired format to use for a long date */
  longDateFormat: PropTypes.string,
  /**
   * messages to use for l10n/i8n
   *
   * Note: messages with default null values included here for visibility.
   * Overriding with a truthy string value will cause the expandable help
   * message to appear in trip details.
   */
  messages: PropTypes.shape({
    at: PropTypes.string,
    caloriesBurned: PropTypes.string,
    // FIXME: Add templated string description.
    caloriesBurnedDescription: PropTypes.string,
    depart: PropTypes.string,
    departDescription: PropTypes.string,
    title: PropTypes.string,
    fare: PropTypes.string,
    transitFare: PropTypes.string,
    transitFareDescription: PropTypes.string
  }),
  /** whether the routing type is an itinerary or a profile result */
  routingType: PropTypes.string,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType
};

TripDetails.defaultProps = {
  className: null,
  configDefaultFare: "regular",
  keyMap: {},
  longDateFormat: null,
  messages: {
    at: "at",
    caloriesBurned: "Calories Burned",
    // FIXME: Add templated string description.
    caloriesBurnedDescription: null,
    depart: "Depart",
    departDescription: null,
    title: "Trip Details",
    fare: "Fare",
    transitFare: "Transit Fare",
    transitFareDescription: null
  },
  routingType: "ITINERARY",
  timeOptions: null
};

export default TripDetails;

// Rename styled components for export
export { S as Styled };
