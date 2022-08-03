import polyline from "@mapbox/polyline";
import {
  Company,
  Config,
  ElevationProfile,
  FlexBookingInfo,
  Itinerary,
  LatLngArray,
  Leg,
  Step
} from "@opentripplanner/types";
import turfAlong from "@turf/along";

import {
  calculateFares,
  getLegModeLabel,
  getModeForPlace,
  getPlaceName,
  getStepDirection,
  getStepInstructions,
  getStepStreetName,
  getTimeZoneOffset,
  getTransitFare
} from "./deprecated";

export {
  calculateFares,
  getLegModeLabel,
  getModeForPlace,
  getPlaceName,
  getStepDirection,
  getStepInstructions,
  getStepStreetName,
  getTimeZoneOffset,
  getTransitFare
};

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

export function getTransitModes(config: Config): string[] {
  if (!config || !config.modes || !config.modes.transitModes)
    return transitModes;

  return config.modes.transitModes.map(tm =>
    typeof tm !== "string" ? tm.mode : tm
  );
}

export function isTransit(mode: string): boolean {
  return transitModes.includes(mode) || mode === "TRANSIT";
}

/**
 * Returns true if the leg pickup rules enabled which require
 * calling ahead for the service to run. "mustPhone" is the only
 * property of boardRule which encodes this info.
 */
export function isReservationRequired(leg: Leg): boolean {
  return leg.boardRule === "mustPhone";
}
/**
 * Returns true if the leg has continuous dropoff enabled which requires
 * asking the driver to let the user off. "coordinateWithDriver" is the only
 * property of alightRule which encodes this info.
 */
export function isContinuousDropoff(leg: Leg): boolean {
  return leg.alightRule === "coordinateWithDriver";
}
/**
 * The two rules checked by the above two functions are the only values
 * returned by OTP when a leg is a flex leg.
 */
export function isFlex(leg: Leg): boolean {
  return isReservationRequired(leg) || isContinuousDropoff(leg);
}

export function isAdvanceBookingRequired(info: FlexBookingInfo): boolean {
  return info?.latestBookingTime?.daysPrior > 0;
}
export function legDropoffRequiresAdvanceBooking(leg: Leg): boolean {
  return isAdvanceBookingRequired(leg.dropOffBookingInfo);
}

export function isWalk(mode: string): boolean {
  if (!mode) return false;

  return mode === "WALK";
}

export function isBicycle(mode: string): boolean {
  if (!mode) return false;

  return mode === "BICYCLE";
}

export function isBicycleRent(mode: string): boolean {
  if (!mode) return false;

  return mode === "BICYCLE_RENT";
}

export function isCar(mode: string): boolean {
  if (!mode) return false;
  return mode.startsWith("CAR");
}

export function isMicromobility(mode: string): boolean {
  if (!mode) return false;
  return mode.startsWith("MICROMOBILITY") || mode.startsWith("SCOOTER");
}

export function isAccessMode(mode: string): boolean {
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
export function hasTransit(modesStr: string): boolean {
  return modesStr.split(",").some(mode => isTransit(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are car-based modes
 */
export function hasCar(modesStr: string): boolean {
  return modesStr.split(",").some(mode => isCar(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are bicycle-based modes
 */
export function hasBike(modesStr: string): boolean {
  return modesStr
    .split(",")
    .some(mode => isBicycle(mode) || isBicycleRent(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes are micromobility-based modes
 */
export function hasMicromobility(modesStr: string): boolean {
  return modesStr.split(",").some(mode => isMicromobility(mode));
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes is a hailing mode
 */
export function hasHail(modesStr: string): boolean {
  return modesStr.split(",").some(mode => mode.indexOf("_HAIL") > -1);
}

/**
 * @param  {string}  modesStr a comma-separated list of OTP modes
 * @return {boolean} whether any of the modes is a rental mode
 */
export function hasRental(modesStr: string): boolean {
  return modesStr.split(",").some(mode => mode.indexOf("_RENT") > -1);
}

export function getMapColor(mode: string): string {
  mode = mode || this.get("mode");
  if (mode === "WALK") return "#444";
  if (mode === "BICYCLE") return "#0073e5";
  if (mode === "SUBWAY") return "#e60000";
  if (mode === "RAIL") return "#b00";
  if (mode === "BUS") return "#080";
  if (mode === "TRAM") return "#800";
  if (mode === "FERRY") return "#008";
  if (mode === "CAR") return "#444";
  if (mode === "MICROMOBILITY" || mode === "SCOOTER") return "#f5a729";
  return "#aaa";
}

export function toSentenceCase(str: string): string {
  if (str == null) {
    return "";
  }
  str = String(str);
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

/**
 * Derive the company string based on mode and network associated with leg.
 */
export function getCompanyFromLeg(leg: Leg): string {
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
  if (
    (mode === "MICROMOBILITY" || mode === "SCOOTER") &&
    rentedVehicle &&
    from.networks
  ) {
    return from.networks[0];
  }
  return null;
}

export function getItineraryBounds(itinerary: Itinerary): LatLngArray[] {
  let coords = [];
  itinerary.legs.forEach(leg => {
    const legCoords = polyline
      .toGeoJSON(leg.legGeometry.points)
      .coordinates.map((c: number[]) => [c[1], c[0]]);
    coords = [...coords, ...legCoords];
  });
  return coords;
}

/**
 * Return a coords object that encloses the given leg's geometry.
 */
export function getLegBounds(leg: Leg): number[] {
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

export function legLocationAtDistance(leg: Leg, distance: number): number[] {
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

export function legElevationAtDistance(
  points: number[][],
  distance: number
): number {
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
export function getElevationProfile(
  steps: Step[],
  unitConversion = 1
): ElevationProfile {
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
export function getTextWidth(text: string, font = "22px Arial"): number {
  // Create custom type for function including re-used canvas object
  type GetTextWidth = typeof getTextWidth & { canvas: HTMLCanvasElement };

  // re-use canvas object for better performance
  const canvas =
    (getTextWidth as GetTextWidth).canvas ||
    ((getTextWidth as GetTextWidth).canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

/**
 * Get the configured company object for the given network string if the company
 * has been defined in the provided companies array config.
 */
export function getCompanyForNetwork(
  networkString: string,
  companies: Company[] = []
): Company {
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
export function getCompaniesLabelFromNetworks(
  networks: string[],
  companies: Company[] = []
): string {
  return networks
    .map(network => getCompanyForNetwork(network, companies))
    .filter(co => !!co)
    .map(co => co.label)
    .join("/");
}

export function getTNCLocation(leg: Leg, type: string): string {
  const location = leg[type];
  return `${location.lat.toFixed(5)},${location.lon.toFixed(5)}`;
}

export function calculatePhysicalActivity(
  itinerary: Itinerary
): {
  bikeDuration: number;
  caloriesBurned: number;
  walkDuration: number;
} {
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
 * Sources:
 * - https://www.itf-oecd.org/sites/default/files/docs/environmental-performance-new-mobility.pdf
 * - https://www.thrustcarbon.com/insights/how-to-calculate-emissions-from-a-ferry-journey
 * - https://www.itf-oecd.org/sites/default/files/life-cycle-assessment-calculations-2020.xlsx
 * Other values extrapolated.
 */
const CARBON_INTENSITY_DEFAULTS = {
  walk: 0.026,
  bicycle: 0.017,
  car: 0.162,
  tram: 0.066,
  subway: 0.066,
  rail: 0.066,
  bus: 0.09,
  ferry: 0.082,
  cable_car: 0.021,
  gondola: 0.021,
  funicular: 0.066,
  transit: 0.066,
  leg_switch: 0,
  airplane: 0.382,
  micromobility: 0.095
};

/**
 * @param  {itinerary} itinerary OTP trip itinierary
 * @param  {carbonIntensity} carbonIntensity carbon intensity by mode in grams/meter
 * @param {units} units units to be used in return value
 * @return Amount of carbon in chosen unit
 */
export function calculateEmissions(
  itinerary: Itinerary,
  carbonIntensity: Record<string, number> = {},
  units?: string
): number {
  // Apply defaults for any values that we don't have.
  const carbonIntensityWithDefaults = {
    ...CARBON_INTENSITY_DEFAULTS,
    ...carbonIntensity
  };

  // Distance is in meters, totalCarbon is in grams
  const totalCarbon =
    itinerary?.legs?.reduce((total, leg) => {
      return (
        (leg.distance * carbonIntensityWithDefaults[leg.mode.toLowerCase()] ||
          0) + total
      );
    }, 0) || 0;

  switch (units) {
    case "ounce":
      return totalCarbon / 28.35;
    case "kilogram":
      return totalCarbon / 1000;
    case "pound":
      return totalCarbon / 454;
    case "gram":
    default:
      return totalCarbon;
  }
}

export function calculateTncFares(itinerary) {
  // TODO: don't rely on deprecated methods!
  // At the moment this is safe as none of these exported variables contain strings
  const { maxTNCFare, minTNCFare, tncCurrencyCode } = calculateFares(
    itinerary,
    true
  );
  return { maxTNCFare, minTNCFare, tncCurrencyCode };
}
