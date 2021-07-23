import coreUtils from "@opentripplanner/core-utils";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

/**
 * Default rendering for the departure date/time line
 * if no other corresponding message is provided.
 */
export function DefaultDepart({ itinerary, longDateFormat, timeOptions }) {
  const date = moment(itinerary.startTime);
  return (
    <>
      Depart <b>{date.format(longDateFormat)}</b>
      {" at "}
      <b>{coreUtils.time.formatTime(itinerary.startTime, timeOptions)}</b>
    </>
  );
}

DefaultDepart.propTypes = {
  itinerary: coreUtils.types.itineraryType.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  timeOptions: coreUtils.types.timeOptionsType.isRequired
};

/**
 * Default rendering for the transit fare line
 * if no other corresponding message is provided.
 */
export function DefaultTransitFare({ fareResult }) {
  const { centsToString, transitFare } = fareResult;
  return (
    <>
      Transit Fare: <b>{centsToString(transitFare)}</b>
    </>
  );
}

DefaultTransitFare.propTypes = {
  fareResult: PropTypes.shape({
    centsToString: PropTypes.func,
    transitFare: PropTypes.number
  }).isRequired
};

/**
 * Default rendering for the TNC fare line
 * if no other corresponding message is provided.
 */
export function DefaultTNCFare({ fareResult, itinerary }) {
  const { dollarsToString, maxTNCFare, minTNCFare } = fareResult;
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
  fareResult: PropTypes.shape({
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
export function DefaultCaloriesBurned({ caloriesBurned }) {
  return (
    <>
      Calories Burned: <b>{Math.round(caloriesBurned)}</b>
    </>
  );
}

DefaultCaloriesBurned.propTypes = {
  caloriesBurned: PropTypes.number.isRequired
};

/**
 * Default rendering for the calories description
 * if no other corresponding message is provided.
 */
export function DefaultCaloriesBurnedDescription({
  bikeDuration,
  walkDuration
}) {
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

DefaultCaloriesBurnedDescription.propTypes = {
  bikeDuration: PropTypes.number.isRequired,
  walkDuration: PropTypes.number.isRequired
};
