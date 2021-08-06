import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

/**
 * Default rendering for the departure date/time line
 * if no other corresponding message is provided.
 */
export function DefaultDeparture({ longDateFormat, startTime, timeOptions }) {
  const date = moment(startTime);
  return (
    <>
      Depart <b>{date.format(longDateFormat)}</b>
      {" at "}
      <b>{coreUtils.time.formatTime(startTime, timeOptions)}</b>
    </>
  );
}

DefaultDeparture.propTypes = {
  longDateFormat: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  timeOptions: coreUtils.types.timeOptionsType.isRequired
};

/**
 * Default rendering for the transit fare line
 * if no other corresponding message is provided.
 */
export function DefaultTransitFare({ fareData }) {
  const { centsToString, transitFare } = fareData;
  return (
    <>
      Transit Fare: <b>{centsToString(transitFare)}</b>
    </>
  );
}

DefaultTransitFare.propTypes = {
  fareData: PropTypes.shape({
    centsToString: PropTypes.func,
    transitFare: PropTypes.number
  }).isRequired
};

/**
 * Default rendering for the TNC fare line
 * if no other corresponding message is provided.
 */
export function DefaultTNCFare({ fareData, itinerary }) {
  const { dollarsToString, maxTNCFare, minTNCFare } = fareData;
  let companies;
  itinerary.legs.forEach(leg => {
    if (leg.tncData) {
      companies = leg.tncData.company;
    }
  });
  return (
    <>
      <Styled.TNCFareCompanies>
        {companies.toLowerCase()}
      </Styled.TNCFareCompanies>
      {" fare: "}
      <b>
        {dollarsToString(minTNCFare)} - {dollarsToString(maxTNCFare)}
      </b>
    </>
  );
}

DefaultTNCFare.propTypes = {
  fareData: PropTypes.shape({
    dollarsToString: PropTypes.func,
    maxTNCFare: PropTypes.number,
    minTNCFare: PropTypes.number
  }).isRequired,
  itinerary: coreUtils.types.itineraryType.isRequired
};

/**
 * Default rendering for the calories burned line
 * if no other corresponding message is provided.
 */
export function DefaultCalories({ calories }) {
  return (
    <>
      Calories Burned: <b>{Math.round(calories)}</b>
    </>
  );
}

DefaultCalories.propTypes = {
  calories: PropTypes.number.isRequired
};

/**
 * Default rendering for the calories description
 * if no other corresponding message is provided.
 */
export function DefaultCaloriesDetails({ bikeDuration, walkDuration }) {
  return (
    <>
      Calories burned is based on{" "}
      <b>{Math.round(walkDuration / 60)} minute(s)</b> spent walking and{" "}
      <b>{Math.round(bikeDuration / 60)} minute(s)</b> spent biking during this
      trip. Adapted from{" "}
      <a
        href="https://health.gov/dietaryguidelines/dga2005/document/html/chapter3.htm#table4"
        rel="noopener noreferrer"
        target="_blank"
      >
        Dietary Guidelines for Americans 2005, page 16, Table 4
      </a>
      .
    </>
  );
}

DefaultCaloriesDetails.propTypes = {
  bikeDuration: PropTypes.number.isRequired,
  walkDuration: PropTypes.number.isRequired
};
