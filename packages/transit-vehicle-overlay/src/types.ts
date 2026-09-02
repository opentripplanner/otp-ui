import { TransitVehicle } from "@opentripplanner/types";
import { ReactNode } from "react";

export interface VehicleComponentProps {
  vehicle: TransitVehicle;
  children?: ReactNode;
}
