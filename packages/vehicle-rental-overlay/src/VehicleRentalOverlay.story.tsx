import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";

import { Company, Station } from "@opentripplanner/types";
import VehicleRentalOverlay from ".";
import bikeRentalStations from "../__mocks__/bike-rental-stations.json";
import carRentalStations from "../__mocks__/car-rental-stations.json";
import eScooterStations from "../__mocks__/e-scooter-rental-stations.json";

const center: [number, number] = [45.518092, -122.671202];
const configCompanies = [
  {
    id: "BIKETOWN",
    label: "Biketown",
    modes: "BICYCLE_RENT"
  },
  {
    id: "CAR2GO",
    label: "car2go",
    modes: "CAR_RENT"
  },
  {
    id: "RAZOR",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];
const setLocation = action("setLocation");

const INITIAL_ZOOM = 13;

type StoryProps = {
  companies: string[];
  getStationName?: (configCompanies: Company[], station: Station) => string;
  refreshVehicles: () => void;
  stations: Station[];
  visible?: boolean;
};

const ZoomControlledMapWithVehicleRentalOverlay = ({
  companies,
  getStationName,
  refreshVehicles,
  stations,
  visible
}: StoryProps) => (
  // Caution, <BaseMap> must be a direct parent of <VehicleRentalOverlay>.
  // Therefore, do not place <BaseMap> in a decorator at this time.
  <BaseMap center={center} forceMaxHeight zoom={INITIAL_ZOOM}>
    <VehicleRentalOverlay
      configCompanies={configCompanies}
      companies={companies}
      getStationName={getStationName}
      setLocation={setLocation}
      refreshVehicles={refreshVehicles}
      stations={stations}
      visible={visible}
    />
  </BaseMap>
);

function customStationName(_, station) {
  return `🛴 (ID: ${station.id})`;
}

export default {
  title: "VehicleRentalOverlay",
  component: VehicleRentalOverlay
};

export const RentalBicycles = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["BIKETOWN"]}
    refreshVehicles={action("refresh bicycles")}
    stations={bikeRentalStations}
  />
);

export const RentalBicyclesVisibilityControlledByKnob = () => {
  const isOverlayVisible = boolean(
    "Toggle visibility of vehicle rental overlay",
    false
  );
  return (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
      visible={isOverlayVisible}
    />
  );
};

export const RentalCars = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["CAR2GO"]}
    refreshVehicles={action("refresh cars")}
    stations={carRentalStations}
  />
);

export const RentalEScooters = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["SHARED"]}
    refreshVehicles={action("refresh E-scooters")}
    stations={eScooterStations}
  />
);

export const RentalEScootersWithCustomNaming = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["SHARED"]}
    getStationName={customStationName}
    refreshVehicles={action("refresh E-scooters")}
    stations={eScooterStations}
  />
);
