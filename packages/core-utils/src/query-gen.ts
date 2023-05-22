import { LonLatOutput } from "@conveyal/lonlat";
import { print } from "graphql";
import {
  ModeSetting,
  ModeSettingValues,
  TransportMode
} from "@opentripplanner/types";

import PlanQuery from "./planQuery.graphql";

type InputBanned = {
  routes?: string;
  agencies?: string;
  trips?: string;
  stops?: string;
  stopsHard?: string;
};

type InputPreferred = {
  routes?: string;
  agencies?: string;
  unpreferredCost?: string;
};

type OTPQueryParams = {
  arriveBy: boolean;
  date?: string;
  from: LonLatOutput & { name?: string };
  modes: TransportMode[];
  modeSettings: ModeSetting[];
  time?: string;
  numItineraries?: number;
  to: LonLatOutput & { name?: string };
  banned?: InputBanned;
  preferred?: InputPreferred;
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

    // In checkboxes (or submode checkboxes), mode must be enabled and have a transport mode in it
    if (
      (cur.type === "CHECKBOX" || cur.type === "SUBMODE") &&
      cur.addTransportMode &&
      cur.value
    ) {
      return [...prev, cur.addTransportMode];
    }
    if (cur.type === "DROPDOWN") {
      const transportMode = cur.options.find(o => o.value === cur.value)
        .addTransportMode;
      if (transportMode) {
        return [...prev, transportMode];
      }
    }
    return prev;
  }, []);
}

/**
 * Generates every possible mathematical subset of the input TransportModes.
 * Uses code from:
 * https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array
 * @param array Array of input transport modes
 * @returns 2D array representing every possible subset of transport modes from input
 */
function combinations(array: TransportMode[]): TransportMode[][] {
  if (!array) return [];
  return (
    // eslint-disable-next-line no-bitwise
    new Array(1 << array.length)
      .fill(null)
      // eslint-disable-next-line no-bitwise
      .map((e1, i) => array.filter((e2, j) => i & (1 << j)))
  );
}

/**
 * This constant maps all the transport mode to a broader mode type,
 * which is used to determine the valid combinations of modes used in query generation.
 */
export const SIMPLIFICATIONS = {
  AIRPLANE: "TRANSIT",
  BICYCLE: "PERSONAL",
  BUS: "TRANSIT",
  CABLE_CAR: "TRANSIT",
  CAR: "CAR",
  FERRY: "TRANSIT",
  FLEX: "SHARED", // TODO: this allows FLEX+WALK. Is this reasonable?
  FUNICULAR: "TRANSIT",
  GONDOLA: "TRANSIT",
  RAIL: "TRANSIT",
  SCOOTER: "PERSONAL",
  SUBWAY: "TRANSIT",
  TRAM: "TRANSIT",
  TRANSIT: "TRANSIT",
  WALK: "WALK"
};

// Inclusion of "TRANSIT" alone automatically implies "WALK" in OTP
const VALID_COMBOS = [
  ["WALK"],
  ["PERSONAL"],
  ["TRANSIT", "SHARED"],
  ["WALK", "SHARED"],
  ["TRANSIT"],
  ["TRANSIT", "PERSONAL"],
  ["TRANSIT", "CAR"]
];

const BANNED_TOGETHER = ["SCOOTER", "BICYCLE"];

export const TRANSIT_SUBMODES = Object.keys(SIMPLIFICATIONS).filter(
  mode => SIMPLIFICATIONS[mode] === "TRANSIT" && mode !== "TRANSIT"
);
export const TRANSIT_SUBMODES_AND_TRANSIT = Object.keys(SIMPLIFICATIONS).filter(
  mode => SIMPLIFICATIONS[mode] === "TRANSIT"
);

function isCombinationValid(
  combo: TransportMode[],
  queryTransitSubmodes: string[]
): boolean {
  if (combo.length === 0) return false;

  // All current qualifiers currently simplify to "SHARED"
  const simplifiedModes = Array.from(
    new Set(combo.map(c => (c.qualifier ? "SHARED" : SIMPLIFICATIONS[c.mode])))
  );

  // Ensure that if we have one transit mode, then we include ALL transit modes
  if (simplifiedModes.includes("TRANSIT")) {
    // Don't allow TRANSIT along with any other submodes
    if (queryTransitSubmodes.length && combo.find(c => c.mode === "TRANSIT")) {
      return false;
    }

    if (
      combo.reduce((prev, cur) => {
        if (queryTransitSubmodes.includes(cur.mode)) {
          return prev - 1;
        }
        return prev;
      }, queryTransitSubmodes.length) !== 0
    ) {
      return false;
    }
    // Continue to the other checks
  }

  // OTP doesn't support multiple non-walk modes
  if (BANNED_TOGETHER.every(m => combo.find(c => c.mode === m))) return false;

  return !!VALID_COMBOS.find(
    vc =>
      simplifiedModes.every(m => vc.includes(m)) &&
      vc.every(m => simplifiedModes.includes(m))
  );
}

/**
 * Generates a list of queries for OTP to get a comprehensive
 * set of results based on the modes input.
 * @param params OTP Query Params
 * @returns Set of parameters to generate queries
 */
export function generateCombinations(params: OTPQueryParams): OTPQueryParams[] {
  const completeModeList = [
    ...extractAdditionalModes(params.modeSettings, params.modes),
    ...params.modes
  ];

  // List of the transit *submodes* that are included in the input params
  const queryTransitSubmodes = completeModeList
    .filter(mode => TRANSIT_SUBMODES.includes(mode.mode))
    .map(mode => mode.mode);

  return combinations(completeModeList)
    .filter(combo => isCombinationValid(combo, queryTransitSubmodes))
    .map(combo => ({ ...params, modes: combo }));
}

export function generateOtp2Query({
  arriveBy,
  banned,
  date,
  from,
  modes,
  modeSettings,
  numItineraries,
  preferred,
  time,
  to
}: OTPQueryParams): GraphQLQuery {
  // This extracts the values from the mode settings to key value pairs
  const modeSettingValues = modeSettings.reduce((prev, cur) => {
    if (cur.type === "SLIDER" && cur.inverseKey) {
      prev[cur.inverseKey] = cur.high - cur.value + cur.low;
    }
    prev[cur.key] = cur.value;
    return prev;
  }, {}) as ModeSettingValues;

  const {
    bikeReluctance,
    carReluctance,
    walkReluctance,
    wheelchair
  } = modeSettingValues;

  return {
    query: print(PlanQuery),
    variables: {
      arriveBy,
      banned,
      bikeReluctance,
      carReluctance,
      date,
      fromPlace: `${from.name}::${from.lat},${from.lon}}`,
      modes,
      numItineraries,
      preferred,
      time,
      toPlace: `${to.name}::${to.lat},${to.lon}}`,
      walkReluctance,
      wheelchair
    }
  };
}
