import React from "react";
import PropTypes from "prop-types";

import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import BaseMap from "@opentripplanner/base-map";

import VehicleLayer from "./vehicle-layer";
import "@opentripplanner/base-map/assets/map.css";

const line = require("../__mocks__/line100.json");
const all = require("../__mocks__/all.json");
const v1 = require("../__mocks__/all1.json");
const v2 = require("../__mocks__/all2.json");
const v3 = require("../__mocks__/all3.json");

const v = [v1, v2, v3];
const portland = [45.523, -122.671];

function Map(props) {
  const { center } = props;
  const { vehicles } = props;
  return (
    <BaseMap center={center}>
      <VehicleLayer
        name="Real-Time Buses and Trains"
        vehicles={vehicles}
        visible
      />
    </BaseMap>
  );
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

function allExample() {
  const retVal = <Map center={portland} vehicles={all} />;
  return retVal;
}

function routeExample() {
  const retVal = <Map center={portland} vehicles={line} />;
  return retVal;
}

function animateExample() {
  const [vehicleData, setVehicleData] = React.useState(null);

  // the code below w/in useEffect is a simplified version of what's in vehcile-action.js / VechicleAction component
  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    let getDataInterval = null;

    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    if (vehicleData == null) {
      let i = 0;
      setVehicleData(v[i]);
      getDataInterval = setInterval(() => {
        i += 1;
        if (i >= v.length) i = 0;
        console.log(`using vehicle bundle: ${i + 1}`);
        setVehicleData(v[i]);
      }, 3000);
    }

    return () => {
      // before vehicle view component unmounts, clear the interval...
      if (getDataInterval) {
        clearInterval(getDataInterval);
        getDataInterval = null;
      }
    };
  }, []);

  const retVal = <Map center={portland} vehicles={vehicleData}></Map>;
  return retVal;
}

storiesOf("Realtime VehicleLayer", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("by Route", routeExample)
  .add("all Routes", allExample)
  .add("animate VehicleLayer", animateExample);
