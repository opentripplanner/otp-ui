/**
 * utilities to manipulate (line) geometries, ala splitting the pattern geometry into 2
 * sections, of has already travelled, and to be travelled, etc...
 */
import React from "react";
import { Polyline } from "react-leaflet";
import * as turf from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

turf.nearestPointOnLine = nearestPointOnLine;

/**
 * creates the line segments array for the overlay
 *
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
        {...lowlight} // eslint-disable-line react/jsx-props-no-spreading
      />
    );
    segments.push(
      <Polyline
        key={splitGeom[1].key}
        positions={splitGeom[1].geometry}
        {...highlight} // eslint-disable-line react/jsx-props-no-spreading
      />
    );
  }
  return segments;
}

/**
 * returns the point (geom array index) on the line that is closest to the vehicle
 *
 * @param vehicle
 * @param geom
 * @returns {number}
 */
export function findPointOnLine(splitPoint, geom) {
  let retVal = 0;
  if (splitPoint && geom && geom.length > 1) {
    const pt = turf.point(splitPoint);
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
export function splitLineGeometry(geom, splitPt, key) {
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
 * geojson uses [lon,lat] (e.g., [X, Y]) in representing coordinates
 * this utility function reverses the point order to be [lat, lon] (or [Y, X])
 *
 * @return array of reversed points in the line geom
 */
export function reverseGeojsonPoints(geom) {
  const revPoints = [];
  for (let i = 0; i < geom.coordinates.length; i++) {
    if (geom.coordinates[i] && geom.coordinates[i].length === 2) {
      const c = [geom.coordinates[i][1], geom.coordinates[i][0]];
      revPoints.push(c);
    }
  }
  return revPoints;
}

/** turns geojson line into a pattern (line + id object) for route renderer */
export function makePattern(geojson, id) {
  const data = reverseGeojsonPoints(geojson);
  const pattern = { id, data };
  return pattern;
}
