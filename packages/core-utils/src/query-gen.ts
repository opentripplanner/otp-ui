/* eslint-disable @typescript-eslint/no-unused-vars */
import { Combination } from "@opentripplanner/types";
import PlanQuery from "./planQuery.graphql";

type LonLat = {
  lon: number;
  lat: number;
};

type OTPQueryParams = {
  to: LonLat;
  from: LonLat;
  combinations: Array<Combination>;
  walkReluctance: number;
  bikeReluctance: number;
  walkSpeed: number;
  bikeSpeed: number;
  optimize: string;
  allowBikeRental: number;
  maxTransfers: number;
  minTransferTime: number;
};

// type SplitModeOptions = {
//   transitRequiresWalk?: boolean;
// };

const addAllToSet = (set: Set<unknown>, items: Array<unknown>) => {
  items.forEach(item => set.add(item));
  return set;
};

// eslint-disable-next-line import/prefer-default-export
export async function runOtp2Query(params: OTPQueryParams): Promise<any> {
  const allEnabledModes = params.combinations.reduce(
    (prev, cur) => addAllToSet(prev, cur.modes),
    new Set()
  );
  return {};
}
