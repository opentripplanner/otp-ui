import React, { useEffect, useMemo } from "react";
import polyline from "@mapbox/polyline";
import { Layer, Source, useMap } from "react-map-gl";
import { LngLatBounds } from "maplibre-gl";

type Props = {
  path?: {
    color?: string;
    opacity?: number;
    weight?: number;
  };
  tripData: { geometry: { points: string; length: number } };
  visible?: boolean;
};
const TripViewerOverlay = (props: Props): JSX.Element => {
  const { path, tripData, visible } = props;
  if (!tripData) return null;

  const { geometry } = tripData;

  if (!geometry) return null;

  const pts = polyline
    .decode(geometry.points)
    .map((pt: [number, number]) => pt.reverse());

  const bounds = useMemo(() => {
    return pts.reduce((bnds, coord) => {
      return bnds.extend(coord);
    }, new LngLatBounds(pts[0], pts[0]));
  }, [pts]);

  const { mainMap } = useMap();
  useEffect(() => {
    if (bounds.length === 4 && bounds.every(Number.isFinite)) {
      mainMap?.fitBounds(bounds, {
        duration: 500,
        padding: 200
      });
    }
  }, [mainMap, bounds]);

  if (!visible || !pts) return null;

  const geojson: GeoJSON.Feature = {
    type: "Feature",
    properties: [],
    geometry: { type: "LineString", coordinates: pts }
  };

  return (
    <Source id="route" type="geojson" data={geojson}>
      <Layer
        id="route"
        type="line"
        layout={{ "line-join": "round", "line-cap": "round" }}
        paint={{
          "line-color": path?.color || "#00bfff",
          "line-width": path?.weight || 8,
          "line-opacity": path?.opacity || 0.6
        }}
      />
    </Source>
  );
};

export default TripViewerOverlay;
