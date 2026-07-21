import { LonLatOutput } from "@conveyal/lonlat";
import { print } from "graphql";
import {
  ModeSetting,
  ModeSettingValues,
  TransportMode
} from "@opentripplanner/types";

import { formatInTimeZone } from "date-fns-tz";
import DefaultPlanQuery from "./planQuery.graphql";
import { isTransit } from "./itinerary";



type OTPQueryParams = {
  arriveBy: boolean;
  bannedRoutes?: string[];
  date?: string;
  departArrive?: string;
  from: LonLatOutput & { name?: string };
  modes: TransportMode[];
  modeSettings: ModeSetting[];
  numItineraries?: number;
  omitCanceled?: boolean;
  time?: string;
  to: LonLatOutput & { name?: string };
  requiredRoutes?: string[];
};

type GraphQLQuery = {
  query: string;
  variables: Record<string, unknown>;
};

/**
 * Mode Settings can contain additional modes to add to the query,
 * this function extracts those additional modes from the settings
 * and returns them in an array.
 * @param modeSettings List of mode settings with values populated
 * @returns Additional transport modes to add to query
 */
export function extractAdditionalModes(
  modeSettings: ModeSetting[],
  enabledModes: TransportMode[]
): TransportMode[] {
  return modeSettings.reduce<TransportMode[]>((prev, cur) => {
    // First, ensure that the mode associated with this setting is even enabled
    if (!enabledModes.map(m => m.mode).includes(cur.applicableMode)) {
      return prev;
    }

    // In checkboxes, mode must be enabled and have a transport mode in it
    if (
      (cur.type === "CHECKBOX" || cur.type === "SUBMODE") &&
      cur.addTransportMode &&
      cur.value
    ) {
      const newTransportModes = Array.isArray(cur.addTransportMode)
        ? cur.addTransportMode
        : [cur.addTransportMode];
      return [...prev, ...newTransportModes];
    }
    if (cur.type === "DROPDOWN") {
      const transportMode = cur.options.find(o => o.value === cur.value)
        ?.addTransportMode;
      if (transportMode) {
        return [...prev, transportMode];
      }
    }
    return prev;
  }, []);
}



/**
 * Generates a list of queries for OTP based on planConnection config
 * @param params OTP Query Params
 * @returns Set of parameters to generate queries
 */
export function generateCombinations(params: OTPQueryParams): OTPQueryParams[] {
  const completeModeList = [
    ...extractAdditionalModes(params.modeSettings, params.modes),
    ...params.modes
  ];

  // List of the transit *submodes* that are included in the input params
  const transitModes = completeModeList
    .filter(mode => isTransit(mode.mode) && mode.mode !== "TRANSIT")

  // @ts-expect-error types packagge fail
  return completeModeList
    .filter(mode => !!mode.input)
    // @ts-expect-error types packagge fail
    .map(mode => ({ ...params, modes: { ...mode.input, transit: { ...mode?.input?.transit, ...transitModes.length > 0 && { transit: transitModes } } } }));

}

/**
 * Generates a query for OTP GraphQL API based on parameters.
 * @param param0 OTP2 Parameters for the query
 * @param planQuery Override the default query for OTP
 * @returns A fully formed query+variables ready to be sent to GraphQL backend
 */
export function generateOtp2Query(
  otpQueryParams: OTPQueryParams,
  homeTimezone: string,
  planQuery = DefaultPlanQuery
): GraphQLQuery {
  const { bannedRoutes, departArrive, from, modeSettings, to, date, modes, time, arriveBy, omitCanceled } = otpQueryParams;

  // This extracts the values from the mode settings to key value pairs
  const modeSettingValues = modeSettings.reduce<
    Record<string, string | number | boolean>
  >((prev, cur) => {
    if (cur.type === "SLIDER" && cur.inverseKey && cur.value) {
      prev[cur.inverseKey] = cur.high - cur.value + cur.low;
    } else if (cur.value) {
      prev[cur.key] = cur.value;
    }

    if (cur.type === "CHECKBOX" && cur.truthValue) {
      // If checked, assign the truthValue. Otherwise use the routing engine default
      const newVal = !!cur.value && cur.truthValue
      if (newVal) {
        prev[cur.key] = newVal;
      }
    }
    return prev;
    // eslint-disable-next-line prettier/prettier -- old eslint doesn't know satisfies
  }, {}) satisfies ModeSettingValues;

  const {
    bikeReluctance,
    carReluctance,
    walkReluctance,
    walkSpeed,
    wheelchair
  } = modeSettingValues;


  // CALLTAKER:
  // fix calltaker mode selector
  // fix via
  // fix calltaker banned rouets dropdown

  // can remove custom septa graphql, since the main file now has blockid

  // finally re-open that deprecated fields PR

  // TODO: instead of these shinanigans, don't TZ-convert times in the date-time picker
  const timezone = formatInTimeZone(new Date(`${date}T${time}`), homeTimezone, "XXX")

  const transitFilter = []
  if (bannedRoutes && bannedRoutes.length > 0) {
    transitFilter.push({ exclude: [{ routes: bannedRoutes }] })
  }

  return {
    query: print(planQuery),
    variables: {
      dateTime: departArrive === "NOW" ? null : { [arriveBy ? "latestArrival" : "earliestDeparture"]: `${date}T${time}${timezone}` },
      modes,
      bikeReluctance,
      carReluctance,
      origin: { label: from.name, location: { coordinate: { latitude: from.lat, longitude: from.lon } } },
      destination: { label: to.name, location: { coordinate: { latitude: to.lat, longitude: to.lon } } },
      // Plan had this flipped...
      includeRealTimeCancellations: omitCanceled !== true,
      transitFilter,
      walkReluctance,
      walkSpeed,
      wheelchair
    }
  };
}
