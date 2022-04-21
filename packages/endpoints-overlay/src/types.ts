import { Location } from "@opentripplanner/types";

interface UserLocation extends Location {
  icon?: string;
  id?: string;
}

export interface UserLocationAndType {
  location: UserLocation;
  type: string;
}

export interface ClearLocationArg {
  locationType: string;
}

export interface MapLocationActionArg {
  location: UserLocation;
  locationType: string;
  reverseGeocode?: boolean;
}
