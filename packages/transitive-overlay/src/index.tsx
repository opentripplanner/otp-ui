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
        (pattern: TransitivePattern) => {
          const route = transitiveData.routes.find(
            r => r.route_id === pattern.route_id
          );
          // Concatenate geometries (arrays of coordinates) to help maplibre spread out labels (not perfect).
          const concatenatedLines = pattern.stops
            .map(stop => stop.geometry)
            .filter(geometry => !!geometry)
            .reduce((result, geom, index) => {
              const coords = polyline.decode(geom);
              // Remove the first element (except for the first array) because it is a duplicate
              // of the last element of the previous array.
              if (index !== 0) coords.shift();
              return result.concat(coords);
            }, []);
          const routeName =
            route.route_short_name || route.route_long_name || "";
          // HACK: Create an uppercase version of the route name to paint the background, where
          // spaces are replaced with '!' (~same width as space) to create a background with a uniform height.
          // Also, ensure there is a minimum background width (3 characters).
          const routeNameUpper = (routeName.length < 3 ? "000" : routeName)
            .toUpperCase()
            .replace(/\s/g, "!");

          return {
            geometry: polyline.toGeoJSON(polyline.encode(concatenatedLines)),
            properties: {
              color: `#${route.route_color || "000080"}`,
              name: routeName,
              nameUpper: routeNameUpper,
              type: "route"
            },
            type: "Feature"
          };
        }
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

  return (
    <Source data={geojson} id="itinerary" type="geojson">
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
        // Render a solid background of fixed height using the uppercase route name.
        filter={["==", "type", "route"]}
        id="routes-labels-background"
        layout={{
          "symbol-placement": "line-center",
          "text-allow-overlap": true,
          "text-field": ["get", "nameUpper"],
          "text-ignore-placement": true,
          "text-rotation-alignment": "viewport",
          "text-size": 16
        }}
        paint={{
          "text-color": ["get", "color"],
          "text-halo-color": ["get", "color"],
          "text-halo-width": 4 // Max value is 1/4 of text size per maplibre docs.
        }}
        type="symbol"
      />
      <Layer
        // This layer renders transit route names (foreground).
        filter={["==", "type", "route"]}
        id="routes-labels"
        layout={{
          "symbol-placement": "line-center",
          "text-allow-overlap": true,
          "text-field": ["get", "name"],
          "text-ignore-placement": true,
          "text-rotation-alignment": "viewport",
          "text-size": 16
        }}
        paint={{
          "text-color": "#eee"
        }}
        type="symbol"
      />
      <Layer filter={["==", "type", "place"]} id="places" type="circle" />
      <Layer
        filter={["==", "type", "place"]}
        id="places-labels"
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
        type="symbol"
      />
    </Source>
  );
};

export default TransitiveCanvasOverlay;
