import { SymbolLayout } from "mapbox-gl";
import React, { useEffect } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import polyline from "@mapbox/polyline";
import {
  Leg,
  TransitiveData,
  TransitiveJourney,
  TransitivePattern,
  TransitivePlace
} from "@opentripplanner/types";
import bbox from "@turf/bbox";

import { itineraryToTransitive } from "./util";

export { itineraryToTransitive };

// TODO: BETTER COLORS
const modeColorMap = {
  CAR: "#888",
  BICYCLE: "#f00",
  SCOOTER: "#f5a729",
  MICROMOBILITY: "#f5a729",
  MICROMOBILITY_RENT: "#f5a729",
  WALK: "#86cdf9"
};

/**
 * Apply a thin, white halo around the (black) text.
 */
const defaultTextPaintParams = {
  "text-halo-blur": 1,
  "text-halo-color": "#ffffff",
  "text-halo-width": 2
};

/**
 * Text size and layout that lets maplibre relocate text space permitting.
 */
const defaultTextLayoutParams: SymbolLayout = {
  "symbol-placement": "point",
  "text-allow-overlap": false,
  "text-field": ["get", "name"],
  "text-radial-offset": 1,
  "text-size": 15,
  "text-variable-anchor": [
    "left",
    "right",
    "top",
    "bottom",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ]
};

/**
 * Default text + bold default fonts
 */
const defaultBoldTextLayoutParams = {
  ...defaultTextLayoutParams,
  // FIXME: find a better way to set a bold font
  "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"]
};

const routeFilter = ["==", "type", "route"];
const stopFilter = ["==", "type", "stop"];
const accessLegFilter = [
  "match",
  ["get", "type"],
  ["BICYCLE", "SCOOTER", "MICROMOBILITY", "MICROMOBILITY_RENT", "CAR"],
  true,
  false
];

type Props = {
  activeLeg?: Leg;
  transitiveData: TransitiveData;
};

const TransitiveCanvasOverlay = ({
  activeLeg,
  transitiveData
}: Props): JSX.Element => {
  const { current: map } = useMap();

  const geojson: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    Record<any, any>
  > = {
    type: "FeatureCollection",
    // @ts-expect-error TODO: fix the type above for geojson
    features: [
      ...(transitiveData?.places || []).flatMap((place: TransitivePlace) => {
        return {
          type: "Feature",
          properties: {
            color: modeColorMap[place.type] || "#008",
            name: place.place_name,
            type: place.type || "place"
          },
          geometry: {
            type: "Point",
            coordinates: [place.place_lon, place.place_lat]
          }
        };
      }),
      ...(transitiveData?.journeys || []).flatMap(
        (journey: TransitiveJourney) =>
          journey.segments
            .filter(segment => segment.streetEdges?.length > 0)
            .map(segment => ({
              ...segment,
              geometries: segment.streetEdges.map(edge => {
                return transitiveData.streetEdges.find(
                  entry => entry.edge_id === edge
                );
              })
            }))
            .flatMap(segment => {
              return segment.geometries.map(geometry => {
                return {
                  type: "Feature",
                  properties: {
                    type: "street-edge",
                    color: modeColorMap[segment.type] || "#008",
                    mode: segment.type
                  },
                  geometry: polyline.toGeoJSON(geometry.geometry.points)
                };
              });
            })
      ),
      ...(transitiveData?.patterns || []).flatMap(
        (pattern: TransitivePattern) =>
          pattern.stops
            .map(stop => stop.geometry)
            .filter(geometry => !!geometry)
            .map(geometry => {
              const route = Object.entries(transitiveData.routes).find(
                r => r[1].route_id === pattern.route_id
              )[1];

              return {
                type: "Feature",
                properties: {
                  color: `#${route.route_color || "000080"}`,
                  name: route.route_short_name || route.route_long_name || "",
                  routeType: route.route_type,
                  type: "route"
                },
                geometry: polyline.toGeoJSON(geometry)
              };
            })
      ),
      // Extract the first and last stops of each transit segment for display.
      ...(transitiveData?.journeys || [])
        .flatMap(journey => journey.segments)
        .filter(segment => segment.type === "TRANSIT")
        .map(segment =>
          transitiveData.patterns.find(
            p => p.pattern_id === segment.patterns[0]?.pattern_id
          )
        )
        .filter(pattern => !!pattern)
        .flatMap(pattern =>
          pattern.stops.filter(
            (_, index, stopsArr) => index === 0 || index === stopsArr.length - 1
          )
        )
        .map(pStop =>
          // pStop (from pattern.stops) only has an id (and sometimes line geometry)
          transitiveData.stops.find(stop => stop.stop_id === pStop.stop_id)
        )
        .map(stop => ({
          type: "Feature",
          properties: { name: stop.stop_name, type: "stop" },
          geometry: {
            type: "Point",
            coordinates: [stop.stop_lon, stop.stop_lat]
          }
        }))
    ]
  };

  const zoomToGeoJSON = geoJson => {
    const b = bbox(geoJson);
    const bounds: [number, number, number, number] = [b[0], b[1], b[2], b[3]];

    if (bounds.length === 4 && bounds.every(Number.isFinite)) {
      map?.fitBounds(bounds, {
        duration: 500,
        padding: 200
      });
    }
  };

  useEffect(() => {
    zoomToGeoJSON(geojson);
  }, [transitiveData]);

  useEffect(() => {
    if (!activeLeg?.legGeometry) return;
    zoomToGeoJSON(polyline.toGeoJSON(activeLeg.legGeometry.points));
  }, [activeLeg]);

  // Generally speaking, text/symbol layers placed first will be rendered in a lower layer
  // (or, if it is text, rendered with a lower priority or not at all if higher-priority text overlaps).
  return (
    <Source data={geojson} id="itinerary" type="geojson">
      {/* First, render access legs then transit lines so that all lines appear under any text or circle
          and transit lines appears above access legs. Walking legs are under a separate layer
          because they use a different line dash that cannot be an expression. */}
      <Layer
        // This layer is for WALK modes - dotted path
        filter={["all", ["==", "type", "street-edge"], ["==", "mode", "WALK"]]}
        id="street-edges-walk"
        layout={{
          "line-cap": "round",
          "line-join": "round"
        }}
        paint={{
          // TODO: get from transitive properties
          "line-color": ["get", "color"],
          // First parameter of array is the length of the dash which is set to zero,
          // so that maplibre simply adds the rounded ends to make things look like dots.
          // Even so, note that maplibre still renders beans instead of dots
          // (as if maplibre fuses dots together).
          "line-dasharray": [0, 1.3],
          "line-opacity": 0.9,
          "line-width": 6
        }}
        type="line"
      />
      <Layer
        // This layer is for other modes - dashed path
        filter={["all", ["==", "type", "street-edge"], ["!=", "mode", "WALK"]]}
        id="street-edges"
        layout={{
          "line-cap": "butt"
        }}
        paint={{
          // TODO: get from transitive properties
          "line-color": ["get", "color"],
          "line-dasharray": [2, 1],
          // TODO: get from transitive properties
          "line-width": 4,
          "line-opacity": 0.9
        }}
        type="line"
      />
      <Layer
        filter={routeFilter}
        id="routes"
        layout={{
          "line-join": "round",
          "line-cap": "round"
        }}
        paint={{
          "line-color": ["get", "color"],
          // Apply a thinner line (width = 6) for bus routes (route_type = 3), set width to 10 otherwise.
          "line-width": ["match", ["get", "routeType"], 3, 6, 10],
          "line-opacity": 1
        }}
        type="line"
      />

      {/* Render access leg places then transit stops so that they appear sandwiched between text and lines,
          with transit stops appearing above access leg places. */}
      <Layer
        filter={accessLegFilter}
        id="access-leg-circles"
        paint={{
          "circle-color": ["get", "color"],
          "circle-radius": 8,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 3
        }}
        type="circle"
      />
      <Layer
        filter={stopFilter}
        id="stops-circles"
        paint={{
          "circle-color": "#fff",
          "circle-radius": 7,
          "circle-stroke-width": 3
        }}
        type="circle"
      />

      {/* Render access leg places (lowest priority) then transit stop and route labels, then origin/destination (highest priority)
          so the text appears above all graphics. */}
      <Layer
        filter={accessLegFilter}
        id="access-leg-labels"
        layout={defaultTextLayoutParams}
        paint={defaultTextPaintParams}
        type="symbol"
      />
      <Layer
        filter={stopFilter}
        id="stops-labels"
        layout={defaultTextLayoutParams}
        paint={defaultTextPaintParams}
        type="symbol"
      />
      <Layer
        filter={routeFilter}
        id="routes-labels"
        layout={{
          "symbol-placement": "line",
          "text-field": ["get", "name"],
          "text-keep-upright": true,
          "text-size": 16
        }}
        paint={{
          "text-color": "#eee",
          "text-halo-blur": 15,
          "text-halo-color": ["get", "color"],
          "text-halo-width": 15
        }}
        type="symbol"
      />
      <Layer
        filter={["==", "type", "from"]}
        id="from-label"
        layout={defaultBoldTextLayoutParams}
        paint={defaultTextPaintParams}
        type="symbol"
      />
      <Layer
        filter={["==", "type", "to"]}
        id="to-label"
        layout={defaultBoldTextLayoutParams}
        paint={{
          ...defaultTextPaintParams,
          "text-color": "#910818"
        }}
        type="symbol"
      />
    </Source>
  );
};

export default TransitiveCanvasOverlay;
