import React from "react";
import { FeatureGroup, MapLayer, Polyline } from "react-leaflet";

import polyline from "@mapbox/polyline";
import * as turf from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

turf.nearestPointOnLine = nearestPointOnLine;

// const tiUrl = "https://maps.trimet.org/otp_mod/index";
// const tiUrl = "http://localhost:54445/ti";
// const tiUrl = "https://maps7.trimet.org/ti/index";
const tiUrl = "https://newplanner.trimet.org/ws/ti/v0/index"; // TODO: FIX ME !!

// const geojson = "";  // use this setting if want to use encoded vs. geojson
const geojson = "/geojson";

class VehicleGeometry extends MapLayer {
  patterns = [];

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps() {}

  createLeafletElement() {}

  updateLeafletElement() {}

  cachePatternEncoded(pat, key) {
    const geom = pat.points;
    const pts = polyline.decode(geom);
    this.patterns[key] = pts;
  }

  /**
   * will cache the [[lat,lon], [lat,lon], etc...] coords
   * note: geojson uses [lon,lat] (e.g., [X, Y], so must reverse that to match encoded coords
   */
  cachePatternGeojson(pat, key) {
    const revCoords = [];
    for (let i = 0; i < pat.coordinates.length; i++) {
      const c = pat.coordinates[i].reverse();
      revCoords.push(c);
    }
    this.patterns[key] = revCoords;
  }

  getAgencyPattern(vehicle) {
    const a = vehicle.agencyId || "TriMet";
    const p = vehicle.shapeId;
    return `${a}:${p}`;
  }

  getUrl(vehicle, ap) {
    const d = Date.now();
    if (!ap) ap = this.getAgencyPattern(vehicle);

    const retVal = `${tiUrl}/patterns/${ap}/geometry${geojson}?date=${d}`;
    return retVal;
  }

  callGeometryWS(vehicle) {
    // https://maps.trimet.org/otp_mod/index/patterns/TriMet:190:0:04/geometry
    let retVal = null;

    const ap = this.getAgencyPattern(vehicle);
    const geomWsUrl = this.getUrl(vehicle, ap);

    console.log(`Calling GEO URL: ${geomWsUrl}`);
    fetch(geomWsUrl)
      .then(res => {
        retVal = res.json();
        return retVal;
      })
      .then(json => {
        if (geomWsUrl.indexOf("geojson") >= 0) {
          this.cachePatternGeojson(json, ap);
        } else {
          this.cachePatternEncoded(json, ap);
        }
      })
      .catch(error => {
        console.log(`VEH GEOMETRY fetch() error: ${error}`);
      });
    return retVal;
  }

  findPointOnLine(vehicle, geom) {
    let retVal = 0;

    const pt = turf.point([vehicle.lat, vehicle.lon]);
    const line = turf.lineString(geom);
    const snapped = turf.nearestPointOnLine(line, pt, { units: "miles" });
    if (snapped && snapped.properties.index) {
      retVal = snapped.properties.index;
    }

    return retVal;
  }

  getGeometry(vehicle) {
    /**
     * find the vehicle's pattern, either in cache or via the pattern service (which is not request/
     * /response, thus might not come back in this call)
     */
    let retVal = null;

    // step 1: get the geometry (either from cache or by calling the pattern service)
    const key = this.getAgencyPattern(vehicle);
    let geom = this.patterns[key];
    if (!geom) {
      this.callGeometryWS(vehicle);
      geom = this.patterns[key];
    }

    // step 2: if we have a line geometry, let's break it in 2 at the vehicle location
    if (geom) {
      const geomGray = [];
      const geomColor = [];
      let mid = 0;

      if (vehicle.stopSequence === 1) mid = 0;
      else mid = this.findPointOnLine(vehicle, geom);

      for (let i = 0; i < geom.length; i++) {
        if (i <= mid) geomGray.push(geom[i]);
        if (i >= mid) geomColor.push(geom[i]);
      }
      retVal = [
        { key: `${key}-PAST`, geometry: geomGray },
        { key: `${key}-FUTURE`, geometry: geomColor }
      ];
    }

    return retVal;
  }

  render() {
    const vehicle = this.props.trackedVehicle;
    if (!vehicle) return <FeatureGroup />;

    const pattern = this.getGeometry(vehicle);
    if (!pattern) return <FeatureGroup />;

    console.log(
      `drawing geometry for pattern ${this.getAgencyPattern(vehicle)}`
    );

    const gray = "#555555";
    const color = "#00bfff";
    const segments = [];
    segments.push(
      <Polyline
        key={pattern[0].key}
        positions={pattern[0].geometry}
        weight={4}
        color={gray}
        opacity={0.8}
      />
    );
    segments.push(
      <Polyline
        key={pattern[1].key}
        positions={pattern[1].geometry}
        weight={4}
        color={color}
        opacity={0.8}
      />
    );

    return segments.length > 0 ? (
      <FeatureGroup>
        <div>{segments}</div>
      </FeatureGroup>
    ) : (
      <FeatureGroup />
    );
  }
}

export default VehicleGeometry;
