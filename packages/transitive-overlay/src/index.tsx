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
      ...transitiveData?.stops.flatMap((stop: TransitiveStop) => {
        return {
          type: "Feature",
          properties: { name: stop.stop_name, type: "stop" },
          geometry: {
            type: "Point",
            coordinates: [stop.stop_lon, stop.stop_lat]
          }
        };
      }),
      ...(transitiveData?.places || []).flatMap((place: TransitivePlace) => {
        return {
          type: "Feature",
          properties: { name: place.place_name, type: place.type || "place" },
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
              geometries: segment.streetEdges.map(
                edge => transitiveData.streetEdges[edge]
              )
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
                  type: "route",
                  name: route.route_short_name || route.route_long_name || ""
                },
                geometry: polyline.toGeoJSON(geometry)
              };
            })
      )
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

  // Text/symbol layers placed first will be rendered last.
  return (
    <Source data={geojson} id="itinerary" type="geojson">
      <Layer
        filter={["==", "type", "from-to"]}
        id="from-to-labels"
        layout={{
          "symbol-placement": "point",
          "text-allow-overlap": false,
          "text-field": ["get", "name"],
          "text-padding": 5,
          "text-radial-offset": 0.5,
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
        }}
        paint={{
          "text-halo-blur": 1,
          "text-halo-color": "#ffffff",
          "text-halo-width": 2
        }}
        type="symbol"
      />
      <Layer
        filter={["==", "type", "street-edge"]}
        id="street-edges"
        layout={{
          "line-cap": "butt"
        }}
        paint={{
          // TODO: get from transitive properties
          "line-color": ["get", "color"],
          // TODO: get from transitive properties
          "line-dasharray": [2, 1],
          // TODO: get from transitive properties
          "line-width": 4,
          "line-opacity": 0.9
        }}
        type="line"
      />
      <Layer
        filter={["==", "type", "route"]}
        id="routes"
        layout={{
          "line-join": "round",
          "line-cap": "round"
        }}
        paint={{
          "line-color": ["get", "color"],
          "line-width": 8,
          "line-opacity": 1
        }}
        type="line"
      />
      <Layer
        filter={["==", "type", "route"]}
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
        filter={["==", "type", "stop"]}
        id="stops-circles"
        paint={{
          "circle-color": "#fff",
          "circle-radius": 5,
          "circle-stroke-width": 2
        }}
        type="circle"
      />
      <Layer
        filter={["==", "type", "stop"]}
        id="stops-labels"
        layout={{
          "symbol-placement": "point",
          "text-allow-overlap": false,
          "text-field": ["get", "name"],
          "text-padding": 5,
          "text-radial-offset": 0.5,
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
        }}
        paint={{
          "text-halo-blur": 1,
          "text-halo-color": "#ffffff",
          "text-halo-width": 2
        }}
        type="symbol"
      />
      <Layer filter={["==", "type", "place"]} id="places" type="circle" />
      <Layer
        filter={["==", "type", "place"]}
        id="places-labels"
        layout={{
          "symbol-placement": "point",
          "text-allow-overlap": false,
          "text-field": ["get", "name"],
          "text-padding": 5,
          "text-radial-offset": 0.5,
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
        }}
        paint={{
          "text-halo-blur": 1,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5
        }}
        type="symbol"
      />
    </Source>
  );
};

export default TransitiveCanvasOverlay;
