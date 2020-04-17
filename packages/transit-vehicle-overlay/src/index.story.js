import React, { useCallback, useState, useEffect } from "react";
import { throttle } from 'throttle-debounce';

import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";
import {
  //  text,
  //  number,
  color,
  withKnobs
} from "@storybook/addon-knobs";

import "../__mocks__/map.css";
import BaseMap from "@opentripplanner/base-map";
import TransitVehicleOverlay from "./index";

// marker / popup / tooltip slots
import ModeCircles from "./components/markers/ModeCircles";
import ModeRectangles from "./components/markers/ModeRectangles";
import CustomTooltip from "./components/popups/CustomTooltip";
import VehicleTooltip from "./components/popups/VehicleTooltip";
import VehiclePopup from "./components/popups/VehiclePopup";

import * as utils from "./utils";
import * as junk from "../__mocks__/junk";

const geom = require("../__mocks__/lineGeom100.json");
const line = require("../__mocks__/line100.json");
const all = require("../__mocks__/all.json");
const altLine = require("../__mocks__/tm_all.json");
const altGeom = require("../__mocks__/tm_geojson.json");

const PORTLAND = [45.523, -122.671];
const INITIAL_ZOOM_LEVEL = 14;
const setClicked = action("setClicked");

/** with static data, show a simple version of the real-time transit vehicles layer */
function simpleExample(vehicleData, patternGeometry, selectVehicleId) {
  // initial setup
  const recenter = utils.recenterPanTo();
  const initVehicle = utils.findVehicleById(vehicleData, selectVehicleId);
  const clickVehicle = vehicle => {
    setClicked(vehicle);
  };
  const fetchPattern = (vehicle, setter) => {
    utils.linterIgnoreTheseProps(vehicle);
    setter(patternGeometry);
  };

  // state setup for zoom (refreshes layer) and selected vehicles
  const [zoom, onViewportChanged] = utils.zoomState(INITIAL_ZOOM_LEVEL);
  const [
    routePattern,
    getTrackedVehicle,
    updateTrackedVehicle
  ] = utils.trackedVehicleState(fetchPattern, initVehicle, patternGeometry);

  const [trackedVehicle, trackedRef] = getTrackedVehicle();
  VehiclePopup.defaultProps.setTracked = updateTrackedVehicle;

  // storybook knobs to show off color & highlighting options
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
        vehicleList={vehicleData}
        onVehicleClicked={clickVehicle}
        selectedVehicle={trackedVehicle}
        pattern={routePattern}
        onRecenterMap={recenter}
        TooltipSlot={VehicleTooltip}
        PopupSlot={VehiclePopup}
        color={clr}
        highlightColor={highlightColor}
        lowlightColor={lowlightColor}
      />
    </BaseMap>
  );
}

/** with static data, demo rectangular markers, flyTo map re-centering and custom tooltips */
function rectangles(popup=true) {
  // initial setup
  const vehicleData = line;
  const patternGeometry = utils.makePattern(geom, "111");
  const recenter = utils.recenterFlyTo(null);
  const initVehicle = utils.findVehicleById(vehicleData, "9562512");

  // callback for tracking vehicle
  const fetchPattern = (vehicle, setter) => {
    utils.linterIgnoreTheseProps(vehicle);
    setter(patternGeometry);
  };

  // state setup for zoom (refreshes layer) and selected vehicles
  const [zoom, onViewportChanged] = utils.zoomState(INITIAL_ZOOM_LEVEL);
  const [
    routePattern,
    getTrackedVehicle,
    updateTrackedVehicle
  ] = utils.trackedVehicleState(fetchPattern, initVehicle, patternGeometry);
  const [trackedVehicle, trackedRef] = getTrackedVehicle();

  // give action to the popup vehicle tracking button
  VehiclePopup.defaultProps.setTracked = (vehicle, isTracked) => {
    updateTrackedVehicle(vehicle, isTracked);
    if(!isTracked)
      recenter(null, 0, 0); // clear out cached coords ... recenter on recently untracked vehicle
  };

  // record marker clicks (and more if no popup used)
  const clickVehicle = (vehicle, isTracked) => {
    setClicked(vehicle, isTracked);
    // if no popup (e.g., popup has a tracking button), then track on marker click instead
    if(!popup) {
      updateTrackedVehicle(vehicle, isTracked);
      if(!isTracked)
         // clear recenter coords, so map recenters on repeated clicks of same marker
        recenter(null, 0, 0);
    }
  };

  // tooltip content callback function
  CustomTooltip.defaultProps.getContent = (vehicle, isTracked) => {
    utils.linterIgnoreTheseProps(isTracked);
    const prettyDate = junk.makeRandomDate();
    let retVal;
    if (vehicle && vehicle.routeShortName) {
      retVal = `${vehicle.routeShortName} is arriving in ${prettyDate}`;
    } else {
      retVal = `Vehicle is arriving in ${prettyDate}`;
    }
    return retVal;
  };
  // if there's a popup, put perm tooltip on bottom of marker (since popup opens on top)
  if(popup)
    CustomTooltip.defaultProps.direction = "bottom";
  else
    CustomTooltip.defaultProps.direction = "top";

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
      onViewportChanged={onViewportChanged}
    >
      <TransitVehicleOverlay
        zoom={zoom}
        vehicleList={vehicleData}
        onVehicleClicked={clickVehicle}
        selectedVehicle={trackedVehicle}
        pattern={routePattern}
        onRecenterMap={recenter}
        MarkerSlot={ModeRectangles}
        TooltipSlot={CustomTooltip}
        PopupSlot={popup ? VehiclePopup : null}
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
  const altVehicles = utils.convertAltData(altLine);
  const altPattern = utils.makePattern(altGeom, "222");
  return simpleExample(altVehicles, altPattern, "9088");
}

function simpleRectangles() { return rectangles(false); }


/** with static data, show a simple version of the real-time transit vehicles layer */
function realtimeExample(fetchVehicles, fetchPattern) {
  // initial setup
  const recenter = utils.recenterFlyTo();
  const clickVehicle = vehicle => {
    setClicked(vehicle);
  };

  // state setup for zoom (refreshes layer) and selected vehicles
  const [zoom, onViewportChanged] = utils.zoomState(INITIAL_ZOOM_LEVEL);
  const [
    routePattern,
    getTrackedVehicle,
    updateTrackedVehicle
  ] = utils.trackedVehicleState(fetchPattern);

  // give action to the popup vehicle tracking button
  VehiclePopup.defaultProps.setTracked = (vehicle, isTracked) => {
    updateTrackedVehicle(vehicle, isTracked);
    if(!isTracked)
      recenter(null, 0, 0); // clear out cached coords ... recenter on recently untracked vehicle
  };

  const [trackedVehicle, trackedRef] = getTrackedVehicle();
  const vehicleList = fetchVehicles(getTrackedVehicle, updateTrackedVehicle);

  return (
    <BaseMap
      center={PORTLAND}
      zoom={INITIAL_ZOOM_LEVEL}
      onViewportChanged={onViewportChanged}
    >
      <TransitVehicleOverlay
        zoom={zoom}
        vehicleList={vehicleList}
        onVehicleClicked={clickVehicle}
        selectedVehicle={trackedVehicle}
        pattern={routePattern}
        onRecenterMap={recenter}
        TooltipSlot={VehicleTooltip}
        PopupSlot={VehiclePopup}
      />
    </BaseMap>
  );
}

const refreshInterval = 5000;
function fetchVehicles(getTrackedVehicle, updateTrackedVehicle) {
  const [vehicleList, setVehicleList] = useState([]);

  const fetchData = useCallback(async () => {
    const vehicles = await junk.fetchVehicles();
    if(vehicles){
      // todo maybe DQ vehicles data here before updating our vehicles list
      setVehicleList(vehicles);
      const [trackedVehicle, trackedRef] = getTrackedVehicle();
      const tracked = trackedRef;

      // update the tracked vehicle with latest position
      const queryId = utils.getVehicleId(tracked);
      if(queryId && updateTrackedVehicle) {
        const t = utils.findVehicleById(vehicles, queryId);
        if (t) updateTrackedVehicle(t, false, true);
      }
    }
  }, [fetchVehicles]);

  useEffect(() => {
    const onInterval = async () => {
      const newVehicle = await fetchData();
    };
    onInterval();
    const intervalId = setInterval(onInterval, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  return vehicleList;
}

function rtCircles() {
  return realtimeExample(fetchVehicles, junk.fetchPattern, ModeCircles);
}

function rtRectangles() {
  return realtimeExample(junk.fetchVehiclesDeveloper, junk.fetchPattern, ModeRectangles);
}

storiesOf("TransitVehicleOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .add("simple overlay", simple)
  .add("simple overlay (alternate vehicles service)", alternate)
  .add("simple rectangles (click to select)", simpleRectangles)
  .add("static rectangles (popups)", rectangles)
  .add("real-time circles", rtCircles)
  .add("real-time rectangles", rtRectangles);
