import BaseMap from "@opentripplanner/base-map";
import React from "react";
import PropTypes from "prop-types";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import Vehicles from "./vehicles";
import "@opentripplanner/base-map/assets/map.css";

const line = require("../__mocks__/line100.json");
const all = require("../__mocks__/all.json");
const v1 = require("../__mocks__/all1.json");
const v2 = require("../__mocks__/all2.json");
const v3 = require("../__mocks__/all3.json");

function Map(props) {
  const { center } = props;
  const { vehicles } = props;
  return (
    <BaseMap center={center}>
      <Vehicles name="Real-Time Buses and Trains" vehicles={vehicles} visible />
    </BaseMap>
  );
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

const portland = [45.523, -122.671];

function allExample(props) {
  const retVal = <Map center={portland} vehicles={all} />;
  return retVal;
}

function routeExample(props) {
  const retVal = <Map center={portland} vehicles={line} />;
  return retVal;
}

function cp(a, d) {
  for (let i = 0; i < a.length; i++) a.pop();

  for (let k = 0; k < d.length; k++) a.push(d[k]);
}

function animateExample(props) {
  const v = [v1, v2, v3];

  let i = 0;
  const vehicleData = [];
  cp(vehicleData, v1);
  setInterval(function() {
    console.log(`${i} ${vehicleData.length}`);
    i += 1;
    if (i >= v.length) i = 0;
    cp(vehicleData, v[i]);
  }, 5000);

  const retVal = <Map center={portland} vehicles={vehicleData} />;
  return retVal;
}

storiesOf("Realtime Vehicles", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("by Route", routeExample)
  .add("all Routes", allExample)
  .add("animate Vehicles", animateExample);
