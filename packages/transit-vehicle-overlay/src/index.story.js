import React from "react";

import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import {
  withKnobs,
  text,
  number,
  color,
  boolean,
  select
} from "@storybook/addon-knobs";

import "../__mocks__/map.css";
import BaseMap from "@opentripplanner/base-map";

import Vehicles from ".";
import VehicleLayer from "./VehicleLayer";
import VehicleGeometry from "./VehicleGeometry";
import * as utils from "./utils";

// mock data
const geojson = require("../__mocks__/lineGeom100.json");
const v1 = require("../__mocks__/all1.json");
const v2 = require("../__mocks__/all2.json");
const v3 = require("../__mocks__/all3.json");
const line = require("../__mocks__/line100.json");
const all = require("../__mocks__/all.json");

const v = [v1, v2, v3];

const portland = [45.523, -122.671];
const setTracked = action("setTracked");

function justPresentationComponents(vehicleData, highlight = "#d54a40") {
  const data = utils.reverseGeojsonPointsInGeom(geojson);
  const pattern = {
    id: "1",
    data
  };

  const trips = {
    9563136: "9563136",
    9563137: "9563137",
    9563138: "9563138",
    9562510: "9562510",
    9562512: "9562512",
    9562514: "9562514"
  };
  const tracked = utils.findVehicleById(
    line,
    select("Tracked Vehicle", trips, "9563137")
  );

  return (
    <BaseMap center={portland}>
      <VehicleLayer
        name="Real-Time Buses and Trains"
        vehicles={vehicleData}
        setTracked={setTracked}
        trackedVehicle={tracked}
        color={color("color:", "#555")}
        highlightColor={color("tracked color:", highlight)}
        visible
      />
      <VehicleGeometry
        trackedVehicle={tracked}
        pattern={pattern}
        highlightColor={color("tracked color:", highlight)}
        lowlightColor={color("trailing color:", "#AAA")}
        visible
      />
    </BaseMap>
  );
}

function allExample() {
  return justPresentationComponents(all);
}

function routeExample() {
  return justPresentationComponents(line, "#3e5a77");
}

function animatedExample() {
  const [vehicleData, setVehicleData] = React.useState(null);

  // the code below w/in useEffect is a simplified version of what's in vehcile-action.js / VechicleAction component
  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    let interval = null;

    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    if (vehicleData == null) {
      let i = 0;
      setVehicleData(v[i]);
      interval = setInterval(() => {
        i += 1;
        if (i >= v.length) i = 0;
        console.log(`using vehicle bundle: ${i + 1}`);
        setVehicleData(v[i]);
      }, 500);
    }

    return () => {
      // before vehicle view component unmounts, clear the interval...
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);

  return justPresentationComponents(vehicleData, "#6013FE");
}

function rtExample(name, visible) {
  const geometryUrl = "https://newplanner.trimet.org/ws/ti/v0/index";
  const vehicleUrl = "https://maps.trimet.org/gtfs/rt/vehicles/";

  return (
    <BaseMap center={portland}>
      <Vehicles
        name={name}
        visible={boolean("show vehicles:", visible)}
        geometryUrl={geometryUrl}
        vehicleUrl={vehicleUrl}
        vehicleQuery={text(
          "route numbers / all:",
          "routes/all?or=routes/90,100,190,200,290"
        )}
        tracked={text("block -or- trip id:", "track block: 9047")}
        refreshDelay={number("refresh interval:", 5000)}
        color={color("color:", "#777")}
        highlightColor={color("tracked color:", "#ece90d")}
        lowlightColor={color("trailing color:", "#AAA")}
        recenterMap={boolean("follow vehicle:", true)}
        panOffsetX={number("panOffsetX:", 0)}
        panOffsetY={number("panOffsetY:", 0)}
        hasPopup={boolean(
          "use marker popups -- note: edit story to 'false' and refresh:",
          true
        )}
        hasTooltip={boolean("use marker tooltips (desktop only):", true)}
        onTrackedVehicleUpdate={console.log}
      />
    </BaseMap>
  );
}

function rtExampleLayerSwitcher() {
  return rtExample("Real-Time Buses and Trains", true);
}
function rtExampleProgrammatic() {
  return rtExample(null, false);
}

storiesOf("TransitVehicleOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .add("by Route", routeExample)
  .add("all Routes", allExample)
  .add("animated VehicleLayer", animatedExample)
  .add("real-time vehicles in layer switcher", rtExampleLayerSwitcher)
  .add("real-time vehicles programmatic control", rtExampleProgrammatic);
