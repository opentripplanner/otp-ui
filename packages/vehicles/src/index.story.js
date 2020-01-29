import React from "react";

import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, color, boolean, select } from "@storybook/addon-knobs";

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

const trips = {
  9563136: '9563136',
  9563137: '9563137',
  9563138: '9563138',
  9562510: '9562510',
  9562512: '9562512',
  9562514: '9562514',
};


function allExample() {
  const data = utils.reverseGeojsonPointsInGeom(geojson);
  const pattern = {
    id: "1",
    data
  };
  const tracked = utils.findVehicleById(line, select('Tracked Vehicle', trips, '9562512'));

  const retVal = (
    <BaseMap center={portland}>
      <VehicleLayer
        name="Real-Time Buses and Trains"
        vehicles={all}
        setTracked={setTracked}
        trackedVehicle={tracked}
        color={color('tracked color:', "#d54a40")}
        visible
      />
      <VehicleGeometry
        trackedVehicle={tracked}
        pattern={pattern}
        color={color('tracked color:', "#d54a40")}
        visible />
    </BaseMap>
  );
  return retVal;
}

function routeExample() {
  const data = utils.reverseGeojsonPointsInGeom(geojson);
  const pattern = {
    id: "1",
    data
  };
  const tracked = utils.findVehicleById(line, select('Tracked Vehicle', trips, '9562512'));

  const retVal = (
    <BaseMap center={portland}>
      <VehicleLayer
        name="Real-Time Buses and Trains"
        setTracked={setTracked}
        trackedVehicle={tracked}
        vehicles={line}
        color={color('tracked color:', "#3e5a77")}
        visible
      />
      <VehicleGeometry
        trackedVehicle={tracked}
        pattern={pattern}
        color={color('tracked color:', "#3e5a77")}
        visible
      />
    </BaseMap>
  );
  return retVal;
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

  const tracked = utils.findVehicleById(line, select('Tracked Vehicle', trips, '9562512'));
  const retVal = (
    <BaseMap center={portland}>
      <VehicleLayer
        name="Real-Time Buses and Trains"
        vehicles={vehicleData}
        setTracked={setTracked}
        trackedVehicle={tracked}
        visible
      />
    </BaseMap>
  );
  return retVal;
}

function rtExample() {
  const retVal = (
    <BaseMap center={portland}>
      <Vehicles
        name="Real-Time Buses and Trains"
        tracked={text('vehicle id:', '2927')}
        color={color('tracked color:', "#3e5a77")}
        follow={boolean('follow vehicle:', false)}
        visible
      />
    </BaseMap>
  );
  return retVal;
}

storiesOf("Realtime VehicleLayer", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .add("by Route", routeExample)
  .add("all Routes", allExample)
  .add("animated VehicleLayer", animatedExample)
  .add("real-time Vehicles layer", rtExample);
