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
  const BANNED_SOLO = ["TRANSIT", "CAR"];
  const BANNED_TOGETHER = ["BICYCLE", "CAR", "MICROMOBILITY", "WALK"];
  // take the mode list
  const combos = combinations(params.modes)
    .filter(combo => combo.length > 0)
    .filter(
      combo =>
        combo.length !== 1 ||
        (combo.length === 1 && !!combo[0].qualifier) ||
        (combo.length === 1 && !BANNED_SOLO.includes(combo[0].mode))
    )
    .filter(
      combo =>
        // If the combo is WALK and a mode with a qualifier, always approve it.
        !(
          combo.length === 2 &&
          combo.find(c => c.mode === "WALK") &&
          combo.find(c => !!c.qualifier)
        ) &&
        combo.reduce((acc, cur) => {
          if (BANNED_TOGETHER.includes(cur.mode)) {
            return acc + 1;
          }
          return acc;
        }, 0) < 2
    );

  // generate all combinations without order-based duplicates

  // filter based on pre-set rules

  // return array
  return combos.map(combo => ({ ...params, modes: combo }));
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
