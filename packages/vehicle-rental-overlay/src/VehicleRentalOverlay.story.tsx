import React, { ReactNode } from "react";
import { action } from "@storybook/addon-actions";

import { Company, Station } from "@opentripplanner/types";
import bikeRentalStations from "../__mocks__/bike-rental-stations.json";
import carRentalStations from "../__mocks__/car-rental-stations.json";
import eScooterStations from "../__mocks__/e-scooter-rental-stations.json";
import { withMap } from "../../../.storybook/base-map-wrapper";
import VehicleRentalOverlay from ".";

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
  <VehicleRentalOverlay
    companies={companies}
    configCompanies={configCompanies}
    getStationName={getStationName}
    id="test"
    refreshVehicles={refreshVehicles}
    setLocation={setLocation}
    stations={stations}
    visible={visible}
  />
);

function customStationName(_, station) {
  return `🛴 (ID: ${station.id})`;
}

export default {
  title: "VehicleRentalOverlay",
  component: VehicleRentalOverlay,
  decorators: [withMap(center, INITIAL_ZOOM)],
  parameters: { storyshots: { disable: true } }
};
export const RentalBicycles = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["BIKETOWN"]}
    refreshVehicles={action("refresh bicycles")}
    stations={bikeRentalStations}
  />
);

export const RentalBicyclesVisibilityControlledByKnob = ({
  visible
}: {
  visible: boolean;
}): ReactNode => {
  return (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
      visible={visible}
    />
  );
};
RentalBicyclesVisibilityControlledByKnob.args = { visible: true };

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
