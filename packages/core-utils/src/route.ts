import { Leg, Route, TransitOperator } from "@opentripplanner/types";
import chroma from "chroma-js";
/**
 * Returns the transit operator (if an exact match is found) from the transit
 * operators config value. It is critical to use both the feedId and agencyId in
 * this method because it is possible in OTP for there to be a duplicate
 * agencyId in separate feeds.
 *
 * @param  {string} feedId The feedId that this transit agency belongs to
 * @param  {string} agencyId The agencyId of the transit agency
 * @param  {array} transitOperators The transitOperators list from the config
 * @return {object} The transitOperator if a match was found or null if no match
 *    was found
 */
export function getTransitOperatorFromFeedIdAndAgencyId(
  feedId: string,
  agencyId: string | number,
  transitOperators: TransitOperator[]
): TransitOperator {
  return (
    transitOperators.find(
      transitOperator =>
        transitOperator.feedId === feedId &&
        transitOperator.agencyId === agencyId
    ) || null
  );
}

/**
 * Looks up an operator from the provided leg.
 *
 * @param  {object} leg The Itinerary Leg from which to find the transit
 *    operator
 * @param  {object} transitOperators transitOperators from config.
 * @return {object} the operator if one was found or null if no match was found
 */
export function getTransitOperatorFromLeg(
  leg: Leg,
  transitOperators: TransitOperator[]
): TransitOperator {
  if (!leg.routeId || !leg.agencyId) return null;
  const feedId = leg.routeId.split(":")[0];
  return getTransitOperatorFromFeedIdAndAgencyId(
    feedId,
    leg.agencyId,
    transitOperators
  );
}

/**
 * Looks up an operator from the provided configuration given an OTP route.
 * NOTE: this assumes the use of the OTP Route model or a modified OTP
 * RouteShort model (such as the one found in the IBI fork of OTP) that also
 * returns the agencyId.
 *
 * @param  {object} route Either an OTP Route or RouteShort model
 * @param  {array} transitOperators transitOperators from config
 * @return {object} the operator if one was found or null if no match was found
 */
export function getTransitOperatorFromOtpRoute(
  route: Route,
  transitOperators: TransitOperator[]
): TransitOperator {
  if (!route.id) return null;
  const feedId = route.id.split(":")[0];
  let agencyId: string | number;
  if (route.agency) {
    // This is returned in the OTP Route model
    agencyId = route.agency.id;
  } else if (route.agencyId) {
    // This is returned in the OTP RouteShort model (such as in the IBI fork)
    agencyId = route.agencyId;
  } else {
    return null;
  }
  return getTransitOperatorFromFeedIdAndAgencyId(
    feedId,
    agencyId,
    transitOperators
  );
}

// The functions below are for enhanced route sorting functions for the route
// viewer on OTP-react-redux.
// They address route ordering issues discussed in
// https://github.com/opentripplanner/otp-react-redux/pull/123 and
// https://github.com/opentripplanner/otp-react-redux/pull/124.

/**
 * A large comparator value that can safely be used in mathematical sort
 * comparisons to place things at the end of lists
 */
const END_OF_LIST_COMPARATOR_VALUE = 999999999999;

/**
 * Returns a transit operator comparator value given a route and an optional
 * transitOperators config value. This function will do its best to handle all
 * kinds of input data as certain deployments of an implementing webapp may have
 * incomplete data and certain versions of OTP might not have a modified
 * implementation of the RouteShort model.
 *
 * @param  {object} route Either an OTP Route or RouteShort model
 * @param  {array} transitOperators transitOperators from config
 * @return {mixed} this could return a string value (the route's agency name) if
 *   the transitOperators value is not defined. Otherwise an integer will be
 *   returned.
 */
function getTransitOperatorComparatorValue(
  route: Route,
  transitOperators: TransitOperator[]
): number | string {
  // if the transitOperators is undefined or has zero length, use the route's
  // agency name as the comparator value
  if (!transitOperators || transitOperators.length === 0) {
    // OTP Route
    if (route.agency) return route.agency.name;
    // OTP RouteShort (base OTP repo or IBI fork)
    if (route.agencyName) return route.agencyName;
    // shouldn't happen as agency names will be defined
    return "zzz";
  }

  // find operator associated with route
  const transitOperator = getTransitOperatorFromOtpRoute(
    route,
    transitOperators
  );

  // if transit operator not found, return infinity
  if (!transitOperator) return END_OF_LIST_COMPARATOR_VALUE;

  // return the transit operator's sort value or END_OF_LIST_COMPARATOR_VALUE if
  // the sort value is not a number
  return typeof transitOperator.order === "number"
    ? transitOperator.order
    : END_OF_LIST_COMPARATOR_VALUE;
}

/**
 * Calculates the sort comparator value given two routes based off of the
 * route's agency and provided transitOperators config data.
 */
function makeTransitOperatorComparator(transitOperators: TransitOperator[]) {
  return (a: Route, b: Route) => {
    const aVal = getTransitOperatorComparatorValue(a, transitOperators);
    const bVal = getTransitOperatorComparatorValue(b, transitOperators);
    if (typeof aVal === "string") {
      // happens when transitOperators is undefined. Both aVal are guaranteed to
      // be strings. Make a string comparison.
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    }
    // @ts-expect-error transitOperators are defined and therefore a numeric value is guaranteed
    // to be returned
    return aVal - bVal;
  };
}

/**
 * Gets the desired sort values according to an optional getter function. If the
 * getter function is not defined, the original sort values are returned.
 */
function getSortValues(
  getterFn: (item: unknown) => unknown,
  a: unknown,
  b: unknown
) {
  let aVal: unknown;
  let bVal: unknown;
  if (typeof getterFn === "function") {
    aVal = getterFn(a);
    bVal = getterFn(b);
  } else {
    aVal = a;
    bVal = b;
  }
  return { aVal, bVal };
}

// Lookup for the sort values associated with various OTP modes.
// Note: JSDoc format not used to avoid bug in documentationjs.
// https://github.com/documentationjs/documentation/issues/372
const modeComparatorValue = {
  SUBWAY: 1,
  TRAM: 2,
  RAIL: 3,
  GONDOLA: 4,
  FERRY: 5,
  CABLE_CAR: 6,
  FUNICULAR: 7,
  BUS: 8
};

// Lookup that maps route types to the OTP mode sort values.
// Note: JSDoc format not used to avoid bug in documentationjs.
// https://github.com/documentationjs/documentation/issues/372
const routeTypeComparatorValue = {
  0: modeComparatorValue.TRAM, // - Tram, Streetcar, Light rail.
  1: modeComparatorValue.SUBWAY, // - Subway, Metro.
  2: modeComparatorValue.RAIL, // - Rail. Used for intercity or long-distance travel.
  3: modeComparatorValue.BUS, // - Bus.
  4: modeComparatorValue.FERRY, // - Ferry.
  5: modeComparatorValue.CABLE_CAR, // - Cable tram.
  6: modeComparatorValue.GONDOLA, // - Gondola, etc.
  7: modeComparatorValue.FUNICULAR, // - Funicular.
  // TODO: 11 and 12 are not a part of OTP as of 2019-02-14, but for now just
  // associate them with bus/rail.
  11: modeComparatorValue.BUS, // - Trolleybus.
  12: modeComparatorValue.RAIL // - Monorail.
};

// Gets a comparator value for a given route's type (OTP mode).
// Note: JSDoc format not used to avoid bug in documentationjs.
// ttps://github.com/documentationjs/documentation/issues/372
function getRouteTypeComparatorValue(route: Route): number {
  // For some strange reason, the short route response in OTP returns the
  // string-based modes, but the long route response returns the
  // integer route type. This attempts to account for both of those cases.
  if (!route) throw new Error(`Route is undefined. ${route}`);
  if (typeof modeComparatorValue[route.mode] !== "undefined") {
    return modeComparatorValue[route.mode];
  }
  if (typeof routeTypeComparatorValue[route.type] !== "undefined") {
    return routeTypeComparatorValue[route.type];
  }
  // Default the comparator value to a large number (placing the route at the
  // end of the list).
  // eslint-disable-next-line no-console
  console.warn("no mode/route type found for route", route);
  return END_OF_LIST_COMPARATOR_VALUE;
}

/**
 * Calculates the sort comparator value given two routes based off of route type
 * (OTP mode).
 */
function routeTypeComparator(a: Route, b: Route): number {
  return getRouteTypeComparatorValue(a) - getRouteTypeComparatorValue(b);
}

/**
 * Determines whether a value is a string that starts with an alphabetic
 * ascii character.
 */
function startsWithAlphabeticCharacter(val: unknown): boolean {
  if (typeof val === "string" && val.length > 0) {
    const firstCharCode = val.charCodeAt(0);
    return (
      (firstCharCode >= 65 && firstCharCode <= 90) ||
      (firstCharCode >= 97 && firstCharCode <= 122)
    );
  }
  return false;
}

/**
 * Sorts routes based off of whether the shortName begins with an alphabetic
 * character. Routes with shortn that do start with an alphabetic character will
 * be prioritized over those that don't.
 */
function alphabeticShortNameComparator(a: Route, b: Route): number {
  const aStartsWithAlphabeticCharacter = startsWithAlphabeticCharacter(
    a.shortName
  );
  const bStartsWithAlphabeticCharacter = startsWithAlphabeticCharacter(
    b.shortName
  );

  if (aStartsWithAlphabeticCharacter && bStartsWithAlphabeticCharacter) {
    // both start with an alphabetic character, return equivalence
    return 0;
  }
  // a does start with an alphabetic character, but b does not. Prioritize a
  if (aStartsWithAlphabeticCharacter) return -1;
  // b does start with an alphabetic character, but a does not. Prioritize b
  if (bStartsWithAlphabeticCharacter) return 1;
  // neither route has a shortName that starts with an alphabetic character.
  // Return equivalence
  return 0;
}

/**
 * Checks whether an appropriate comparison of numeric values can be made for
 * sorting purposes. If both values are not valid numbers according to the
 * isNaN check, then this function returns undefined which indicates that a
 * secondary sorting criteria should be used instead. If one value is valid and
 * the other is not, then the valid value will be given sorting priority. If
 * both values are valid numbers, the difference is obtained as the sort value.
 *
 * An optional argument can be provided which will be used to obtain the
 * comparison value from the comparison function arguments.
 *
 * IMPORTANT: the comparison values must be numeric values or at least be
 * attempted to be converted to numeric values! If one of the arguments is
 * something crazy like an empty string, unexpected behavior will occur because
 * JavaScript.
 *
 * @param  {function} [objGetterFn] An optional function to obtain the
 *  comparison value from the comparator function arguments
 */
export function makeNumericValueComparator(
  objGetterFn?: (item: Route) => number
) {
  /* Note: Using the global version of isNaN (the Number version behaves differently. */
  /* eslint-disable no-restricted-globals */
  return (a: number, b: number): number => {
    const { aVal, bVal } = getSortValues(objGetterFn, a, b);
    if (typeof aVal !== "number" || typeof bVal !== "number") return 0;

    // if both values aren't valid numbers, use the next sort criteria
    if (isNaN(aVal) && isNaN(bVal)) return 0;
    // b is a valid number, b gets priority
    if (isNaN(aVal)) return 1;
    // a is a valid number, a gets priority
    if (isNaN(bVal)) return -1;
    // a and b are valid numbers, return the sort value
    return aVal - bVal;
  };
}

/**
 * Create a comparator function that compares string values. The comparison
 * values feed to the sort comparator function are assumed to be objects that
 * will have either undefined, null or string values at the given key. If one
 * object has undefined, null or an empty string, but the other does have a
 * string with length > 0, then that string will get priority.
 *
 * @param  {function} [objGetterFn] An optional function to obtain the
 *  comparison value from the comparator function arguments
 */
export function makeStringValueComparator(
  objGetterFn?: (item: Route) => string
) {
  return (a: string, b: string): number => {
    const { aVal, bVal } = getSortValues(objGetterFn, a, b);
    // both a and b are uncomparable strings, return equivalent value
    if (!aVal && !bVal) return 0;
    // a is not a comparable string, b gets priority
    if (!aVal) return 1;
    // b is not a comparable string, a gets priority
    if (!bVal) return -1;
    // a and b are comparable strings, return the sort value
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

/**
 * OpenTripPlanner sets the routeSortOrder to -999 by default. So, if that value
 * is encountered, assume that it actually means that the routeSortOrder is not
 * set in the GTFS.
 *
 * See https://github.com/opentripplanner/OpenTripPlanner/issues/2938
 * Also see https://github.com/opentripplanner/otp-react-redux/issues/122
 */
function getRouteSortOrderValue(val: number): number {
  return val === -999 ? undefined : val;
}

/**
 * Create a multi-criteria sort comparator function composed of other sort
 * comparator functions. Each comparator function will be ran in the order given
 * until a non-zero comparison value is obtained which is then immediately
 * returned. If all comparison functions return equivalence, then the values
 * are assumed to be equivalent.
 */
function makeMultiCriteriaSort(
  ...criteria: ((a: unknown, b: unknown) => number)[]
) {
  return (a: number, b: number): number => {
    for (let i = 0; i < criteria.length; i++) {
      const curCriteriaComparatorValue = criteria[i](a, b);
      // if the comparison objects are not equivalent, return the value obtained
      // in this current criteria comparison
      if (curCriteriaComparatorValue !== 0) {
        return curCriteriaComparatorValue;
      }
    }
    return 0;
  };
}

/**
 * Creates a sort comparator function to compares routes for the purposes of
 * sorting and displaying in a user interface. This takes in a single optional
 * argument which should be a list of transitOperators as defined in the config
 * file. Due to GTFS feeds having varying levels of data quality, a multi-
 * criteria sort is needed to account for various differences. The criteria
 * included here are each applied to the routes in the order listed. If a given
 * sort criterion yields equivalence (e.g., two routes have the short name
 * "20"), the comparator falls back onto the next sort criterion (e.g., long
 * name). The sort operates on the following values (in order):
 *
 *  1. Transit Operator. The transit operator will be attempted to be obtained
 *    for each route. If no argument is provided when creating this comparator
 *    function, then routes will be sorted by their agency's name. If an
 *    argument is provided and a match is found based off of the route's feed_id
 *    and agency_id and a transitOperator's feed_id and agency_id, then the
 *    field transitOperator.order will be used as the comparator value as long
 *    as it is numeric. If it is not numeric, a value is returned indicating
 *    that this transit operator should be placed at the end of the list.
 *  2. sortOrder. Routes that do not have a valid sortOrder will be placed
 *    beneath those that do.
 *  3. route type (OTP mode). See routeTypeComparator code for prioritization of
 *    route types.
 *  4. shortNames that begin with alphabetic characters. shortNames that do not
 *    start with alphabetic characters will be place beneath those that do.
 *  5. shortName as integer. shortNames that cannot be parsed as integers will
 *    be placed beneath those that are valid.
 *  6. shortName as string. Routes without shortNames will be placed beneath
 *    those with shortNames.
 *  7. longName as string.
 */
export function makeRouteComparator(
  transitOperators: TransitOperator[]
): (a: number, b: number) => number {
  return makeMultiCriteriaSort(
    makeTransitOperatorComparator(transitOperators),
    makeNumericValueComparator(obj => getRouteSortOrderValue(obj.sortOrder)),
    routeTypeComparator,
    alphabeticShortNameComparator,
    makeNumericValueComparator(obj => parseInt(obj.shortName, 10)),
    makeStringValueComparator(obj => obj.shortName),
    makeStringValueComparator(obj => obj.longName)
  );
}

/**
 * Tests if a pair of colors is readable. If it is, that readable color is returned.
 * If it is not, a more appropriate alternative is returned.
 *
 * Uses algorithm based on combined luminance. Values have been derived from
 * looking at real agency color pairings. These pairings are difficult to
 * generate for, as some colors see both white and black used by different agencies.
 *
 * This method therefore can accept multiple colors (including black and white) for the same background color.
 *
 * @param backgroundColor     A hex string, usually the "routeColor"
 * @param proposedTextColor   A hex string, usually the "routeTextColor"
 */
export function getMostReadableTextColor(
  backgroundColor: string,
  proposedTextColor?: string
): string {
  // Sometimes input will defy the method signature. Therefore we need extra fallbacks
  if (!backgroundColor) backgroundColor = "#333333";
  if (!proposedTextColor) proposedTextColor = "#ffffff";

  if (!backgroundColor.startsWith("#")) {
    backgroundColor = `#${backgroundColor}`;
  }
  if (!proposedTextColor.startsWith("#")) {
    proposedTextColor = `#${proposedTextColor}`;
  }

  // Check if proposed color is readable
  // Luminance thresholds have been selected based on actual transit agency colors
  const fgLuminance = chroma(proposedTextColor).luminance();
  const bgLuminance = chroma(backgroundColor).luminance();
  if (
    bgLuminance + fgLuminance < 1.41 &&
    bgLuminance + fgLuminance > 0.25 &&
    Math.abs(bgLuminance - fgLuminance) > 0.2
  ) {
    return proposedTextColor;
  }

  // Return black or white based on luminance of background color
  // When generating colors, white is preferred.
  return chroma(backgroundColor).luminance() < 0.4 ? "#ffffff" : "#000000";
}
