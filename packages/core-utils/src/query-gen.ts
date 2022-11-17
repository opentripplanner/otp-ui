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

// eslint-disable-next-line import/prefer-default-export
export function generateOtp2Query(params: OTPQueryParams): any {
  const { to, from } = params;

  const processedModeSettings = params.modeSettings?.reduce(
    (cumulator, setting) => {
      cumulator[setting.key] = setting.value;
      return cumulator;
    },
    {}
  );

  return {
    query: print(PlanQuery),
    variables: {
      fromPlace: [from.lat, from.lon].join(","),
      toPlace: [to.lat, to.lon].join(","),
      modes: params.modes,
      ...processedModeSettings
    }
  };
}
