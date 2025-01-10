import { SymbolLayout } from "mapbox-gl";
import { util } from "@opentripplanner/base-map";
import React, { useEffect } from "react";
import { Layer, MapRef, Source, useMap } from "react-map-gl";
import polyline from "@mapbox/polyline";
import {
  Leg,
  TransitiveData,
  TransitiveJourney,
  TransitivePattern,
  TransitivePlace
} from "@opentripplanner/types";
import bbox from "@turf/bbox";

import { getRouteLayerLayout, patternToRouteFeature } from "./route-layers";
import { drawArc, getFromToAnchors, itineraryToTransitive } from "./util";
import routeArrow from "./images/route_arrow.png";

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
 * Common text settings.
 */
const commonTextLayoutParams: SymbolLayout = {
  "symbol-placement": "point",
  "text-allow-overlap": false,
  "text-field": ["get", "name"],
  "text-justify": "auto",
  "text-radial-offset": 1,
  "text-size": 15
};

/**
 * Text size and layout that lets maplibre relocate text space permitting.
 */
const defaultTextLayoutParams: SymbolLayout = {
  ...commonTextLayoutParams,
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
  ...commonTextLayoutParams,
  // FIXME: find a better way to set a bold font
  "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
  "text-overlap": "never"
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
  accessLegColorOverride?: string;
  boundsFitting?: boolean;
  showRouteArrows?: boolean;
  transitiveData?: TransitiveData;
};

type MapImage = {
  id: string;
  url: string;
};

const loadImages = (map: MapRef, images: MapImage[]) => {
  images.forEach(img => {
    map.loadImage(img.url, (error, image) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(`Error loading image ${img.id}:`, error);
        return;
      }
      if (!map.hasImage(img.id)) {
        map.addImage(img.id, image, { sdf: true });
      }
    });
  });
};

const TransitiveCanvasOverlay = ({
  activeLeg,
  accessLegColorOverride,
  boundsFitting = true,
  showRouteArrows,
  transitiveData
}: Props): JSX.Element => {
  const { current: map } = useMap();

  const mapImages: MapImage[] = [];
  // This is used to render arrows along the route
  // Only load if that option is enabled to save the bandwidth
  if (showRouteArrows) {
    mapImages.push({
      id: "arrow-icon",
      url: routeArrow
    });
  }

  useEffect(() => {
    loadImages(map, mapImages);
  }, [map, mapImages]);

  const geojson: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    Record<string, unknown>
  > = {
    type: "FeatureCollection",
    // @ts-expect-error TODO: fix the type above for geojson
    features: transitiveData
      ? [
          ...(transitiveData.places || []).flatMap((place: TransitivePlace) => {
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
          ...(transitiveData.journeys || []).flatMap(
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
                    const straight = polyline.toGeoJSON(
                      geometry.geometry.points
                    );
                    return {
                      type: "Feature",
                      properties: {
                        type: "street-edge",
                        color:
                          accessLegColorOverride ||
                          modeColorMap[segment.type] ||
                          "#008",
                        mode: segment.type
                      },
                      geometry: segment.arc ? drawArc(straight) : straight
                    };
                  });
                })
          ),
          // Extract the first and last stops of each transit segment for display.
          ...(transitiveData.journeys || [])
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
                (_, index, stopsArr) =>
                  index === 0 || index === stopsArr.length - 1
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
            })),
          ...(
            transitiveData.patterns || []
          ).flatMap((pattern: TransitivePattern) =>
            patternToRouteFeature(pattern, transitiveData.routes)
          )
        ]
      : []
  };

  const zoomToGeoJSON = geoJson => {
    if (!boundsFitting) return;
    const b = bbox(geoJson);
    const bounds: [number, number, number, number] = [b[0], b[1], b[2], b[3]];

    if (map && bounds.length === 4 && bounds.every(Number.isFinite)) {
      map.fitBounds(bounds, {
        duration: 500,
        padding: util.getFitBoundsPadding(map, 0.2)
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

  if (!transitiveData) return <></>;

  const { fromAnchor, toAnchor } = getFromToAnchors(transitiveData);

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
      {showRouteArrows && (
        <Layer
          id="route-arrows"
          layout={{
            "symbol-placement": "line",
            "icon-image": "arrow-icon",
            "icon-size": 0.1,
            "symbol-spacing": 10,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-offset": [0, 8000]
          }}
          paint={{
            "icon-color": ["get", "color"],
            "icon-opacity": 0.8
          }}
          type="symbol"
        />
      )}
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
        // Render a solid background of fixed height using the uppercase route name.
        filter={routeFilter}
        id="routes-labels-background"
        layout={getRouteLayerLayout("nameUpper")}
        paint={{
          "text-color": ["get", "color"],
          "text-halo-color": ["get", "color"],
          "text-halo-width": 4 // Max value is 1/4 of text size per maplibre docs.
        }}
        type="symbol"
      />
      <Layer
        // This layer renders transit route names (foreground).
        filter={routeFilter}
        id="routes-labels"
        layout={getRouteLayerLayout("name")}
        paint={{
          "text-color": ["get", "textColor"]
        }}
        type="symbol"
      />
      <Layer
        filter={["==", "type", "from"]}
        id="from-label"
        layout={{
          ...defaultBoldTextLayoutParams,
          "text-anchor": fromAnchor
        }}
        paint={defaultTextPaintParams}
        type="symbol"
      />
      <Layer
        filter={["==", "type", "to"]}
        id="to-label"
        layout={{
          ...defaultBoldTextLayoutParams,
          "text-anchor": toAnchor
        }}
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
