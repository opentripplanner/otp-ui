/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import capsule1 from "./images/01.png";
import capsule3 from "./images/03.png";
import capsule4 from "./images/04.png";
import capsule5 from "./images/05.png";
import capsule6 from "./images/06.png";
import capsule7 from "./images/07.png";
import capsule8 from "./images/08.png";
import capsule9 from "./images/09.png";
import capsule10 from "./images/10.png";
import capsule11 from "./images/11.png";
import capsule12 from "./images/12.png";
import capsule13 from "./images/13.png";
import capsule14 from "./images/14.png";
import capsule15 from "./images/15.png";
import capsule16 from "./images/16.png";
import capsule17 from "./images/17.png";
import rectangle from "./images/square.png";

const CAPSULES = {
  3: capsule3,
  4: capsule4,
  5: capsule5,
  6: capsule6,
  7: capsule7,
  8: capsule8,
  9: capsule9,
  10: capsule10,
  11: capsule11,
  12: capsule12,
  13: capsule13,
  14: capsule14,
  15: capsule15,
  16: capsule16,
  17: capsule17
};

// These are based on the sprites in the image folder
const WIDTH_IMAGE_SIZES = {
  6: 1283,
  7: 1450,
  8: 1617,
  9: 1783,
  10: 1950,
  11: 2117,
  12: 2283,
  13: 2450,
  14: 2617,
  15: 2783,
  16: 2950,
  17: 3117
};
const HEIGHT_IMAGE_SIZE = 533;

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
  options: { sdf?: boolean; content?: [number, number, number, number] };
};

const loadImages = async (map: MapRef, images: MapImage[]) => {
  for (const img of images) {
    // Only load if the image hasn't already been added
    // @ts-ignore (TS may not know hasImage exists depending on the type you use)
    if (!map.hasImage(img.id)) {
      let loadedImage;
      try {
        // @ts-ignore (TS will complain that loadImage expects a callback; this is fine)
        const result = (map.loadImage as any)(img.url);

        if (result && typeof result.then === "function") {
          // MapLibre v3+/Mapbox GL v3+ (Promise API)
          loadedImage = (await result).data;
        } else {
          // MapLibre v1/v2 or Mapbox GL v1/v2 (Callback API)
          loadedImage = await new Promise((resolve, reject) => {
            // @ts-ignore (TS expects only the callback style)
            map.loadImage(img.url, (error, data) => {
              if (error) reject(error);
              else resolve(data);
            });
          });
        }
        // @ts-ignore (TS may not know about addImage's third arg)
        map.addImage(img.id, loadedImage, img.options);
      } catch (err) {
        console.error(`Failed to load image: ${img.url}`, err);
      }
    }
  }
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
      url: routeArrow,
      options: { sdf: true }
    });
  }

  function generateCapsulePadding(
    width: number
  ): [number, number, number, number] {
    // Low widths have no padding
    if (!WIDTH_IMAGE_SIZES[width]) {
      return undefined;
    }

    // This could be more efficient, but this makes it very clear what is happening.
    // Higher widths require more padding
    let topPad = 0;
    if (width === 6) {
      topPad = 100;
    }

    if (width > 6) {
      topPad = 150;
    }

    if (width > 12) {
      topPad = 175;
    }

    // Each image has same height
    return [topPad, 0, WIDTH_IMAGE_SIZES[width] - topPad, HEIGHT_IMAGE_SIZE];
  }

  mapImages.push({
    id: "1",
    url: capsule1,
    options: {
      // These paddings are specifically set so that the circle appears circular
      // despite non-circular padding
      content: [0, 15, 500, 485],
      sdf: true
    }
  });
  mapImages.push({
    id: "2",
    url: capsule1,
    options: {
      // These paddings are specifically set so that the circle appears circular
      // despite non-circular padding
      content: [0, 40, 500, 460],
      sdf: true
    }
  });

  // Generate each capsule image from 3 - 17
  for (let i = 3; i < 18; i++) {
    mapImages.push({
      id: `${i}`,
      url: CAPSULES[i],
      options: {
        content: generateCapsulePadding(i),
        sdf: true
      }
    });
  }

  mapImages.push({
    id: "rect",
    url: rectangle,
    options: {
      sdf: true
    }
  });

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
        // This layer renders transit route names (foreground).
        filter={routeFilter}
        id="routes-labels"
        layout={getRouteLayerLayout("name")}
        paint={{
          "icon-color": ["get", "color"],
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
