import React from "react";

import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import { text, boolean, color, withKnobs } from "@storybook/addon-knobs";

import "../__mocks__/map.css";
import BaseMap from "@opentripplanner/base-map";
import { formatDurationWithSeconds } from "@opentripplanner/core-utils/src/time";
import TransitVehicleOverlay from "./index";

// marker / popup / tooltip slots
import { Circle, CircledVehicle } from "./components/markers/ModeCircles";
import {
  BusRectangle,
  DetailedRectangle,
  LightRailVehicleRectangle
} from "./components/markers/ModeRectangles";
import CustomTooltip from "./components/popups/CustomTooltip";
import VehicleTooltip from "./components/popups/VehicleTooltip";
import VehiclePopup from "./components/popups/VehiclePopup";

import * as utils from "./utils";
import * as proprietary from "../__mocks__/proprietaryFetchUtils";

const geom = require("../__mocks__/lineGeom100.json");
const line = require("../__mocks__/line100.json");
const all = require("../__mocks__/all.json");
const altLine = require("../__mocks__/tm_all.json");
const altGeom = require("../__mocks__/tm_geojson.json");

const PORTLAND = [45.523, -122.671];
const INITIAL_ZOOM_LEVEL = 14;
const setClicked = action("setClicked");

const circleSymbols = [
  {
    minZoom: 0,
    symbol: Circle
  },
  {
    minZoom: 14,
    symbol: CircledVehicle
  }
];

const rectangleSymbols = [
  {
    getType: vehicle => vehicle.routeType,
    minZoom: 0,
    symbol: LightRailVehicleRectangle,
    symbolByType: {
      BUS: BusRectangle
    }
  },
  {
    minZoom: 14,
    symbol: DetailedRectangle
  }
];

/** using static vehicle and geom data, show a simple demo of transit vehicle component */
function simpleExample(vehicleData, patternGeometry, selectVehicleId) {
  // find our tracked vehicle from the vehicle list
  const trackedVehicle = utils.findVehicleById(vehicleData, selectVehicleId);

  // tracking zoom state is used to change the vehicle markers from blank circles to mode images
  const [zoom, onViewportChanged] = utils.useZoomState();

  // storybook knobs further show off color & highlighting options
  const clr = color("color:", "#AAA");
  const highlightColor = color("isTracked color:", "#ece90d");
  const lowlightColor = color("trailing color:", "#AAA");

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
      onViewportChanged={onViewportChanged}
    >
      <TransitVehicleOverlay
        zoom={zoom}
        symbols={circleSymbols}
        vehicleList={vehicleData}
        selectedVehicle={trackedVehicle}
        pattern={patternGeometry}
        onRecenterMap={utils.recenterPanTo()}
        TooltipSlot={VehicleTooltip}
        color={clr}
        highlightColor={highlightColor}
        lowlightColor={lowlightColor}
      />
    </BaseMap>
  );
}

/**
 * A more complex demo of the vehicle component from the simple demo above.
 * Will still be using static vehicle and geometry data here, but now will
 * use rectangular markers, various popup and tooltip slots and the flyTo centering,
 * and callbacks to manage vehicle tracking and route geom split points, etc...
 */
function rectangles(popup = true) {
  // initial setup
  const vehicleData = line;
  const patternGeometry = utils.makePattern(geom, "111");

  const doTracking = boolean("Recenter map on tracked vehcile", true);
  const recenter = utils.recenterFlyTo(null, 0, doTracking);
  const initVehicle = utils.findVehicleById(vehicleData, "9562512");

  // storybook knobs to show off color & highlighting options
  const clr = color("color:", "#728896");
  const highlightColor = color("isTracked color:", "#63BBDD");
  const lowlightColor = color("trailing color:", "#728896");

  // callback for tracking vehicle
  const fetchPattern = (vehicle, setter) => {
    utils.linterIgnoreTheseProps(vehicle);
    setter(patternGeometry);
  };

  // state setup for zoom (refreshes layer) and selected vehicles
  const [zoom, onViewportChanged] = utils.useZoomState(INITIAL_ZOOM_LEVEL);
  const [
    getRoutePattern,
    getTrackedVehicle,
    updateTrackedVehicle
  ] = utils.useTrackedVehicleState(fetchPattern, initVehicle, patternGeometry);
  const [trackedVehicle, trackedRef] = getTrackedVehicle();
  utils.linterIgnoreTheseProps(trackedRef);

  // give action to the popup vehicle tracking button
  VehiclePopup.defaultProps.setTracked = (vehicle, isTracked) => {
    updateTrackedVehicle(vehicle, isTracked);
    if (!isTracked) recenter(null, 0, doTracking, 0); // no longer tracking so clear out cached coords
  };

  // record marker clicks (and more if no popup used)
  const clickVehicle = (vehicle, isTracked) => {
    setClicked(vehicle, isTracked);
    // if no popup (e.g., popup has a tracking button), then track on marker click instead
    if (!popup) {
      updateTrackedVehicle(vehicle, isTracked);
      if (!isTracked)
        // clear recenter coords, so map recenters on repeated clicks of same marker
        recenter(null, 0, true, 0);
    }
  };

  // silly function used to change the arrival time (tooltip) in this example
  function makeRandomDate() {
    const secs = Date.now() % 379;
    const prettyDate = formatDurationWithSeconds(secs);
    return prettyDate;
  }

  // tooltip content callback function
  CustomTooltip.defaultProps.getContent = (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(isTracked);
    const prettyDate = makeRandomDate();
    let retVal;
    if (vehicle && vehicle.routeShortName) {
      retVal = `${vehicle.routeShortName} is arriving in ${prettyDate}`;
    } else {
      retVal = `Vehicle is arriving in ${prettyDate}`;
    }
    return retVal;
  };

  // if there's a popup, place the tooltip on bottom of marker (since popup opens on top)
  CustomTooltip.defaultProps.direction = popup ? "bottom" : "rotation";

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
      onViewportChanged={onViewportChanged}
    >
      <TransitVehicleOverlay
        name={null} // turn off component from being controlled in the layer switcher
        zoom={zoom}
        vehicleList={vehicleData}
        onVehicleClicked={clickVehicle}
        selectedVehicle={trackedVehicle}
        pattern={getRoutePattern()}
        onRecenterMap={recenter}
        symbols={rectangleSymbols}
        TooltipSlot={CustomTooltip}
        PopupSlot={popup ? VehiclePopup : null}
        color={clr}
        highlightColor={highlightColor}
        lowlightColor={lowlightColor}
      />
    </BaseMap>
  );
}

/**
 * use a live real-time service to fully demonstrate the transit vehicles component
 * continuing on from the 'rectangles' demo above, add live data, callbacks, etc...
 * also provide knobs to control which routes to display and programmatically select vehicles
 */
function realtimeExample(fetchVehicles, fetchPattern, markers) {
  // knobs setup
  const routes = text("list of routes to query vehicles", "");
  const trackedId = text("tripId or blockId of tracked vehicle", "");
  const isFlyTo = boolean("FlyTo Recenter (PanTo default)", false);
  const showOnlyTracked = boolean("hide other vehicles when tracking", false);
  const clr = color("color:", "#28639c");
  const highlightColor = color("isTracked color:", "#D1472D");

  // recenter the map via either FlyTo or PanTo
  const recenter = isFlyTo ? utils.recenterFlyTo() : utils.recenterPanTo();
  const clickVehicle = vehicle => {
    setClicked(vehicle);
  };

  // state setup for zoom and center (changes redraws layer) and selected vehicles
  const [zoom, center, onViewportChanged] = utils.useViewState();

  // state setup tracking vehicle (and drawing it's route geom)
  const [
    getRoutePattern,
    getTrackedVehicle,
    updateTrackedVehicle
  ] = utils.useTrackedVehicleState(fetchPattern);

  // give action to the popup vehicle tracking button
  VehiclePopup.defaultProps.setTracked = (vehicle, isTracked) => {
    updateTrackedVehicle(vehicle, isTracked);
    if (!isTracked) recenter(null, 0, true, 0); // clear out cached coords ... recenter on recently untracked vehicle
  };

  const [trackedVehicle, trackedRef] = getTrackedVehicle();
  utils.linterIgnoreTheseProps(trackedRef);
  const vehicleList = utils.useVehicleListUpdater(
    fetchVehicles,
    getTrackedVehicle,
    updateTrackedVehicle
  );

  // knobs override defaults for route list and select vehicle (popup button) methods
  // note: this knob override of vehicle selection would need to be handled better in real life
  proprietary.setDefRoutes(routes);
  let tv = trackedVehicle;
  if (trackedId) {
    const t = utils.findVehicleById(vehicleList, trackedId);
    if (t) tv = t;
  }

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
      onViewportChanged={onViewportChanged}
    >
      <TransitVehicleOverlay
        zoom={zoom}
        center={center}
        vehicleList={vehicleList}
        onVehicleClicked={clickVehicle}
        selectedVehicle={tv}
        showOnlyTracked={showOnlyTracked}
        pattern={getRoutePattern(tv)}
        onRecenterMap={recenter}
        color={clr}
        highlightColor={highlightColor}
        symbols={markers}
        TooltipSlot={VehicleTooltip}
        PopupSlot={VehiclePopup}
      />
    </BaseMap>
  );
}

function simple() {
  // convert geojson data into expected pattern format
  const pattern = utils.makePattern(geom, "111");
  return simpleExample(all, pattern, "9050");
}

function alternate() {
  // demonstrate converting an alternate vehicle ws format for the component
  const altVehicles = utils.convertAltData(altLine);
  const altPattern = utils.makePattern(altGeom, "222");
  return simpleExample(altVehicles, altPattern, "9088");
}

function clickRectangles() {
  return rectangles(false);
}

function rtCircles() {
  // use the live vehicle ws that was built in conjunction with this component
  return realtimeExample(
    proprietary.fetchVehicles,
    proprietary.fetchPatternThrottled,
    circleSymbols
  );
}

function rtRectangles() {
  // use the live alternate vehicle ws format for the component
  return realtimeExample(
    proprietary.fetchAltVehicles,
    proprietary.fetchPatternThrottled,
    rectangleSymbols
  );
}

storiesOf("TransitVehicleOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .add("simple overlay", simple)
  .add("simple overlay (alternative ws data)", alternate)
  .add("simple rectangles (click to select)", clickRectangles)
  .add("static rectangles (marker popups)", rectangles)
  .add("real-time circles", rtCircles)
  .add("real-time rectangles", rtRectangles);
