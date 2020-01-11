import BaseMap from "@opentripplanner/base-map";
import {
  mapSymbolsType,
  stationsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import VehicleRentalOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.518092, -122.671202];

function randomInt(maxVal) {
  return parseInt(Math.random() * maxVal, 10);
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function makeBaseRandomRentalStation({ id, networks }) {
  return {
    id,
    name: id,
    networks,
    x: randomRange(-122.6, -122.75),
    y: randomRange(45.507, 45.531)
  };
}

function makeRandomBikeRentalStation(mapVal, idx) {
  const networks = ["BIKETOWN"];
  if (Math.random() > 0.5) {
    // make a docking station style bike rental station
    const id = `Station ${idx}`;
    return {
      ...makeBaseRandomRentalStation({ id, networks }),
      bikesAvailable: randomInt(20),
      spacesAvailable: randomInt(20)
    };
  }

  // make a free-floating style bike rental station
  const id = `Bike ${idx}`;
  return {
    ...makeBaseRandomRentalStation({ id, networks }),
    bikesAvailable: 1,
    isFloatingBike: true,
    spacesAvailable: 0
  };
}

function makeRandomCarRentalStation(mapVal, idx) {
  // make a free-floating style car rental station
  const id = `Bike ${idx}`;
  const networks = ["CAR2GO"];
  return {
    ...makeBaseRandomRentalStation({ id, networks }),
    carsAvailable: 1,
    isFloatingCar: true,
    spacesAvailable: 0
  };
}

function makeRandomEScooterRentalStation(mapVal, idx) {
  // make a free-floating style car rental station
  const id = `E-scooter ${idx}`;
  const networks = ["SHARED"];
  return {
    ...makeBaseRandomRentalStation({ id, networks }),
    isFloatingVehicle: true,
    spacesAvailable: 0,
    vehiclesAvailable: 1
  };
}

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
const randomBikeRentalStations = Array(20)
  .fill(null)
  .map(makeRandomBikeRentalStation);
const randomCarRentalStations = Array(20)
  .fill(null)
  .map(makeRandomCarRentalStation);
const randomEScooterStations = Array(20)
  .fill(null)
  .map(makeRandomEScooterRentalStation);
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
    const { companies, mapSymbols, refreshVehicles, stations } = this.props;
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
          setLocation={setLocation}
          mapSymbols={mapSymbols}
          refreshVehicles={refreshVehicles}
          stations={stations}
          visible
          zoom={zoom}
        />
      </BaseMap>
    );
  }
}

ZoomControlledMapWithVehicleRentalOverlay.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.string.isRequired),
  mapSymbols: mapSymbolsType.isRequired,
  refreshVehicles: PropTypes.func.isRequired,
  stations: stationsType.isRequired
};

ZoomControlledMapWithVehicleRentalOverlay.defaultProps = {
  companies: null
};

storiesOf("VehicleRentalOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("VehicleRentalOverlay with rental bicycles", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      mapSymbols={bikeMapSymbols}
      refreshVehicles={action("refresh bicycles")}
      stations={randomBikeRentalStations}
    />
  ))
  .add("VehicleRentalOverlay with rental cars", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["CAR2GO"]}
      mapSymbols={carMapSymbols}
      refreshVehicles={action("refresh cars")}
      stations={randomCarRentalStations}
    />
  ))
  .add("VehicleRentalOverlay with rental E-scooters", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      mapSymbols={EScooterMapSymbols}
      refreshVehicles={action("refresh E-scooters")}
      stations={randomEScooterStations}
    />
  ));
