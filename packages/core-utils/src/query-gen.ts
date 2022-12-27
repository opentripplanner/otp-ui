/* eslint-disable @typescript-eslint/no-unused-vars */
import { print } from "graphql";
import {
  ModeSetting,
  ModeSettingValues,
  TransportMode
} from "@opentripplanner/types";
import { LonLatOutput } from "@conveyal/lonlat";
import PlanQuery from "./planQuery.graphql";

type OTPQueryParams = {
  to: LonLatOutput;
  from: LonLatOutput;
  modes: Array<TransportMode>;
  modeSettings: ModeSetting[];
};

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

export const TRANSIT_SUBMODES = Object.keys(SIMPLIFICATIONS).filter(
  mode => SIMPLIFICATIONS[mode] === "TRANSIT" && mode !== "TRANSIT"
);
export const TRANSIT_SUBMODES_AND_TRANSIT = Object.keys(SIMPLIFICATIONS).filter(
  mode => SIMPLIFICATIONS[mode] === "TRANSIT"
);

export function generateCombinations(params: OTPQueryParams): OTPQueryParams[] {
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

  // List of the transit submodes that are included in the input params
  const queryTransitSubmodes = params.modes
    .filter(mode => TRANSIT_SUBMODES.includes(mode.mode))
    .map(mode => mode.mode);

  return (
    combinations(params.modes)
      .filter(combo => {
        if (combo.length === 0) return false;

        // All current qualifiers currently simplify to "SHARED"
        const simplifiedModes = Array.from(
          new Set(
            combo.map(c => (c.qualifier ? "SHARED" : SIMPLIFICATIONS[c.mode]))
          )
        );

        // Ensure that if we have one transit mode, then we include ALL transit modes
        if (simplifiedModes.includes("TRANSIT")) {
          const flatModes = combo.map(m => m.mode);
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
        }

        // OTP doesn't support multiple non-walk modes
        if (BANNED_TOGETHER.every(m => combo.find(c => c.mode === m)))
          return false;

        return !!VALID_COMBOS.find(
          vc =>
            simplifiedModes.every(m => vc.includes(m)) &&
            vc.every(m => simplifiedModes.includes(m))
        );
      })
      // create new filter that removes subTransit modes from appearing on their own
      // ONLY IF there's multiple of them!
      .map(combo => ({ ...params, modes: combo }))
  );
}

// eslint-disable-next-line import/prefer-default-export
export function generateOtp2Query(params: OTPQueryParams): any {
  const { to, from, modeSettings } = params;

  // This extracts the values from the mode settings to key value pairs
  const modeSettingValues = modeSettings.reduce((prev, cur) => {
    prev[cur.key] = cur.value;
    return prev;
  }, {}) as ModeSettingValues;

  const {
    walkReluctance,
    wheelchair,
    bikeReluctance,
    carReluctance,
    allowBikeRental
  } = modeSettingValues;

  return {
    query: print(PlanQuery),
    variables: {
      fromPlace: [from.lat, from.lon].join(","),
      toPlace: [to.lat, to.lon].join(","),
      modes: params.modes,
      allowBikeRental,
      walkReluctance,
      wheelchair,
      bikeReluctance,
      carReluctance
    }
  };
}
