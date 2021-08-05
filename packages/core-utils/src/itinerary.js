import polyline from "@mapbox/polyline";
import turfAlong from "@turf/along";

// All OTP transit modes
export const transitModes = [
  "TRAM",
  "BUS",
  "SUBWAY",
  "FERRY",
  "RAIL",
  "GONDOLA"
];

/**
 * @param  {config} config OTP-RR configuration object
 * @return {Array}  List of all transit modes defined in config; otherwise default mode list
 */

export function getTransitModes(config) {
  if (!config || !config.modes || !config.modes.transitModes)
    return transitModes;
  return config.modes.transitModes.map(tm => tm.mode);
}

export function isTransit(mode) {
  return transitModes.includes(mode) || mode === "TRANSIT";
}

export function isWalk(mode) {
  if (!mode) return false;

  return mode === "WALK";
}

export function isBicycle(mode) {
  if (!mode) return false;

  return mode === "BICYCLE";
}

export function isBicycleRent(mode) {
  if (!mode) return false;

  return mode === "BICYCLE_RENT";
}

export function isCar(mode) {
  if (!mode) return false;
  return mode.startsWith("CAR");
}

export function isMicromobility(mode) {
  if (!mode) return false;
  return mode.startsWith("MICROMOBILITY");
}

export function isAccessMode(mode) {
  return (
    isWalk(mode) ||
    isBicycle(mode) ||
    isBicycleRent(mode) ||
    isCar(mode) ||
    isMicromobility(mode)
  );
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are transit modes
 */
export function hasTransit(modesStr) {
  return modesStr.split(",").some(mode => isTransit(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are car-based modes
 */
export function hasCar(modesStr) {
  return modesStr.split(",").some(mode => isCar(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are bicycle-based modes
 */
export function hasBike(modesStr) {
  return modesStr
    .split(",")
    .some(mode => isBicycle(mode) || isBicycleRent(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are micromobility-based modes
 */
export function hasMicromobility(modesStr) {
  return modesStr.split(",").some(mode => isMicromobility(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes is a hailing mode
 */
export function hasHail(modesStr) {
  return modesStr.split(",").some(mode => mode.indexOf("_HAIL") > -1);
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes is a rental mode
 */
export function hasRental(modesStr) {
  return modesStr.split(",").some(mode => mode.indexOf("_RENT") > -1);
}

export function getMapColor(mode) {
  mode = mode || this.get("mode");
  if (mode === "WALK") return "#444";
  if (mode === "BICYCLE") return "#0073e5";
  if (mode === "SUBWAY") return "#e60000"; /* from #f00 to comply with WCAG */
  if (mode === "RAIL") return "#b00";
  if (mode === "BUS") return "#080";
  if (mode === "TRAM") return "#800";
  if (mode === "FERRY") return "#008";
  if (mode === "CAR") return "#444";
  if (mode === "MICROMOBILITY") return "#f5a729";
  return "#aaa";
}

// TODO: temporary code; handle via migrated OTP i18n language table
export function getStepDirection(step) {
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
  const conjunction = step.relativeDirection === "ELEVATOR" ? "to" : "on";
  return `${getStepDirection(step)} ${conjunction} ${step.streetName}`;
}

export function getStepStreetName(step) {
  if (step.streetName === "road") return "Unnamed Road";
  if (step.streetName === "path") return "Unnamed Path";
  return step.streetName;
}

export function toSentenceCase(str) {
  if (str == null) {
    return "";
  }
  str = String(str);
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

/**
 * Derive the company string based on mode and network associated with leg.
 */
export function getCompanyFromLeg(leg) {
  if (!leg) return null;
  const { from, mode, rentedBike, rentedCar, rentedVehicle, tncData } = leg;
  if (mode === "CAR" && rentedCar) {
    return from.networks[0];
  }
  if (mode === "CAR" && tncData) {
    return tncData.company;
  }
  if (mode === "BICYCLE" && rentedBike && from.networks) {
    return from.networks[0];
  }
  if (mode === "MICROMOBILITY" && rentedVehicle && from.networks) {
    return from.networks[0];
  }
  return null;
}

export function getLegModeLabel(leg) {
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
      return "Ride";
    default:
      return toSentenceCase(leg.mode);
  }
}

export function getItineraryBounds(itinerary) {
  let coords = [];
  itinerary.legs.forEach(leg => {
    const legCoords = polyline
      .toGeoJSON(leg.legGeometry.points)
      .coordinates.map(c => [c[1], c[0]]);
    coords = [...coords, ...legCoords];
  });
  return coords;
}

/**
 * Return a coords object that encloses the given leg's geometry.
 */
export function getLegBounds(leg) {
  const coords = polyline
    .toGeoJSON(leg.legGeometry.points)
    .coordinates.map(c => [c[1], c[0]]);

  // in certain cases, there might be zero-length coordinates in the leg
  // geometry. In these cases, build us an array of coordinates using the from
  // and to data of the leg.
  if (coords.length === 0) {
    coords.push([leg.from.lat, leg.from.lon], [leg.to.lat, leg.to.lon]);
  }
  return coords;
}

/* Returns an interpolated lat-lon at a specified distance along a leg */

export function legLocationAtDistance(leg, distance) {
  if (!leg.legGeometry) return null;

  try {
    const line = polyline.toGeoJSON(leg.legGeometry.points);
    const pt = turfAlong(line, distance, { units: "meters" });
    if (pt && pt.geometry && pt.geometry.coordinates) {
      return [pt.geometry.coordinates[1], pt.geometry.coordinates[0]];
    }
  } catch (e) {
    // FIXME handle error!
  }

  return null;
}

/* Returns an interpolated elevation at a specified distance along a leg */

export function legElevationAtDistance(points, distance) {
  // Iterate through the combined elevation profile
  let traversed = 0;
  // If first point distance is not zero, insert starting point at zero with
  // null elevation. Encountering this value should trigger the warning below.
  if (points[0][0] > 0) {
    points.unshift([0, null]);
  }
  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const elevDistanceSpan = points[i][0] - start[0];
    if (distance >= traversed && distance <= traversed + elevDistanceSpan) {
      // Distance falls within this point and the previous one;
      // compute & return iterpolated elevation value
      if (start[1] === null) {
        console.warn(
          "Elevation value does not exist for distance.",
          distance,
          traversed
        );
        return null;
      }
      const pct = (distance - traversed) / elevDistanceSpan;
      const elevSpan = points[i][1] - start[1];
      return start[1] + elevSpan * pct;
    }
    traversed += elevDistanceSpan;
  }
  console.warn(
    "Elevation value does not exist for distance.",
    distance,
    traversed
  );
  return null;
}

// Iterate through the steps, building the array of elevation points and
// keeping track of the minimum and maximum elevations reached
export function getElevationProfile(steps, unitConversion = 1) {
  let minElev = 100000;
  let maxElev = -100000;
  let traversed = 0;
  let gain = 0;
  let loss = 0;
  let previous = null;
  const points = [];
  steps.forEach(step => {
    if (!step.elevation || step.elevation.length === 0) {
      traversed += step.distance;
      return;
    }
    for (let i = 0; i < step.elevation.length; i++) {
      const elev = step.elevation[i];
      if (previous) {
        const diff = (elev.second - previous.second) * unitConversion;
        if (diff > 0) gain += diff;
        else loss += diff;
      }
      if (i === 0 && elev.first !== 0) {
        // console.warn(`No elevation data available for step ${stepIndex}-${i} at beginning of segment`, elev)
      }
      const convertedElevation = elev.second * unitConversion;
      if (convertedElevation < minElev) minElev = convertedElevation;
      if (convertedElevation > maxElev) maxElev = convertedElevation;
      points.push([traversed + elev.first, elev.second]);
      // Insert "filler" point if the last point in elevation profile does not
      // reach the full distance of the step.
      if (i === step.elevation.length - 1 && elev.first !== step.distance) {
        // points.push([traversed + step.distance, elev.second])
      }
      previous = elev;
    }
    traversed += step.distance;
  });
  return { maxElev, minElev, points, traversed, gain, loss };
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {string} text The text to be rendered.
 * @param {string} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export function getTextWidth(text, font = "22px Arial") {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

/**
 * Get the configured company object for the given network string if the company
 * has been defined in the provided companies array config.
 */
function getCompanyForNetwork(networkString, companies = []) {
  const company = companies.find(co => co.id === networkString);
  if (!company) {
    console.warn(
      `No company found in config.yml that matches rented vehicle network: ${networkString}`,
      companies
    );
  }
  return company;
}

/**
 * Get a string label to display from a list of vehicle rental networks.
 *
 * @param  {Array<string>} networks  A list of network ids.
 * @param  {Array<object>}  [companies=[]] An optional list of the companies config.
 * @return {string}  A label for use in presentation on a website.
 */
export function getCompaniesLabelFromNetworks(networks, companies = []) {
  return networks
    .map(network => getCompanyForNetwork(network, companies))
    .filter(co => !!co)
    .map(co => co.label)
    .join("/");
}

/**
 * Returns mode name by checking the vertex type (VertexType class in OTP) for
 * the provided place. NOTE: this is currently only intended for vehicles at
 * the moment (not transit or walking).
 *
 * TODO: I18N
 * @param  {string} place place from itinerary leg
 */
export function getModeForPlace(place) {
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
  // If address is provided (i.e. for carshare station, use it)
  if (place.address) return place.address.split(",")[0];
  if (place.networks && place.vertexType === "VEHICLERENTAL") {
    // For vehicle rental pick up, do not use the place name. Rather, use
    // company name + vehicle type (e.g., SPIN E-scooter). Place name is often just
    // a UUID that has no relevance to the actual vehicle. For bikeshare, however,
    // there are often hubs or bikes that have relevant names to the user.
    const company = getCompanyForNetwork(place.networks[0], companies);
    if (company) {
      return `${company.label} ${getModeForPlace(place)}`;
    }
  }
  // Default to place name
  return place.name;
}

export function getTNCLocation(leg, type) {
  const location = leg[type];
  return `${location.lat.toFixed(5)},${location.lon.toFixed(5)}`;
}

export function calculatePhysicalActivity(itinerary) {
  let walkDuration = 0;
  let bikeDuration = 0;
  itinerary.legs.forEach(leg => {
    if (leg.mode.startsWith("WALK")) walkDuration += leg.duration;
    if (leg.mode.startsWith("BICYCLE")) bikeDuration += leg.duration;
  });
  const caloriesBurned =
    (walkDuration / 3600) * 280 + (bikeDuration / 3600) * 290;
  return {
    bikeDuration,
    caloriesBurned,
    walkDuration
  };
}

/**
 * For a given fare component (either total fare or component parts), returns
 * an object with string formatters and the fare value (in cents).
 */
export function getTransitFare(fareComponent) {
  // Default values (if fare component is not valid).
  let digits = 2;
  let transitFare = 0;
  let symbol = "$";
  if (fareComponent) {
    digits = fareComponent.currency.defaultFractionDigits;
    transitFare = fareComponent.cents;
    symbol = fareComponent.currency.symbol;
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
    dollarsToString,
    transitFare
  };
}

/**
 * For an itinerary, calculates the transit/TNC fares and returns an object with
 * these values as well as string formatters.
 */
export function calculateFares(itinerary) {
  // Extract fare total from itinerary fares.
  const fareComponent =
    itinerary.fare && itinerary.fare.fare && itinerary.fare.fare.regular;
  // Get string formatters and itinerary fare.
  const { centsToString, dollarsToString, transitFare } = getTransitFare(
    fareComponent
  );
  // Process any TNC fares
  let minTNCFare = 0;
  let maxTNCFare = 0;
  itinerary.legs.forEach(leg => {
    if (leg.mode === "CAR" && leg.hailedCar && leg.tncData) {
      const { maxCost, minCost } = leg.tncData;
      // TODO: Support non-USD
      minTNCFare += minCost;
      maxTNCFare += maxCost;
    }
  });
  return {
    centsToString,
    dollarsToString,
    maxTNCFare,
    minTNCFare,
    transitFare
  };
}

export function getTimeZoneOffset(itinerary) {
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
