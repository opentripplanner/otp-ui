import moment from "moment";
import qs from "qs";

import {
  getTransitModes,
  hasCar,
  hasTransit,
  isAccessMode,
  toSentenceCase
} from "./itinerary";
import { coordsToString, matchLatLon, stringToCoords } from "./map";
import queryParams from "./query-params";
import {
  getCurrentTime,
  getCurrentDate,
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT
} from "./time";

/* The list of default parameters considered in the settings panel */

export const defaultParams = [
  "wheelchair",
  "maxWalkDistance",
  "maxWalkTime",
  "walkSpeed",
  "maxBikeDistance",
  "maxBikeTime",
  "bikeSpeed",
  "optimize",
  "optimizeBike",
  "maxEScooterDistance",
  "watts"
];

/* A function to retrieve a property value from an entry in the query-params
 * table, checking for either a static value or a function */

export function getQueryParamProperty(paramInfo, property, query) {
  return typeof paramInfo[property] === "function"
    ? paramInfo[property](query)
    : paramInfo[property];
}

export function ensureSingleAccessMode(queryModes) {
  // Count the number of access modes
  const accessCount = queryModes.filter(m => isAccessMode(m)).length;

  // If multiple access modes are specified, keep only the first one
  if (accessCount > 1) {
    const firstAccess = queryModes.find(m => isAccessMode(m));
    queryModes = queryModes.filter(m => !isAccessMode(m) || m === firstAccess);

    // If no access modes are specified, add 'WALK' as the default
  } else if (accessCount === 0) {
    queryModes.push("WALK");
  }

  return queryModes;
}

export function getUrlParams() {
  return qs.parse(window.location.href.split("?")[1]);
}

export function getOtpUrlParams() {
  return Object.keys(getUrlParams()).filter(key => !key.startsWith("ui_"));
}

function findLocationType(
  location,
  locations = [],
  types = ["home", "work", "suggested"]
) {
  const match = locations.find(l => matchLatLon(l, location));
  return match && types.indexOf(match.type) !== -1 ? match.type : null;
}

export function summarizeQuery(query, locations = []) {
  const from =
    findLocationType(query.from, locations) || query.from.name.split(",")[0];
  const to =
    findLocationType(query.to, locations) || query.to.name.split(",")[0];
  const mode = hasTransit(query.mode) ? "Transit" : toSentenceCase(query.mode);
  return `${mode} from ${from} to ${to}`;
}

export function getTripOptionsFromQuery(query, keepPlace = false) {
  const options = { ...query };
  // Delete time/date options and from/to
  delete options.time;
  delete options.departArrive;
  delete options.date;
  if (!keepPlace) {
    delete options.from;
    delete options.to;
  }
  return options;
}

/**
 * Gets the default query param by executing the default value function with the
 * provided otp config if the default value is a function.
 */
function getDefaultQueryParamValue(param, config) {
  return typeof param.default === "function"
    ? param.default(config)
    : param.default;
}

/**
 * Determines whether the specified query differs from the default query, i.e.,
 * whether the user has modified any trip options (including mode) from their
 * default values.
 */
export function isNotDefaultQuery(query, config) {
  const activeModes = query.mode.split(",");
  const defaultModes = getTransitModes(config).concat(["WALK"]);
  let queryIsDifferent = false;
  const modesEqual =
    activeModes.length === defaultModes.length &&
    activeModes.sort().every((value, index) => {
      return value === defaultModes.sort()[index];
    });

  if (!modesEqual) {
    queryIsDifferent = true;
  } else {
    defaultParams.forEach(param => {
      const paramInfo = queryParams.find(qp => qp.name === param);
      // Check that the parameter applies to the specified routingType
      if (!paramInfo.routingTypes.includes(query.routingType)) return;
      // Check that the applicability test (if provided) is satisfied
      if (
        typeof paramInfo.applicable === "function" &&
        !paramInfo.applicable(query, config)
      )
        return;
      if (query[param] !== getDefaultQueryParamValue(paramInfo, config)) {
        queryIsDifferent = true;
      }
    });
  }
  return queryIsDifferent;
}

/**
 * Get the default query to OTP based on the given config.
 *
 * @param config the config in the otp-rr store.
 */
export function getDefaultQuery(config) {
  const defaultQuery = { routingType: "ITINERARY" };
  queryParams
    .filter(qp => "default" in qp)
    .forEach(qp => {
      defaultQuery[qp.name] = getDefaultQueryParamValue(qp, config);
    });
  return defaultQuery;
}

/**
 * OTP allows passing a location in the form '123 Main St::lat,lon', so we check
 * for the double colon and parse the coordinates accordingly.
 */
function parseLocationString(value) {
  const parts = value.split("::");
  const coordinates = parts[1]
    ? stringToCoords(parts[1])
    : stringToCoords(parts[0]);
  const name = parts[1] ? parts[0] : coordsToString(coordinates);
  return coordinates.length === 2
    ? {
        name: name || null,
        lat: coordinates[0] || null,
        lon: coordinates[1] || null
      }
    : null;
}

/**
 * Create a otp query based on a the url params.
 *
 * @param  {Object} params An object representing the parsed querystring of url
 *    params.
 * @param config the config in the otp-rr store.
 */
export function planParamsToQuery(params, config) {
  const query = {};
  Object.keys(params).forEach(key => {
    switch (key) {
      case "fromPlace":
        query.from = parseLocationString(params.fromPlace);
        break;
      case "toPlace":
        query.to = parseLocationString(params.toPlace);
        break;
      case "arriveBy":
        query.departArrive =
          params.arriveBy === "true"
            ? "ARRIVE"
            : params.arriveBy === "false"
            ? "DEPART"
            : "NOW";
        break;
      case "date":
        query.date = params.date || getCurrentDate(config);
        break;
      case "time":
        query.time = params.time || getCurrentTime(config);
        break;
      default: {
        const maybeNumber = Number(params[key]);
        // If the param value is an empty string literal and is not a number,
        // use string value. Else, use parsed number value.
        // See https://github.com/opentripplanner/otp-ui/issues/50
        query[key] =
          params[key] === "" || Number.isNaN(maybeNumber)
            ? params[key]
            : maybeNumber;
        break;
      }
    }
  });
  return query;
}

/**
 * Create an object that can be used as a querystring in making an OTP
 * PlannerResource request.
 *
 * See http://otp-docs.ibi-transit.com/api/resource_PlannerResource.html
 *
 * @param  {Object} config  The OTP application config. See types#configType
 * @param  {Object} currentQuery  The current query parameters as saved in the
 *   application state. This method does some extra logic on top of this data
 *   in order to create a request suitable for OTP. See types#queryType
 * @param  {boolean} ignoreRealtimeUpdates  If true, will create a request that
 *   does not use realtime data.
 */
export function getRoutingParams(config, currentQuery, ignoreRealtimeUpdates) {
  const routingType = currentQuery.routingType;
  const isItinerary = routingType === "ITINERARY";
  let params = {};

  // Start with the universe of OTP parameters defined in query-params.js:
  queryParams
    .filter(qp => {
      // A given parameter is included in the request if all of the following:
      // 1. Must apply to the active routing type (ITINERARY or PROFILE)
      // 2. Must be included in the current user-defined query
      // 3. Must pass the parameter's applicability test, if one is specified
      return (
        qp.routingTypes.indexOf(routingType) !== -1 &&
        qp.name in currentQuery &&
        (typeof qp.applicable !== "function" ||
          qp.applicable(currentQuery, config))
      );
    })
    .forEach(qp => {
      // Translate the applicable parameters according to their rewrite
      // functions (if provided)
      const rewriteFunction = isItinerary
        ? qp.itineraryRewrite
        : qp.profileRewrite;
      params = Object.assign(
        params,
        rewriteFunction
          ? rewriteFunction(currentQuery[qp.name])
          : { [qp.name]: currentQuery[qp.name] }
      );
    });

  // Additional processing specific to ITINERARY mode
  if (isItinerary) {
    // override ignoreRealtimeUpdates if provided
    if (typeof ignoreRealtimeUpdates === "boolean") {
      params.ignoreRealtimeUpdates = ignoreRealtimeUpdates;
    }

    // check date/time validity; ignore both if either is invalid
    const dateValid = moment(params.date, OTP_API_DATE_FORMAT).isValid();
    const timeValid = moment(params.time, OTP_API_TIME_FORMAT).isValid();

    if (!dateValid || !timeValid) {
      delete params.time;
      delete params.date;
    }

    // temp: set additional parameters for CAR_HAIL or CAR_RENT trips
    if (
      params.mode &&
      (params.mode.includes("CAR_HAIL") || params.mode.includes("CAR_RENT"))
    ) {
      params.minTransitDistance = "50%";
      // increase search timeout because these queries can take a while
      params.searchTimeout = 10000;
    }

    // set onlyTransitTrips for car rental searches
    if (params.mode && params.mode.includes("CAR_RENT")) {
      params.onlyTransitTrips = true;
    }

    // Additional processing specific to PROFILE mode
  } else {
    // check start and end time validity; ignore both if either is invalid
    const startTimeValid = moment(
      params.startTime,
      OTP_API_TIME_FORMAT
    ).isValid();
    const endTimeValid = moment(params.endTime, OTP_API_TIME_FORMAT).isValid();

    if (!startTimeValid || !endTimeValid) {
      delete params.startTimeValid;
      delete params.endTimeValid;
    }
  }

  // TODO: check that valid from/to locations are provided

  // hack to add walking to driving/TNC trips
  if (hasCar(params.mode)) {
    params.mode += ",WALK";
  }

  return params;
}
