// Removed as core-utils is typescripted. TODO: Remove when typescripting!
/* eslint-disable react/forbid-prop-types */
import BaseMap from "@opentripplanner/base-map";
import PropTypes from "prop-types";
import React from "react";
import { CircleMarker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";

import VehicleRentalOverlay from ".";
import bikeRentalStations from "../__mocks__/bike-rental-stations.json";
import carRentalStations from "../__mocks__/car-rental-stations.json";
import eScooterStations from "../__mocks__/e-scooter-rental-stations.json";
import { HubAndFloatingBike } from "./DefaultMarkers";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];

/**
 * Creates an example Circle component to render entities
 * using a fixed size, fill color, and stroke color.
 */
const MyCircle = ({ fillColor = "gray", pixels, strokeColor }) => {
  const newStrokeColor = strokeColor || fillColor;

  const GeneratedCircle = ({ children, entity: station }) => (
    <CircleMarker
      center={[station.y, station.x]}
      color={newStrokeColor}
      fillColor={fillColor}
      fillOpacity={1}
      radius={pixels}
      weight={1}
    >
      {children}
    </CircleMarker>
  );
  GeneratedCircle.propTypes = {
    children: PropTypes.node,
    // entity: coreUtils.types.stationType.isRequired
    entity: PropTypes.object.isRequired
  };
  GeneratedCircle.defaultProps = {
    children: null
  };
  return GeneratedCircle;
};

const bikeMapSymbols = [
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    minZoom: 18,
    type: "hubAndFloatingBike"
  }
];
// Bike symbols using new symbols prop.
const bikeSymbols = [
  {
    getType: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 0,
    symbol: MyCircle({ fillColor: "#FF2E28", pixels: 3 }),
    symbolByType: {
      dock: MyCircle({
        fillColor: "#FF2E28",
        pixels: 4,
        strokeColor: "#000000"
      })
    }
  },
  {
    getType: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 14,
    symbol: MyCircle({ fillColor: "#FF2E28", pixels: 5 }),
    symbolByType: {
      dock: MyCircle({
        fillColor: "#FF2E28",
        pixels: 6,
        strokeColor: "#000000"
      })
    }
  },
  {
    minZoom: 18,
    symbol: HubAndFloatingBike
  }
];
const carMapSymbols = [
  {
    fillColor: "#009cde",
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    minZoom: 18,
    type: "marker"
  }
];
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
const EScooterMapSymbols = [
  {
    fillColor: "#F80600",
    minZoom: 0,
    pixels: 4,
    strokeColor: "#CCCCCC",
    type: "circle"
  },
  // You can combine predefined symbols (type = "<type>")
  // and external symbols (symbol = Component<({ entity, zoom })>.
  // (the color and pixel properties are ignored if you use the symbol syntax.).
  {
    minZoom: 14,
    symbol: MyCircle({
      fillColor: "#F80600",
      pixels: 6,
      strokeColor: "#CCCCCC"
    })
  },
  {
    fillColor: "#F80600",
    minZoom: 18,
    type: "marker"
  }
];
const setLocation = action("setLocation");

const INITIAL_ZOOM = 13;

const ZoomControlledMapWithVehicleRentalOverlay = ({
  companies,
  getStationName,
  mapSymbols,
  refreshVehicles,
  stations,
  visible
}) => (
  // Caution, <BaseMap> must be a direct parent of <VehicleRentalOverlay>.
  // Therefore, do not place <BaseMap> in a decorator at this time.
  <BaseMap center={center} zoom={INITIAL_ZOOM}>
    <VehicleRentalOverlay
      configCompanies={configCompanies}
      companies={companies}
      getStationName={getStationName}
      setLocation={setLocation}
      mapSymbols={mapSymbols}
      name="Rentals"
      refreshVehicles={refreshVehicles}
      stations={stations}
      visible={visible}
    />
  </BaseMap>
);

ZoomControlledMapWithVehicleRentalOverlay.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.string.isRequired),
  getStationName: PropTypes.func,
  // mapSymbols: coreUtils.types.vehicleRentalMapOverlaySymbolsType,
  mapSymbols: PropTypes.object,
  refreshVehicles: PropTypes.func.isRequired,
  // stations: PropTypes.arrayOf(coreUtils.types.stationType.isRequired)
  //   .isRequired,
  stations: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  visible: PropTypes.bool
};

ZoomControlledMapWithVehicleRentalOverlay.defaultProps = {
  companies: null,
  getStationName: undefined,
  mapSymbols: null,
  visible: true
};

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
    mapSymbols={bikeMapSymbols}
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
      mapSymbols={bikeMapSymbols}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
      visible={isOverlayVisible}
    />
  );
};

export const RentalBicyclesUsingNewSymbolsProp = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["BIKETOWN"]}
    refreshVehicles={action("refresh bicycles")}
    mapSymbols={bikeSymbols}
    stations={bikeRentalStations}
  />
);

export const RentalCars = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["CAR2GO"]}
    mapSymbols={carMapSymbols}
    refreshVehicles={action("refresh cars")}
    stations={carRentalStations}
  />
);

export const RentalEScooters = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["SHARED"]}
    mapSymbols={EScooterMapSymbols}
    refreshVehicles={action("refresh E-scooters")}
    stations={eScooterStations}
  />
);

export const RentalEScootersWithCustomNaming = () => (
  <ZoomControlledMapWithVehicleRentalOverlay
    companies={["SHARED"]}
    getStationName={customStationName}
    mapSymbols={EScooterMapSymbols}
    refreshVehicles={action("refresh E-scooters")}
    stations={eScooterStations}
  />
);
