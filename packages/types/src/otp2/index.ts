// RENTAL VEHICLE TYPES

export type VehicleRentalStation = {
  availableVehicles?: RentalVehicleEntityCounts;
  availableSpaces?: RentalVehicleEntityCounts;
  allowDropoff?: boolean;
  allowPickup?: boolean;
  id: string;
  name?: string;
  rentalNetwork: VehicleRentalNetwork;
  realtime?: boolean;
  lon?: number;
  lat?: number;
};

export type RentalVehicle = {
  allowPickupNow?: boolean;
  availableUntil?: string;
  fuel?: RentalVehicleFuel;
  id: string;
  lat?: number;
  lon?: number;
  name: string;
  operative?: boolean;
  rentalNetwork: VehicleRentalNetwork;
  rentalUris?: VehicleRentalUris;
  vehicleId?: string;
  vehicleType?: RentalVehicleType;
};

type RentalVehicleFuel = {
  percent?: number;
  range?: number;
};

type VehicleRentalUris = {
  android?: string;
  ios?: string;
  web?: string;
};

export type FormFactor =
  | "BICYCLE"
  | "CAR"
  | "CARGO_BICYCLE"
  | "MOPED"
  | "OTHER"
  | "SCOOTER"
  | "SCOOTER_SEATED"
  | "SCOOTER_STANDING";

enum PropulsionType {
  COMBUSTION = "COMBUSTION",
  COMBUSTION_DIESEL = "COMBUSTION_DIESEL",
  ELECTRIC = "ELECTRIC",
  ELECTRIC_ASSIST = "ELECTRIC_ASSIST",
  HUMAN = "HUMAN",
  HYBRID = "HYBRID",
  HYDROGEN_FUEL_CELL = "HYDROGEN_FUEL_CELL",
  PLUG_IN_HYBRID = "PLUG_IN_HYBRID"
}

type RentalVehicleType = {
  formFactor?: FormFactor;
  propulsionType?: PropulsionType;
};

type RentalVehicleTypeCount = {
  count?: number;
  vehicleType: RentalVehicleType;
};

type RentalVehicleEntityCounts = {
  byType: RentalVehicleTypeCount[];
  total: number;
};

type VehicleRentalNetwork = {
  networkId: string;
  url?: string;
};
