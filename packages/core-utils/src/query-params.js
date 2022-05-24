// TODO: Remove this entire file, as it is deprecated in favor of i18n-queryParams within
// the SettingsSelector package

// This is only used within stories
import cloneDeep from "lodash.clonedeep";
import React from "react";
import { Wheelchair } from "@styled-icons/foundation/Wheelchair";

import {
  isTransit,
  isAccessMode,
  isCar,
  hasTransit,
  hasBike,
  hasMicromobility
} from "./itinerary";
import { getItem } from "./storage";
import { getCurrentDate, getCurrentTime } from "./time";

/**
 * name: the default name of the parameter used for internal reference and API calls
 *
 * routingTypes: array of routing type(s) (ITINERARY, PROFILE, or both) this param applies to
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
 * profileRewrite: an optional function for translating the value for PROFILE mode
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
    routingTypes: ["ITINERARY", "PROFILE"],
    default: null,
    itineraryRewrite: value => ({ fromPlace: formatPlace(value) }),
    profileRewrite: value => ({ from: { lat: value.lat, lon: value.lon } })
    // FIXME: Use for parsing URL values?
    // fromURL: stringToLocation
  },

  {
    /* to - the trip destination. stored internally as a location (lat/lon/name) object  */
    name: "to",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: null,
    itineraryRewrite: value => ({ toPlace: formatPlace(value) }),
    profileRewrite: value => ({ to: { lat: value.lat, lon: value.lon } })
    // FIXME: Use for parsing URL values?
    // fromURL: stringToLocation
  },

  {
    /* date - the date of travel, in MM-DD-YYYY format */
    name: "date",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: getCurrentDate
  },

  {
    /* time - the arrival/departure time for an itinerary trip, in HH:mm format */
    name: "time",
    routingTypes: ["ITINERARY"],
    default: getCurrentTime
  },

  {
    /* departArrive - whether this is a depart-at, arrive-by, or leave-now trip */
    name: "departArrive",
    routingTypes: ["ITINERARY"],
    default: "NOW",
    itineraryRewrite: value => ({ arriveBy: value === "ARRIVE" })
  },

  {
    /* startTime - the start time for a profile trip, in HH:mm format */
    name: "startTime",
    routingTypes: ["PROFILE"],
    default: "07:00"
  },

  {
    /* endTime - the end time for a profile trip, in HH:mm format */
    name: "endTime",
    routingTypes: ["PROFILE"],
    default: "09:00"
  },

  {
    /* mode - the allowed modes for a trip, as a comma-separated list */
    name: "mode",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: "WALK,TRANSIT", // TODO: make this dependent on routingType?
    profileRewrite: value => {
      const accessModes = [];
      const directModes = [];
      const transitModes = [];

      if (value && value.length > 0) {
        value.split(",").forEach(m => {
          if (isTransit(m)) transitModes.push(m);
          if (isAccessMode(m)) {
            accessModes.push(m);
            // TODO: make configurable whether direct-driving is considered
            if (!isCar(m)) directModes.push(m);
          }
        });
      }

      return { accessModes, directModes, transitModes };
    }
  },

  {
    /* showIntermediateStops - whether response should include intermediate stops for transit legs */
    name: "showIntermediateStops",
    routingTypes: ["ITINERARY"],
    default: true
  },

  {
    /* maxWalkDistance - the maximum distance in meters the user will walk to transit. */
    name: "maxWalkDistance",
    routingTypes: ["ITINERARY"],
    applicable: query =>
      /* Since this query variable isn't in this list, it's not included in the generated query
       * It does however allow us to determine if we should show the OTP1 max walk distance
       * dropdown or the OTP2 walk reluctance slider
       */
      !query.otp2 &&
      query.mode &&
      hasTransit(query.mode) &&
      query.mode.indexOf("WALK") !== -1,
    default: 1609, // 1 mi.
    selector: "DROPDOWN",
    label: "Maximum Walk",
    options: [
      {
        text: "1/10 mile",
        value: 160.9
      },
      {
        text: "1/4 mile",
        value: 402.3
      },
      {
        text: "1/2 mile",
        value: 804.7
      },
      {
        text: "3/4 mile",
        value: 1207
      },
      {
        text: "1 mile",
        value: 1609
      },
      {
        text: "2 miles",
        value: 3219
      },
      {
        text: "5 miles",
        value: 8047
      }
    ]
  },

  {
    /* maxBikeDistance - the maximum distance in meters the user will bike. Not
     * actually an OTP parameter (maxWalkDistance doubles for biking) but we
     * store it separately internally in order to allow different default values,
     * options, etc.  Translated to 'maxWalkDistance' via the rewrite function.
     */
    name: "maxBikeDistance",
    routingTypes: ["ITINERARY"],
    applicable: query =>
      query.mode &&
      hasTransit(query.mode) &&
      query.mode.indexOf("BICYCLE") !== -1,
    default: 4828, // 3 mi.
    selector: "DROPDOWN",
    label: "Maximum Bike",
    options: [
      {
        text: "1/4 mile",
        value: 402.3
      },
      {
        text: "1/2 mile",
        value: 804.7
      },
      {
        text: "3/4 mile",
        value: 1207
      },
      {
        text: "1 mile",
        value: 1609
      },
      {
        text: "2 miles",
        value: 3219
      },
      {
        text: "3 miles",
        value: 4828
      },
      {
        text: "5 miles",
        value: 8047
      },
      {
        text: "10 miles",
        value: 16093
      },
      {
        text: "20 miles",
        value: 32187
      },
      {
        text: "30 miles",
        value: 48280
      }
    ],
    itineraryRewrite: value => ({
      maxWalkDistance: value,
      // ensures that the value is repopulated when loaded from URL params
      maxBikeDistance: value
    })
  },

  {
    /* optimize -- how to optimize a trip (non-bike, non-micromobility trips) */
    name: "optimize",
    // This parameter doesn't seem to do anything
    applicable: () => false,
    routingTypes: ["ITINERARY"],
    default: "QUICK",
    selector: "DROPDOWN",
    label: "Optimize for",
    options: [
      {
        text: "Speed",
        value: "QUICK"
      },
      {
        text: "Fewest Transfers",
        value: "TRANSFERS"
      }
    ]
  },

  {
    /* optimizeBike -- how to optimize an bike-based trip */
    name: "optimizeBike",
    applicable: query => !query.otp2 && hasBike(query.mode),
    routingTypes: ["ITINERARY"],
    default: "SAFE",
    selector: "DROPDOWN",
    label: "Optimize for",
    options: () => {
      const opts = [
        {
          text: "Speed",
          value: "QUICK"
        },
        {
          text: "Bike-Friendly Trip",
          value: "SAFE"
        },
        {
          text: "Flat Trip",
          value: "FLAT"
        }
      ];

      return opts;
    },
    itineraryRewrite: value => ({ optimize: value })
  },

  {
    /* maxWalkTime -- the maximum time the user will spend walking in minutes */
    name: "maxWalkTime",
    routingTypes: ["PROFILE"],
    default: 15,
    selector: "DROPDOWN",
    label: "Max Walk Time",
    applicable: query =>
      query.mode && hasTransit(query.mode) && query.mode.indexOf("WALK") !== -1,
    options: [
      {
        text: "5 minutes",
        value: 5
      },
      {
        text: "10 minutes",
        value: 10
      },
      {
        text: "15 minutes",
        value: 15
      },
      {
        text: "20 minutes",
        value: 20
      },
      {
        text: "30 minutes",
        value: 30
      },
      {
        text: "45 minutes",
        value: 45
      },
      {
        text: "1 hour",
        value: 60
      }
    ]
  },

  {
    /* walkSpeed -- the user's walking speed in m/s */
    name: "walkSpeed",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: 1.34,
    selector: "DROPDOWN",
    label: "Walk Speed",
    applicable: query => query.mode && query.mode.indexOf("WALK") !== -1,
    options: [
      {
        text: "2 MPH",
        value: 0.89
      },
      {
        text: "3 MPH",
        value: 1.34
      },
      {
        text: "4 MPH",
        value: 1.79
      }
    ]
  },

  {
    name: "walkReluctance",
    routingTypes: ["ITINERARY", "PROFILE"],
    selector: "SLIDER",
    low: 1,
    high: 10,
    step: 0.5,
    label: "walk reluctance",
    labelLow: "More Walking",
    labelHigh: "More Transit",
    applicable: query =>
      /* Since this query variable isn't in this list, it's not included in the generated query
       * It does however allow us to determine if we should show the OTP1 max walk distance
       * dropdown or the OTP2 walk reluctance slider
       */
      !!query.otp2 && query.mode && query.mode.indexOf("WALK") !== -1
  },
  {
    /* maxBikeTime -- the maximum time the user will spend biking in minutes */
    name: "maxBikeTime",
    routingTypes: ["PROFILE"],
    default: 20,
    selector: "DROPDOWN",
    label: "Max Bike Time",
    applicable: query =>
      query.mode &&
      hasTransit(query.mode) &&
      query.mode.indexOf("BICYCLE") !== -1,
    options: [
      {
        text: "5 minutes",
        value: 5
      },
      {
        text: "10 minutes",
        value: 10
      },
      {
        text: "15 minutes",
        value: 15
      },
      {
        text: "20 minutes",
        value: 20
      },
      {
        text: "30 minutes",
        value: 30
      },
      {
        text: "45 minutes",
        value: 45
      },
      {
        text: "1 hour",
        value: 60
      }
    ]
  },

  {
    /* bikeSpeed -- the user's bikeSpeed speed in m/s */
    name: "bikeSpeed",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: 3.58,
    selector: "DROPDOWN",
    label: "Bicycle Speed",
    applicable: query => query.mode && query.mode.indexOf("BICYCLE") !== -1,
    options: [
      {
        text: "6 MPH",
        value: 2.68
      },
      {
        text: "8 MPH",
        value: 3.58
      },
      {
        text: "10 MPH",
        value: 4.47
      },
      {
        text: "12 MPH",
        value: 5.36
      }
    ]
  },

  {
    /* maxEScooterDistance - the maximum distance in meters the user will ride
     * an E-scooter. Not actually an OTP parameter (maxWalkDistance doubles for
     * any non-transit mode except for car) but we store it separately
     * internally in order to allow different default values, options, etc.
     * Translated to 'maxWalkDistance' via the rewrite function.
     */
    name: "maxEScooterDistance",
    routingTypes: ["ITINERARY"],
    applicable: query =>
      query.mode && hasTransit(query.mode) && hasMicromobility(query.mode),
    default: 4828, // 3 mi.
    selector: "DROPDOWN",
    label: "Maximum E-scooter Distance",
    options: [
      {
        text: "1/4 mile",
        value: 402.3
      },
      {
        text: "1/2 mile",
        value: 804.7
      },
      {
        text: "3/4 mile",
        value: 1207
      },
      {
        text: "1 mile",
        value: 1609
      },
      {
        text: "2 miles",
        value: 3219
      },
      {
        text: "3 miles",
        value: 4828
      },
      {
        text: "5 miles",
        value: 8047
      },
      {
        text: "10 miles",
        value: 16093
      },
      {
        text: "20 miles",
        value: 32187
      },
      {
        text: "30 miles",
        value: 48280
      }
    ],
    itineraryRewrite: value => ({
      maxWalkDistance: value,
      // ensures that the value is repopulated when loaded from URL params
      maxEScooterDistance: value
    })
  },

  {
    /* bikeSpeed -- the user's bikeSpeed speed in m/s */
    name: "watts",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: 250,
    selector: "DROPDOWN",
    label: "E-scooter Power",
    // this configuration should only be allowed for personal E-scooters as these
    // settings will be defined by the vehicle type of an E-scooter being rented
    applicable: query =>
      query.mode &&
      query.mode.indexOf("MICROMOBILITY") !== -1 &&
      query.mode.indexOf("MICROMOBILITY_RENT") === -1 &&
      query.mode.indexOf("SCOOTER") === -1,
    options: [
      {
        text: "Kid's hoverboard (6mph)",
        value: 125
      },
      {
        text: "Entry-level scooter (11mph)",
        value: 250
      },
      {
        text: "Robust E-scooter (18mph)",
        value: 500
      },
      {
        text: "Powerful E-scooter (24mph)",
        value: 1500
      }
    ],
    // rewrite a few other values to add some baseline assumptions about the
    // vehicle
    itineraryRewrite: value => {
      const watts = value;
      // the maximum cruising and downhill speed. Units in m/s
      let maximumMicromobilitySpeed;
      let weight;
      // see https://en.wikipedia.org/wiki/Human_body_weight#Average_weight_around_the_world
      // estimate is for an average North American human with clothes and stuff
      // units are in kg
      const TYPICAL_RIDER_WEIGHT = 90;
      switch (watts) {
        case 125:
          // exemplar: Swagtron Turbo 5 hoverboard (https://swagtron.com/product/recertified-swagtron-turbo-five-hoverboard-classic/)
          maximumMicromobilitySpeed = 2.8; // ~= 6mph
          weight = TYPICAL_RIDER_WEIGHT + 9;
          break;
        case 250:
          // exemplar: Xiaomi M365 (https://www.gearbest.com/skateboard/pp_596618.html)
          maximumMicromobilitySpeed = 5; // ~= 11.5mph
          weight = TYPICAL_RIDER_WEIGHT + 12.5;
          break;
        case 500:
          // exemplar: Razor EcoSmart Metro (https://www.amazon.com/Razor-EcoSmart-Metro-Electric-Scooter/dp/B002ZDAEIS?SubscriptionId=AKIAJMXJ2YFJTEDLQMUQ&tag=digitren08-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B002ZDAEIS&ascsubtag=15599460143449ocb)
          maximumMicromobilitySpeed = 8; // ~= 18mph
          weight = TYPICAL_RIDER_WEIGHT + 30;
          break;
        case 1000:
          // exemplar: Boosted Rev (https://boostedboards.com/vehicles/scooters/boosted-rev)
          maximumMicromobilitySpeed = 11; // ~= 24mph
          weight = TYPICAL_RIDER_WEIGHT + 21;
          break;
        default:
          break;
      }
      return { maximumMicromobilitySpeed, watts, weight };
    }
  },

  {
    /* ignoreRealtimeUpdates -- if true, do not use realtime updates in routing */
    name: "ignoreRealtimeUpdates",
    routingTypes: ["ITINERARY"],
    default: false
  },

  {
    /* companies -- tnc companies to query */
    name: "companies",
    routingTypes: ["ITINERARY"]
  },

  {
    /* wheelchair -- whether the user requires a wheelchair-accessible trip */
    name: "wheelchair",
    routingTypes: ["ITINERARY", "PROFILE"],
    default: false,
    selector: "CHECKBOX",
    label: "Prefer Wheelchair Accessible Routes",
    icon: <Wheelchair />,
    applicable: (query, config) => {
      if (!query.mode || !config.modes) return false;
      const configModes = (config.modes.accessModes || []).concat(
        config.modes.transitModes || []
      );
      return query.mode.split(",").some(mode => {
        const configMode = configModes.find(m => m.mode === mode);
        if (!configMode || !configMode.showWheelchairSetting) return false;
        if (
          configMode.company &&
          (!query.companies ||
            !query.companies.split(",").includes(configMode.company))
        )
          return false;
        return true;
      });
    }
  },

  {
    name: "bannedRoutes",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "numItineraries",
    routingTypes: ["ITINERARY"],
    default: 3
  },
  {
    name: "intermediatePlaces",
    default: [],
    routingTypes: ["ITINERARY"],
    itineraryRewrite: places =>
      Array.isArray(places) && places.length > 0
        ? {
            intermediatePlaces: places.map(place => formatPlace(place))
          }
        : undefined
  },
  {
    // Time penalty in seconds the requester is willing to accept in order to
    // complete journey on preferred route. I.e., number of seconds that we are
    // willing to wait for the preferred route.
    name: "otherThanPreferredRoutesPenalty",
    default: 15 * 60, // 15 minutes
    routingTypes: ["ITINERARY"]
  },
  // Below are less commonly used query params included so that in case they are
  // passed in a query parameter they do not get filtered out from the ultimate
  // API request.
  {
    name: "preferredRoutes",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "maxPreTransitTime",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "waitReluctance",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "driveDistanceReluctance",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "driveTimeReluctance",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "waitAtBeginningFactor",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bikeSwitchTime",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bikeSwitchCost",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "minTransferTime",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "preferredAgencies",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "unpreferredRoutes",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "unpreferredAgencies",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "walkBoardCost",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bikeBoardCost",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "whiteListedRoutes",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bannedAgencies",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "whiteListedAgencies",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bannedTrips",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bannedStops",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "bannedStopsHard",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "transferPenalty",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "nonpreferredTransferPenalty",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "maxTransfers",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "batch",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "startTransitStopId",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "startTransitTripId",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "clampInitialWait",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "reverseOptimizeOnTheFly",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "boardSlack",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "alightSlack",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "locale",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "disableRemainingWeightHeuristic",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "flexFlagStopBufferSize",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "flexUseReservationServices",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "flexUseEligibilityServices",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "flexIgnoreDrtAdvanceBookMin",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "maxHours",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "useRequestedDateTimeInMaxHours",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "disableAlertFiltering",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "geoidElevation",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "invalidDateStrategy",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "minTransitDistance",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "searchTimeout",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "pathComparator",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "onlyTransitTrips",
    routingTypes: ["ITINERARY"]
  },
  {
    name: "minimumMicromobilitySpeed",
    routingTypes: ["ITINERARY"]
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
