import polyline from "@mapbox/polyline";
import { LngLatBounds } from "maplibre-gl";
import { Layer, Source, useMap } from "react-map-gl";
import React, { useEffect, useMemo } from "react";

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

  const { current: map } = useMap();
  useEffect(() => {
    if (bounds.length === 4 && bounds.every(Number.isFinite)) {
      map?.fitBounds(bounds, {
        duration: 500,
        padding: 200
      });
    }
  }, [map, bounds]);

  if (!visible || !pts) return null;

  const geojson: GeoJSON.Feature = {
    type: "Feature",
    geometry: { type: "LineString", coordinates: pts },
    properties: []
  };

  return (
    <Source id="route" type="geojson" data={geojson}>
      <Layer
        id="route"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": path?.color || "#00bfff",
          "line-opacity": path?.opacity || 0.6,
          "line-width": path?.weight || 8
        }}
        type="line"
      />
    </Source>
  );
};

export default TripViewerOverlay;
