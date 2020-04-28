import React from "react";
import {create, act} from 'react-test-renderer';
import * as utils from "../utils";
const line = require("../../__mocks__/line100.json");

/*
import BaseMap from "@opentripplanner/base-map";
import TransitVehicleOverlay from "../index";

// marker / popup / tooltip slots
import ModeRectangles from "../components/markers/ModeRectangles";
import CustomTooltip from "../components/popups/CustomTooltip";
import VehiclePopup from "../components/popups/VehiclePopup";



const geom = require("../../__mocks__/lineGeom100.json");
const line = require("../../__mocks__/line100.json");

const PORTLAND = [45.523, -122.671];
const INITIAL_ZOOM_LEVEL = 14;

function makeApp() {
  const vehicleData = line;
  const patternGeometry = utils.makePattern(geom, "111");
  const initVehicle = utils.findVehicleById(vehicleData, "9562512");

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
    >
      <TransitVehicleOverlay
        vehicleList={vehicleData}
        pattern={patternGeometry}
        selectedVehicle={initVehicle}
      />
    </BaseMap>
  );
}

TODO: test react components???
TODO: many more tests

// render the component
let root;
act(() => {
  root = create(makeApp())
});

// make assertions on root
expect(root.toJSON()).toMatchSnapshot();
*/

const vehicleData = line;
const initVehicle = utils.findVehicleById(vehicleData, "9562512");

describe("util > vehicles and patterns", () => {
  it("find vehciles", () => {
    expect(initVehicle).toMatchSnapshot();
  });
});
