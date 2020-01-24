/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Polyline } from "react-leaflet";

import * as turf from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

turf.nearestPointOnLine = nearestPointOnLine;

/**
 * returns the point (geom array index) on the line that is closest to the vehicle
 *
 * @param vehicle
 * @param geom
 * @returns {number}
 */
export function findPointOnLine(vehicle, geom) {
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
export function splitGeometry(geom, splitPt, key) {
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
 * @returns {Array}
 */
export function makeSplitLine(splitGeom, highlight, lowlight) {
  const segments = [];
  if (splitGeom && splitGeom.length === 2) {
    segments.push(
      <Polyline
        key={splitGeom[0].key}
        positions={splitGeom[0].geometry}
        {...lowlight}
      />
    );
    segments.push(
      <Polyline
        key={splitGeom[1].key}
        positions={splitGeom[1].geometry}
        {...highlight}
      />
    );
  }
  return segments;
}
