import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { CalendarAlt } from "@styled-icons/fa-solid/CalendarAlt";
import { Heartbeat } from "@styled-icons/fa-solid/Heartbeat";
import { MoneyBillAlt } from "@styled-icons/fa-solid/MoneyBillAlt";
import { PhoneVolume } from "@styled-icons/fa-solid/PhoneVolume";
import { HandPaper } from "@styled-icons/fa-solid/HandPaper";
import { Route } from "@styled-icons/fa-solid/Route";

import * as S from "./styled";
import TripDetail from "./trip-detail";

function TripDetails({
  className,
  itinerary,
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
      <S.Fare>
        {transitFare && (
          <S.TransitFare>
            {messages.transitFare}: <b>{centsToString(transitFare)}</b>
          </S.TransitFare>
        )}
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

  // Parse flex info and generate appropriate strings
  const containsFlex = itinerary.legs.some(coreUtils.itinerary.isFlex);
  const pickupBookingInfo = itinerary.legs
    .map(leg => leg.pickupBookingInfo)
    .filter(info => !!info);
  const dropOffBookingInfo = itinerary.legs
    .map(leg => leg.dropOffBookingInfo)
    .filter(info => !!info);

  const callString = info =>
    `you must call ${info?.contactInfo?.phoneNumber || "ahead"}`;
  // FIXME: internationalize with correct plurals
  // FIXME: support hours
  // TODO: make use of url?
  const advanceString = info =>
    coreUtils.itinerary.isAdvanceBookingRequired(info)
      ? `at least ${info.latestBookingTime.daysPrior} day(s) in advance`
      : "";

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
        {containsFlex && (
          <TripDetail
            icon={<Route size={17} />}
            summary="This trip includes flexible routes."
          />
        )}
        {pickupBookingInfo &&
          pickupBookingInfo.map(info => (
            <TripDetail
              key={info.pickupMessage}
              icon={<PhoneVolume size={17} />}
              summary={`To take this route, ${callString(info)} ${advanceString(
                info
              )}.`}
              description={info.pickupMessage}
            />
          ))}
        {dropOffBookingInfo &&
          dropOffBookingInfo.map(info => (
            <TripDetail
              key={info.dropOffMessage}
              icon={
                coreUtils.itinerary.isAdvanceBookingRequired(info) ? (
                  <PhoneVolume size={17} />
                ) : (
                  <HandPaper size={17} />
                )
              }
              summary={
                coreUtils.itinerary.isAdvanceBookingRequired(info)
                  ? `To get off at your destination, ${callString(
                      info
                    )} ${advanceString(info)}.`
                  : `You must tell the operator where you want to get off ${advanceString(
                      info
                    )}.`
              }
              description={info.dropOffMessage}
            />
          ))}
      </S.TripDetailsBody>
    </S.TripDetails>
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
