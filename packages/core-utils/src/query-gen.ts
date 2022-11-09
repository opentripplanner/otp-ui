/* eslint-disable @typescript-eslint/no-unused-vars */
import { print } from "graphql";
import { TransportMode } from "@opentripplanner/types";
import PlanQuery from "./planQuery.graphql";

type LonLat = {
  lon: number;
  lat: number;
};

type OTPQueryParams = {
  to: LonLat;
  from: LonLat;
  modes: Array<TransportMode>;
  walkReluctance?: number;
  bikeReluctance?: number;
  walkSpeed?: number;
  bikeSpeed?: number;
  optimize?: string;
  allowBikeRental?: number;
  maxTransfers?: number;
  minTransferTime?: number;
};

// type SplitModeOptions = {
//   transitRequiresWalk?: boolean;
// };

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
