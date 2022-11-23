/* eslint-disable @typescript-eslint/no-unused-vars */
import { print } from "graphql";
import {
  ModeSetting,
  ModeSettingTypes,
  TransportMode
} from "@opentripplanner/types";
import PlanQuery from "./planQuery.graphql";

type LonLat = {
  lon: number;
  lat: number;
};

type OTPQueryParams = {
  to: LonLat;
  from: LonLat;
  modes: Array<TransportMode>;
  modeSettings: ModeSetting[];
};

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

export function generateCombinations(params: OTPQueryParams): OTPQueryParams[] {
  const SIMPLIFICATIONS = {
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
      // ONLY IF there's mulitple of them!
      .map(combo => ({ ...params, modes: combo }))
  );
}

// eslint-disable-next-line import/prefer-default-export
export function generateOtp2Query(params: OTPQueryParams): any {
  const { to, from } = params;

  return {
    query: print(PlanQuery),
    variables: {
      fromPlace: [from.lat, from.lon].join(","),
      toPlace: [to.lat, to.lon].join(","),
      modes: params.modes
    }
  };
}
