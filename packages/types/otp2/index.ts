export enum FormFactor {
  BICYCLE = "BICYCLE",
  CAR = "CAR",
  CARGO_BICYCLE = "CARGO_BICYCLE",
  MOPED = "MOPED",
  OTHER = "OTHER",
  SCOOTER = "SCOOTER",
  SCOOTER_SEATED = "SCOOTER_SEATED",
  SCOOTER_STANDING = "SCOOTER_STANDING"
}

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

export type VehicleRentalStation = {
  availableVehicles?: RentalVehicleEntityCounts;
  availableSpaces?: RentalVehicleEntityCounts;
  allowDropoff?: boolean;
  allowPickup?: boolean;
  id: string;
  isFloatingBike?: boolean;
  isFloatingCar?: boolean;
  isFloatingVehicle?: boolean;
  name?: string;
  rentalNetwork: VehicleRentalNetwork;
  realtime?: boolean;
  // TS TODO coordinate type
  lon: number;
  lat: number;
};
