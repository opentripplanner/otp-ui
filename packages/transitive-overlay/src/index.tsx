import React, { useEffect } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import polyline from "@mapbox/polyline";
import {
  TransitiveData,
  TransitiveJourney,
  TransitivePattern,
  TransitivePlace
} from "@opentripplanner/types";
import bbox from "@turf/bbox";

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
  transitiveData: TransitiveData;
};
const TransitiveCanvasOverlay = (props: Props): JSX.Element => {
  const { transitiveData } = props;
  const { mainMap } = useMap();

  transitiveData?.patterns.flatMap((pattern: TransitivePattern) =>
    pattern.stops
      .map(stop => stop.geometry)
      .filter(geometry => !!geometry)
      .map(geometry => polyline.toGeoJSON(geometry))
  );
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
          properties: { name: place.place_name, type: "place" },
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

  useEffect(() => {
    const b = bbox(geojson);
    const bounds: [number, number, number, number] = [b[0], b[1], b[2], b[3]];

    if (bounds.length === 4 && bounds.every(Number.isFinite)) {
      mainMap?.fitBounds(bounds, {
        duration: 500,
        padding: 200
      });
    }
  }, [transitiveData]);

  return (
    <Source id="itinierary" type="geojson" data={geojson}>
      <Layer
        id="street-edges"
        filter={["==", "type", "street-edge"]}
        type="line"
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
      />
      <Layer
        id="routes"
        filter={["==", "type", "route"]}
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round"
        }}
        paint={{
          "line-color": ["get", "color"],
          "line-width": 8,
          "line-opacity": 1
        }}
      />
      <Layer
        id="routes-labels"
        type="symbol"
        filter={["==", "type", "route"]}
        layout={{
          "symbol-placement": "line",
          "text-field": ["get", "name"],
          "text-size": 16
        }}
        paint={{
          "text-halo-blur": 15,
          "text-halo-color": ["get", "color"],
          "text-halo-width": 15,
          "text-color": "#eee"
        }}
      />
      <Layer id="places" filter={["==", "type", "place"]} type="circle" />
      <Layer
        id="places-labels"
        type="symbol"
        filter={["==", "type", "place"]}
        layout={{
          "symbol-placement": "point",
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-anchor": "top",
          "text-padding": 5,
          "text-optional": true,
          "text-allow-overlap": false
        }}
        paint={{ "text-translate": [0, 5] }}
      />
    </Source>
  );
};

export default TransitiveCanvasOverlay;
