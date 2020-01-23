import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup, Polyline } from "react-leaflet";

import * as turf from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

import { vehicleType } from "../types";

turf.nearestPointOnLine = nearestPointOnLine;

/**
 * returns the point (geom array index) on the line that is closest to the vehicle
 *
 * @param vehicle
 * @param geom
 * @returns {number}
 */
function findPointOnLine(vehicle, geom) {
  let retVal = 0;
  if (vehicle && geom && geom.length > 1) {
    const pt = turf.point([vehicle.lat, vehicle.lon]);
    const line = turf.lineString(geom);
    const snapped = turf.nearestPointOnLine(line, pt, { units: "miles" });
    if (
      snapped &&
      snapped.properties.index &&
      snapped.properties.index < geom.length
    ) {
      retVal = snapped.properties.index;
    }
  }
  return retVal;
}

/**
 * break a line geometry in 2 at the vehicle location
 * @param geom
 * @param splitPt
 * @param key
 * @returns {*}
 */
function splitGeometry(geom, splitPt, key) {
  let retVal = null;
  if (geom) {
    const geomPast = [];
    const geomFuture = [];

    for (let i = 0; i < geom.length; i++) {
      if (i <= splitPt) geomPast.push(geom[i]);
      if (i >= splitPt) geomFuture.push(geom[i]);
    }
    retVal = [
      { key: `${key}-PAST`, geometry: geomPast },
      { key: `${key}-FUTURE`, geometry: geomFuture }
    ];
  }
  return retVal;
}

/**
 * creates the line segments array for the overlay
 * @param splitGeom
 * @param highlight
 * @param lowlight
 * @param weight
 * @param opacity
 * @returns {Array}
 */
function makeSplitLine(splitGeom, highlight, lowlight, weight, opacity) {
  const segments = [];
  if (splitGeom && splitGeom.length === 2) {
    segments.push(
      <Polyline
        key={splitGeom[0].key}
        positions={splitGeom[0].geometry}
        color={lowlight}
        weight={weight}
        opacity={opacity}
      />
    );
    segments.push(
      <Polyline
        key={splitGeom[1].key}
        positions={splitGeom[1].geometry}
        color={highlight}
        weight={weight}
        opacity={opacity}
      />
    );
  }
  return segments;
}

/**
 * vehicle geometry component that creates a map overlay for the line geometry showing
 * the travel pattern of a vehicle
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function VehicleGeometry(props) {
  const { trackedVehicle } = props;
  const { pattern } = props;
  const { highlight, lowlight, opacity, weight } = props;

  let retVal = <FeatureGroup />;
  if (trackedVehicle && pattern) {
    const pt = findPointOnLine(trackedVehicle, pattern);
    const geom = splitGeometry(pattern, pt, trackedVehicle.patternId);
    const segments = makeSplitLine(geom, highlight, lowlight, weight, opacity);
    if (segments && segments.length === 2)
      retVal = (
        <FeatureGroup>
          <div>{segments}</div>
        </FeatureGroup>
      );
  }
  return retVal;
}

VehicleGeometry.defaultProps = {
  trackedVehicle: null,
  pattern: null,
  highlight: "#00bfff",
  lowlight: "#555555",
  weight: 4.0,
  opacity: 0.85
};

VehicleGeometry.propTypes = {
  trackedVehicle: vehicleType,
  pattern: PropTypes.shape({}),
  highlight: PropTypes.string,
  lowlight: PropTypes.string,
  weight: PropTypes.number,
  opacity: PropTypes.number
};

export default VehicleGeometry;
