// import moment from "moment";

// Just to satisfy lint, will be removed eventually.
export const FOO = 1;

/**
 * To disable cyclic dependency resolution we need to require() within methods
 * This is a good reason to disable this eslint-rule
 */
/* eslint00-disable global-require */

/**
 * Generates a warning to tell developer that they are using deprecated methods!
 */
export function logDeprecationWarning(method, alternative) {
  console.warn(
    `${method ||
      "This method"} is deprecated and will be removed in a future otp-ui release. All language functionality should be handled using react-intl.
        ${
          alternative
            ? `

        Use ${alternative} instead, which provides a new interface that doesn't return English strings.`
            : ""
        }`
  );
}

// itinerary.js
/*
export function getStepDirection(step) {
  logDeprecationWarning("getStepDirection");

  switch (step.relativeDirection) {
    case "DEPART":
      return `Head ${step.absoluteDirection.toLowerCase()}`;
    case "LEFT":
      return "Left";
    case "HARD_LEFT":
      return "Hard left";
    case "SLIGHTLY_LEFT":
      return "Slight left";
    case "CONTINUE":
      return "Continue";
    case "SLIGHTLY_RIGHT":
      return "Slight right";
    case "RIGHT":
      return "Right";
    case "HARD_RIGHT":
      return "Hard right";
    case "CIRCLE_CLOCKWISE":
      return "Follow circle clockwise";
    case "CIRCLE_COUNTERCLOCKWISE":
      return "Follow circle counterclockwise";
    case "ELEVATOR":
      return "Take elevator";
    case "UTURN_LEFT":
      return "Left U-turn";
    case "UTURN_RIGHT":
      return "Right U-turn";
    default:
      return step.relativeDirection;
  }
}

export function getStepInstructions(step) {
  logDeprecationWarning("getStepInstructions");

  const conjunction = step.relativeDirection === "ELEVATOR" ? "to" : "on";
  return `${getStepDirection(step)} ${conjunction} ${step.streetName}`;
}

export function getStepStreetName(step) {
  logDeprecationWarning("getStepStreetName");

  if (step.streetName === "road") return "Unnamed Road";
  if (step.streetName === "path") return "Unnamed Path";
  return step.streetName;
}

export function getLegModeLabel(leg) {
  logDeprecationWarning("getLegModeLabel");

  switch (leg.mode) {
    case "BICYCLE_RENT":
      return "Biketown";
    case "CAR":
      return leg.hailedCar ? "Ride" : "Drive";
    case "GONDOLA":
      return "Aerial Tram";
    case "TRAM":
      if (leg.routeLongName.toLowerCase().indexOf("streetcar") !== -1)
        return "Streetcar";
      return "Light Rail";
    case "MICROMOBILITY":
    case "SCOOTER":
      return "Ride";
    default:
      return require("./itinerary").toSentenceCase(leg.mode);
  }
}
*/
/**
 * Returns mode name by checking the vertex type (VertexType class in OTP) for
 * the provided place. NOTE: this is currently only intended for vehicles at
 * the moment (not transit or walking).
 *
 * @param  {string} place place from itinerary leg
 */
/*
export function getModeForPlace(place) {
  logDeprecationWarning("getModeForPlace");

  switch (place.vertexType) {
    case "CARSHARE":
      return "car";
    case "VEHICLERENTAL":
      return "E-scooter";
    // TODO: Should the type change depending on bike vertex type?
    case "BIKESHARE":
    case "BIKEPARK":
      return "bike";
    // If company offers more than one mode, default to `vehicle` string.
    default:
      return "vehicle";
  }
}

export function getPlaceName(place, companies) {
  logDeprecationWarning("getPlaceName");

  // If address is provided (i.e. for carshare station, use it)
  if (place.address) return place.address.split(",")[0];
  if (place.networks && place.vertexType === "VEHICLERENTAL") {
    // For vehicle rental pick up, do not use the place name. Rather, use
    // company name + vehicle type (e.g., SPIN E-scooter). Place name is often just
    // a UUID that has no relevance to the actual vehicle. For bikeshare, however,
    // there are often hubs or bikes that have relevant names to the user.
    const company = require("./itinerary").getCompanyForNetwork(
      place.networks[0],
      companies
    );
    if (company) {
      return `${company.label} ${getModeForPlace(place)}`;
    }
  }
  // Default to place name
  return place.name;
}
*/
/**
 * For a given fare component (either total fare or component parts), returns
 * an object with string formatters and the fare value (in cents).
 */
/*
export function getTransitFare(fareComponent) {
  logDeprecationWarning("getTransitFare", "the fare object and getTncFare");

  // Default values (if fare component is not valid).
  let digits = 2;
  let transitFare = 0;
  let symbol = "$";
  let currencyCode = "USD";
  if (fareComponent) {
    // Assign values without declaration. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#assignment_without_declaration
    ({
      currencyCode,
      defaultFractionDigits: digits,
      symbol
    } = fareComponent.currency);
    transitFare = fareComponent.cents;
  }
  // For cents to string conversion, use digits from fare component.
  const centsToString = cents => {
    const dollars = (cents / 10 ** digits).toFixed(digits);
    return `${symbol}${dollars}`;
  };
  // For dollars to string conversion, assume we're rounding to two digits.
  const dollarsToString = dollars => `${symbol}${dollars.toFixed(2)}`;
  return {
    centsToString,
    currencyCode,
    dollarsToString,
    transitFare
  };
}
*/
/**
 * For an itinerary, calculates the transit/TNC fares and returns an object with
 * these values, currency info, as well as string formatters.
 * It is assumed that the same currency is used for transit and TNC legs.
 *
 * multiple being set to true will change the output behavior:
 * - dollarsToString and centsToString will be returned as part of each fare
 * - currencyCode will be returned separately for each fare
 * - tnc currency code will be returned separately
 * - each fare type will be returned separately within a new transitFares property
 *
 * FIXME: a new approach to fare calculation must be found:
 * the current approach is not sustainable, as centsToString and DollarsToString
 * must be replaced by i18n anyway.
 *
 * However, the current behavior should ideally be kept to avoid a breaking change.
 * The "multiple" mode is helpful, but only prevents tnc fare calculation from being duplicated.
 * This method could be split out into a new one, along with tnc fare calculation.
 * If this is done, the individual fare calculation should also be modified to support
 * a default fare not being called "regular". However, this again would be a breaking change.
 * This breaking change is avoided by adding the "multiple" parameter.
 *
 * When centsToString and dollarsToString are removed, this method should be split into
 * individual fare calculation on a variable fare key, fare calculation of an entire leg,
 * which will get fares for every fare key in the leg, and a method to calculate the fare of
 * a tnc ride within the leg. This will make typescripting easier, as the types will be cleaner.
 */
/*
export function calculateFares(itinerary, multiple = false) {
  logDeprecationWarning("calculateFares", "the fare object and getTncFare");

  // Process any TNC fares
  let minTNCFare = 0;
  let maxTNCFare = 0;
  let tncCurrencyCode;
  itinerary.legs.forEach(leg => {
    if (leg.mode === "CAR" && leg.hailedCar && leg.tncData) {
      const { currency, maxCost, minCost } = leg.tncData;
      // TODO: Support non-USD
      minTNCFare += minCost;
      maxTNCFare += maxCost;
      tncCurrencyCode = currency;
    }
  });

  if (multiple) {
    // Return object of fares
    const transitFares = {};
    if (itinerary && itinerary.fare && itinerary.fare.fare) {
      Object.keys(itinerary.fare.fare).forEach(fareKey => {
        const fareComponent = itinerary.fare.fare[fareKey];
        transitFares[fareKey] = getTransitFare(fareComponent);
      });
    }

    return {
      maxTNCFare,
      minTNCFare,
      tncCurrencyCode,
      transitFares
    };
  }

  // Extract fare total from itinerary fares.
  const fareComponent =
    itinerary.fare && itinerary.fare.fare && itinerary.fare.fare.regular;
  // Get string formatters and itinerary fare.
  const {
    centsToString,
    currencyCode: transitCurrencyCode,
    dollarsToString,
    transitFare
  } = getTransitFare(fareComponent);

  return {
    centsToString,
    currencyCode: transitCurrencyCode || tncCurrencyCode,
    dollarsToString,
    maxTNCFare,
    minTNCFare,
    transitFare
  };
}
*/
// map.js
/*
export function latlngToString(latlng) {
  logDeprecationWarning("latlngToString", "the latlng object");

  return (
    latlng &&
    `${latlng.lat.toFixed(5)}, ${(latlng.lng || latlng.lon).toFixed(5)}`
  );
}
*/
/*
export function coordsToString(coords) {
  logDeprecationWarning("coordsToString", "the coords object");

  return coords.length && coords.map(c => (+c).toFixed(5)).join(", ");
}

export function getDetailText(location) {
  let detailText;
  if (location.type === "home" || location.type === "work") {
    detailText = location.name;
  }
  if (location.type === "stop") {
    detailText = location.id;
  } else if (location.type === "recent" && location.timestamp) {
    detailText = moment(location.timestamp).fromNow();
  }
  return detailText;
}
*/
// query.js
/*
export function summarizeQuery(query, locations = []) {
  logDeprecationWarning("summarizeQuery");

  function findLocationType(
    location,
    ls = [],
    types = ["home", "work", "suggested"]
  ) {
    const match = ls.find(l => require("./map").matchLatLon(l, location));
    return match && types.indexOf(match.type) !== -1 ? match.type : null;
  }

  const from =
    findLocationType(query.from, locations) || query.from.name.split(",")[0];
  const to =
    findLocationType(query.to, locations) || query.to.name.split(",")[0];
  const mode = require("./itinerary").hasTransit(query.mode)
    ? "Transit"
    : require("./itinerary").toSentenceCase(query.mode);
  return `${mode} from ${from} to ${to}`;
}

export function getTimeZoneOffset(itinerary) {
  logDeprecationWarning("getTimeZoneOffset");

  if (!itinerary.legs || !itinerary.legs.length) return 0;

  // Determine if there is a DST offset between now and the itinerary start date
  const dstOffset =
    new Date(itinerary.startTime).getTimezoneOffset() -
    new Date().getTimezoneOffset();

  return (
    itinerary.legs[0].agencyTimeZoneOffset +
    (new Date().getTimezoneOffset() + dstOffset) * 60000
  );
}
*/
