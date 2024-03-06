// This is only used within stories
import cloneDeep from "lodash.clonedeep";

import { getItem } from "./storage";
import { getCurrentDate, getCurrentTime } from "./time";

/**
 * name: the default name of the parameter used for internal reference and API calls
 *
 * applicable: an optional function (accepting the current full query as a
 *   parameter) indicating whether this query parameter is applicable to the query.
 *   (Applicability is assumed if this function is not provided.)
 *
 * default: the default value for this parameter. The default can be also be a
 *  function that gets executed when accessing the default value.
 *
 * itineraryRewrite: an optional function for translating the key and/or value
 *   for ITINERARY mode only (e.g. 'to' is rewritten as 'toPlace'). Accepts the
 *   initial internal value as a function parameter.
 *
 * label: a text label for for onscreen display. May either be a text string or a
 *   function (accepting the current full query as a parameter) returning a string
 *
 * selector: the default type of UI selector to use in the form. Can be one of:
 *   - DROPDOWN: a standard drop-down menu selector
 *
 * options: an array of text/value pairs used with a dropdown selector
 *
 * TODO: validation system for rewrite functions and/or better user documentation
 * TODO: alphabetize below list
 */

// FIXME: Use for parsing URL values?
// const stringToLocation = string => {
//   const split = string.split(',')
//   return split.length === 2
//     ? {lat: split[0], lon: split[1]}
//     : {lat: null, lon: null}
// }

/**
 * Format location object as string for use in fromPlace or toPlace query param.
 */
export function formatPlace(location, alternateName) {
  if (!location) return null;
  const name =
    location.name ||
    `${alternateName ? `${alternateName} ` : ""}(${location.lat},${
      location.lon
    })`;
  // This string is not language-specific
  return `${name}::${location.lat},${location.lon}`;
}

// Load stored default query settings from local storage
const storedSettings = getItem("defaultQuery", {});

const queryParams = [
  {
    /* from - the trip origin. stored internally as a location (lat/lon/name) object  */
    name: "from",
    default: null,
    itineraryRewrite: value => ({ fromPlace: formatPlace(value) })
    // FIXME: Use for parsing URL values?
    // fromURL: stringToLocation
  },

  {
    /* to - the trip destination. stored internally as a location (lat/lon/name) object  */
    name: "to",
    default: null,
    itineraryRewrite: value => ({ toPlace: formatPlace(value) })
    // FIXME: Use for parsing URL values?
    // fromURL: stringToLocation
  },

  {
    /* date - the date of travel, in MM-DD-YYYY format */
    name: "date",
    default: getCurrentDate
  },

  {
    /* time - the arrival/departure time for an itinerary trip, in HH:mm format */
    name: "time",
    default: getCurrentTime
  },

  {
    /* departArrive - whether this is a depart-at, arrive-by, or leave-now trip */
    name: "departArrive",
    default: "NOW",
    itineraryRewrite: value => ({ arriveBy: value === "ARRIVE" })
  },

  {
    /* mode - the allowed modes for a trip, as a comma-separated list */
    name: "mode",
    default: "WALK,TRANSIT" // TODO: make this dependent on routingType?
  },

  {
    /* companies -- tnc companies to query */
    name: "companies"
  },
  {
    name: "bannedRoutes"
  },
  {
    name: "preferredRoutes"
  }
];
// Iterate over stored settings and update query param defaults.
// FIXME: this does not get updated if the user defaults are cleared
queryParams.forEach(param => {
  if (param.name in storedSettings) {
    param.default = storedSettings[param.name];
    param.userDefaultOverride = true;
  }
});

export default queryParams;

/**
 * You can customize the queryParams labels and options, and labels and values for each option.
 * @param customizations The optional customizations to apply: an object whose fields
 *                       correspond to the items in queryParams with the corresponding name,
 *                       the value for those fields being an object which fields (label, options...)
 *                       will override the originals.
 *                       Example:
 *                         {
 *                           // Matches the name param
 *                           maxWalkDistance: {
 *                             // Any fields that should be overridden go here
 *                             options: [
 *                               // ...new options
 *                             ],
 *                             default: 500,
 *                             label: "max walk dist"
 *                           }
 *                         }
 * @returns A copy of the default queryParams that has the given customizations applied.
 *          If no customizations parameter is provided, returns the queryParams object itself.
 */
export function getCustomQueryParams(customizations) {
  if (!customizations) return queryParams;

  const clonedParams = cloneDeep(queryParams);
  Object.keys(customizations).forEach(k => {
    // Merge fields into the cloned object
    const paramIndex = clonedParams.findIndex(param => param.name === k);
    if (paramIndex !== -1) {
      clonedParams[paramIndex] = {
        ...clonedParams[paramIndex],
        ...customizations[k]
      };
    }
  });
  return clonedParams;
}
