import polyline from "@mapbox/polyline";
import {
  Company,
  Config,
  ElevationProfile,
  ElevationProfileComponent,
  FlexBookingInfo,
  ItineraryOnlyLegsRequired,
  LatLngArray,
  Leg,
  MassUnitOption,
  Money,
  Place,
  Step,
  Stop,
  TncFare
} from "@opentripplanner/types";
import turfAlong from "@turf/along";

// All OTP transit modes
export const transitModes = [
  "TRAM",
  "TROLLEYBUS",
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
 * property which encodes this info.
 */
export function isReservationRequired(leg: Leg): boolean {
  return leg.boardRule === "mustPhone" || leg.alightRule === "mustPhone";
}
/**
 * Returns true if a user must ask the driver to let the user off
 * or if the user must flag the driver down for pickup.
 * "coordinateWithDriver" in board/alight rule encodes this info.
 */
export function isCoordinationRequired(leg: Leg): boolean {
  return (
    leg.boardRule === "coordinateWithDriver" ||
    leg.alightRule === "coordinateWithDriver"
  );
}
/**
 * The two rules checked by the above two functions are the only values
 * returned by OTP when a leg is a flex leg.
 */
export function isFlex(leg: Leg): boolean {
  return isReservationRequired(leg) || isCoordinationRequired(leg);
}

export function isAdvanceBookingRequired(info: FlexBookingInfo): boolean {
  return info?.latestBookingTime?.daysPrior > 0;
}
export function legDropoffRequiresAdvanceBooking(leg: Leg): boolean {
  return isAdvanceBookingRequired(leg.dropOffBookingInfo);
}

export function isRideshareLeg(leg: Leg): boolean {
  return !!leg.rideHailingEstimate?.provider?.id;
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
  if (mode === "TROLLEYBUS") return "#080";
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
  const {
    from,
    mode,
    rentedBike,
    rentedCar,
    rentedVehicle,
    rideHailingEstimate
  } = leg;
  if (mode === "CAR" && rentedCar) {
    return from.networks[0];
  }
  if (mode === "CAR" && rideHailingEstimate) {
    return rideHailingEstimate.provider.id;
  }
  if (mode === "BICYCLE" && rentedBike && from.networks) {
    return from.networks[0];
  }
  if (from.rentalVehicle) {
    return from.rentalVehicle.network;
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

export function getItineraryBounds(
  itinerary: ItineraryOnlyLegsRequired
): LatLngArray[] {
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
export function getLegBounds(leg: Leg): number[][] {
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
      // compute & return interpolated elevation value
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

export function mapOldElevationComponentToNew(oldElev: {
  first: number;
  second: number;
}): ElevationProfileComponent {
  return {
    distance: oldElev.first,
    elevation: oldElev.second
  };
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
  let previous: ElevationProfileComponent | null = null;
  const points = [];
  steps.forEach(step => {
    // Support for old REST response data (in step.elevation)
    const stepElevationProfile =
      step.elevationProfile ||
      (Array.isArray(step.elevation) &&
        step.elevation?.map<ElevationProfileComponent>(
          mapOldElevationComponentToNew
        ));

    if (!stepElevationProfile || stepElevationProfile.length === 0) {
      traversed += step.distance;
      return;
    }
    for (let i = 0; i < stepElevationProfile.length; i++) {
      const elev = stepElevationProfile[i];
      if (previous) {
        const diff = (elev.elevation - previous.elevation) * unitConversion;
        if (diff > 0) gain += diff;
        else loss += diff;
      }
      if (i === 0 && elev.distance !== 0) {
        // console.warn(`No elevation data available for step ${stepIndex}-${i} at beginning of segment`, elev)
      }
      const convertedElevation = elev.elevation * unitConversion;
      if (convertedElevation < minElev) minElev = convertedElevation;
      if (convertedElevation > maxElev) maxElev = convertedElevation;
      points.push([traversed + elev.distance, elev.elevation]);
      // Insert "filler" point if the last point in elevation profile does not
      // reach the full distance of the step.
      if (
        i === stepElevationProfile.length - 1 &&
        elev.distance !== step.distance
      ) {
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
  // Create custom type for function including reused canvas object
  type GetTextWidth = typeof getTextWidth & { canvas: HTMLCanvasElement };

  // reuse canvas object for better performance
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
  networks: string[] | string,
  companies: Company[] = []
): string {
  return (Array.isArray(networks) ? networks : [networks])
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
  itinerary: ItineraryOnlyLegsRequired
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
 * For an itinerary, calculates the TNC fares and returns an object with
 * these values and currency info.
 * It is assumed that the same currency is used for all TNC legs.
 */
export function calculateTncFares(
  itinerary: ItineraryOnlyLegsRequired
): TncFare {
  return itinerary.legs
    .filter(leg => leg.mode === "CAR" && leg.rideHailingEstimate)
    .reduce(
      ({ maxTNCFare, minTNCFare }, { rideHailingEstimate }) => {
        const { minPrice, maxPrice } = rideHailingEstimate;
        return {
          // Assumes a single currency for entire itinerary.
          currencyCode: minPrice.currency.code,
          maxTNCFare: maxTNCFare + maxPrice.amount,
          minTNCFare: minTNCFare + minPrice.amount
        };
      },
      {
        currencyCode: null,
        maxTNCFare: 0,
        minTNCFare: 0
      }
    );
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
  trolleybus: 0.066,
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
 * @param {itinerary} itinerary OTP trip itinierary, only legs is required.
 * @param {carbonIntensity} carbonIntensity carbon intensity by mode in grams/meter
 * @param {units} units units to be used in return value
 * @return Amount of carbon in chosen unit
 */
export function calculateEmissions(
  // This type makes all the properties from Itinerary optional except legs.
  itinerary: ItineraryOnlyLegsRequired,
  carbonIntensity: Record<string, number> = {},
  units?: MassUnitOption
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

/**
 * Returns the user-facing stop id to display for a stop or place, using the following priority:
 * 1. stop code,
 * 2. stop id without the agency id portion, if stop id contains an agency portion,
 * 3. stop id, whether null or not (this is the fallback case).
 */
export function getDisplayedStopId(placeOrStop: Place | Stop): string {
  let stopId;
  let stopCode;
  if ("stopId" in placeOrStop) {
    ({ stopCode, stopId } = placeOrStop);
  } else if ("id" in placeOrStop) {
    ({ code: stopCode, id: stopId } = placeOrStop);
  }
  return stopCode || stopId?.split(":")[1] || stopId;
}

/**
 * Extracts useful data from the fare products on a leg, such as the leg cost and transfer info.
 * @param leg Leg with fare products (must have used getLegsWithFares)
 * @param category Rider category
 * @param container Fare container (cash, electronic)
 * @returns Object containing price as well as the transfer discount amount, if a transfer was used.
 */
export function getLegCost(
  leg: Leg,
  mediumId: string | null,
  riderCategoryId: string | null
): {
  price?: Money;
  transferAmount?: Money | undefined;
  productUseId?: string;
} {
  if (!leg.fareProducts) return { price: undefined };
  const relevantFareProducts = leg.fareProducts.filter(({ product }) => {
    // riderCategory and medium can be specifically defined as null to handle
    // generic GTFS based fares from OTP when there is no fare model
    return (
      (product.riderCategory === null ? null : product.riderCategory.id) ===
        riderCategoryId &&
      (product.medium === null ? null : product.medium.id) === mediumId
    );
  });

  // Custom fare models return "rideCost", generic GTFS fares return "regular"
  const totalCostProduct = relevantFareProducts.find(
    fp => fp.product.name === "rideCost" || fp.product.name === "regular"
  );
  const transferFareProduct = relevantFareProducts.find(
    fp => fp.product.name === "transfer"
  );

  return {
    price: totalCostProduct?.product.price,
    transferAmount: transferFareProduct?.product.price,
    productUseId: totalCostProduct?.id
  };
}

/**
 * Returns the total itinerary cost for a given set of legs.
 * @param legs Itinerary legs with fare products (must have used getLegsWithFares)
 * @param category Rider category (youth, regular, senior)
 * @param container Fare container (cash, electronic)
 * @returns Money object for the total itinerary cost.
 */
export function getItineraryCost(
  legs: Leg[],
  mediumId: string | null,
  riderCategoryId: string | null
): Money | undefined {
  const legCosts = legs
    // Only legs with fares (no walking legs)
    .filter(leg => leg.fareProducts?.length > 0)
    // Get the leg cost object of each leg
    .map(leg => getLegCost(leg, mediumId, riderCategoryId))
    .filter(cost => cost.price !== undefined)
    // Filter out duplicate use IDs
    // One fare product can be used on multiple legs,
    // and we don't want to count it more than once.
    .reduce<{ productUseId: string; price: Money }[]>((prev, cur) => {
      if (!prev.some(p => p.productUseId === cur.productUseId)) {
        prev.push({ productUseId: cur.productUseId, price: cur.price });
      }
      return prev;
    }, [])
    .map(productUse => productUse.price);

  if (legCosts.length === 0) return undefined;
  // Calculate the total
  return legCosts.reduce<Money>(
    (prev, cur) => ({
      amount: prev.amount + cur?.amount || 0,
      currency: prev.currency ?? cur?.currency
    }),
    { amount: 0, currency: null }
  );
}

const pickupDropoffTypeToOtp1 = otp2Type => {
  switch (otp2Type) {
    case "COORDINATE_WITH_DRIVER":
      return "coordinateWithDriver";
    case "CALL_AGENCY":
      return "mustPhone";
    case "SCHEDULED":
      return "scheduled";
    case "NONE":
      return "none";
    default:
      return null;
  }
};

export const convertGraphQLResponseToLegacy = (leg: any): any => ({
  ...leg,
  agencyBrandingUrl: leg.agency?.url,
  agencyId: leg.agency?.id,
  agencyName: leg.agency?.name,
  agencyUrl: leg.agency?.url,
  alightRule: pickupDropoffTypeToOtp1(leg.dropoffType),
  boardRule: pickupDropoffTypeToOtp1(leg.pickupType),
  dropOffBookingInfo: {
    latestBookingTime: leg.dropOffBookingInfo
  },
  from: {
    ...leg.from,
    stopCode: leg.from.stop?.code,
    stopId: leg.from.stop?.gtfsId
  },
  route: leg.route?.shortName,
  routeColor: leg.route?.color,
  routeId: leg.route?.gtfsId,
  routeLongName: leg.route?.longName,
  routeShortName: leg.route?.shortName,
  routeTextColor: leg.route?.textColor,
  to: {
    ...leg.to,
    stopCode: leg.to.stop?.code,
    stopId: leg.to.stop?.gtfsId
  },
  tripHeadsign: leg.trip?.tripHeadsign,
  tripId: leg.trip?.gtfsId
});

/** Extracts the route number for a leg returned from OTP1 or OTP2. */
export const getLegRouteShortName = (
  leg: Pick<Leg, "route" | "routeShortName">
): string | null => {
  const { route, routeShortName } = leg;
  // typeof route === "object" denotes newer OTP2 responses. routeShortName and route as string is OTP1.
  return typeof route === "object"
    ? route?.shortName
    : routeShortName || (route as string);
};

/** Extract the route long name for a leg returned from OTP1 or OTP2. */
export const getLegRouteLongName = (
  leg: Pick<Leg, "route" | "routeLongName">
): string | null => {
  const { route, routeLongName } = leg;
  // typeof route === "object" denotes newer OTP2 responses. routeLongName is OTP1.
  return typeof route === "object" ? route?.longName : routeLongName;
};

/**
 * Returns the route short name, or the route long name if no short name is provided.
 * This is happens with Seattle area streetcars and ferries.
 */
export const getLegRouteName = (
  leg: Pick<Leg, "route" | "routeLongName" | "routeShortName">
): string => {
  return getLegRouteShortName(leg) || getLegRouteLongName(leg);
};
