import BaseMap from "@opentripplanner/base-map";
import {
  vehicleRentalMapOverlaySymbolsType,
  stationType,
  zoomBasedSymbolType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import VehicleRentalOverlay from ".";
import bikeRentalStations from "../__mocks__/bike-rental-stations.json";
import carRentalStations from "../__mocks__/car-rental-stations.json";
import eScooterStations from "../__mocks__/e-scooter-rental-stations.json";
import Markers from "./Markers";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];

const bikeMapSymbols = [
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    maxZoom: 13,
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    maxZoom: 17,
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    maxZoom: 999,
    minZoom: 18,
    type: "hubAndFloatingBike"
  }
];

const bikeSymbols = [
  {
    getMode: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 0,
    symbol: Markers.Circle.template(3, "#FF2E28"),
    symbolByMode: {
      dock: Markers.Circle.template(4, "#FF2E28", "#000000")
    }
  },
  {
    getMode: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 14,
    symbol: Markers.Circle.template(5, "#FF2E28"),
    symbolByMode: {
      dock: Markers.Circle.template(6, "#FF2E28", "#000000")
    }
  },
  {
    minZoom: 18,
    symbol: Markers.HubAndFloatingBike
  }
];

const carMapSymbols = [
  {
    fillColor: "#009cde",
    maxZoom: 13,
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    maxZoom: 17,
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    maxZoom: 999,
    minZoom: 18,
    type: "marker"
  }
];

const carSymbols = [
  {
    minZoom: 0,
    symbol: Markers.Circle.template(4, "#009cde")
  },
  {
    minZoom: 14,
    symbol: Markers.Circle.template(6, "#009cde")
  },
  {
    minZoom: 18,
    symbol: Markers.Marker.template("#009cde")
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
    maxZoom: 13,
    minZoom: 0,
    pixels: 4,
    strokeColor: "#CCCCCC",
    type: "circle"
  },
  {
    fillColor: "#F80600",
    maxZoom: 17,
    minZoom: 14,
    pixels: 6,
    strokeColor: "#CCCCCC",
    type: "circle"
  },
  {
    fillColor: "#F80600",
    maxZoom: 999,
    minZoom: 18,
    type: "marker"
  }
];

const EScooterSymbols = [
  {
    minZoom: 0,
    symbol: Markers.Circle.template(4, "#F80600", "#CCCCCC")
  },
  {
    minZoom: 14,
    symbol: Markers.Circle.template(6, "#F80600", "#CCCCCC")
  },
  {
    minZoom: 18,
    symbol: Markers.Marker.template("#F80600")
  }
];
const setLocation = action("setLocation");

class ZoomControlledMapWithVehicleRentalOverlay extends Component {
  constructor() {
    super();
    this.state = { zoom: 13 };
  }

  onViewportChanged = ({ zoom }) => {
    const { zoom: stateZoom } = this.state;
    if (zoom !== stateZoom) {
      this.setState({ zoom });
    }
  };

  render() {
    const {
      companies,
      getStationName,
      mapSymbols,
      refreshVehicles,
      stations,
      symbols
    } = this.props;
    const { zoom } = this.state;
    return (
      <BaseMap
        center={center}
        onViewportChanged={this.onViewportChanged}
        zoom={zoom}
      >
        <VehicleRentalOverlay
          configCompanies={configCompanies}
          companies={companies}
          getStationName={getStationName}
          setLocation={setLocation}
          mapSymbols={mapSymbols}
          refreshVehicles={refreshVehicles}
          stations={stations}
          visible
          symbols={symbols}
          zoom={zoom}
        />
      </BaseMap>
    );
  }
}

ZoomControlledMapWithVehicleRentalOverlay.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.string.isRequired),
  getStationName: PropTypes.func,
  mapSymbols: vehicleRentalMapOverlaySymbolsType,
  refreshVehicles: PropTypes.func.isRequired,
  stations: PropTypes.arrayOf(stationType.isRequired).isRequired,
  symbols: PropTypes.arrayOf(zoomBasedSymbolType)
};

ZoomControlledMapWithVehicleRentalOverlay.defaultProps = {
  companies: null,
  getStationName: undefined,
  mapSymbols: null,
  symbols: null
};

function customStationName(_, station) {
  return `🛴 (ID: ${station.id})`;
}

storiesOf("VehicleRentalOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("Existing VehicleRentalOverlay with rental bicycles", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      mapSymbols={bikeMapSymbols}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
    />
  ))
  .add("Existing VehicleRentalOverlay with rental cars", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["CAR2GO"]}
      mapSymbols={carMapSymbols}
      refreshVehicles={action("refresh cars")}
      stations={carRentalStations}
    />
  ))
  .add("Existing VehicleRentalOverlay with rental E-scooters", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      mapSymbols={EScooterMapSymbols}
      refreshVehicles={action("refresh E-scooters")}
      stations={eScooterStations}
    />
  ))
  .add(
    "Existing VehicleRentalOverlay with rental E-scooters with custom naming",
    () => (
      <ZoomControlledMapWithVehicleRentalOverlay
        companies={["SHARED"]}
        getStationName={customStationName}
        mapSymbols={EScooterMapSymbols}
        refreshVehicles={action("refresh E-scooters")}
        stations={eScooterStations}
      />
    )
  )
  .add("VehicleRentalOverlay with rental bicycles", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
      symbols={bikeSymbols}
    />
  ))
  .add("VehicleRentalOverlay with rental cars", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["CAR2GO"]}
      refreshVehicles={action("refresh cars")}
      stations={carRentalStations}
      symbols={carSymbols}
    />
  ))
  .add("VehicleRentalOverlay with rental E-scooters", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      refreshVehicles={action("refresh E-scooters")}
      stations={eScooterStations}
      symbols={EScooterSymbols}
    />
  ))
  .add("VehicleRentalOverlay with rental E-scooters with custom naming", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      getStationName={customStationName}
      refreshVehicles={action("refresh E-scooters")}
      stations={eScooterStations}
      symbols={EScooterSymbols}
    />
  ));
