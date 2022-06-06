import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";
import { Stop } from "@opentripplanner/types";
import React from "react";

import { Layer, Source, useMap } from "react-map-gl";
import DefaultStopMarker from "./default-stop-marker";
import * as Styled from "./styled";

const checkIfPositionInViewport = (
  bounds: mapboxgl.LngLatBounds,
  lat: number,
  lng: number
): boolean => {
  const PADDING = 0.002;
  // @ts-expect-error types appear to be wrong? version issue?
  // eslint-disable-next-line no-underscore-dangle
  const [sw, ne] = [bounds._sw, bounds._ne];
  if (!sw || !ne) return false;

  return (
    lat >= sw.lat - PADDING &&
    lat <= ne.lat + PADDING &&
    lng >= sw.lng - PADDING &&
    lng <= ne.lng + PADDING
  );
};

type Props = {
  /**
   * The list of stops to create stop markers for.
   */
  stops: Stop[];
  /**
   * A list of symbol definitions for the stops to be rendered at specific zoom levels.
   */
  symbols: ZoomBasedMarkers[];
  visible?: boolean;
};

/**
 * An overlay to view a collection of stops.
 */
const StopsOverlay = (props: Props): JSX.Element => {
  const { mainMap } = useMap();

  const { stops, symbols, visible } = props;

  // Don't render if no map or no stops are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (visible === false || !stops || stops.length === 0) {
    return <></>;
  }
  const zoom = mainMap?.getZoom();
  const flexStops = stops.filter(
    stop => stop?.geometries?.geoJson?.type === "Polygon"
  );

  const bounds = mainMap?.getBounds();
  if (!bounds) return null;
  const visibleStops = stops.filter(stop =>
    checkIfPositionInViewport(bounds, stop.lat, stop.lon)
  );

  return (
    <>
      <ZoomBasedMarkers entities={visibleStops} symbols={symbols} zoom={zoom} />
      {flexStops.map(stop => (
        <Source
          key={stop.id}
          id={stop.id}
          type="geojson"
          data={(stop.geometries.geoJson as unknown) as GeoJSON.Feature}
        >
          <Layer
            id={stop.id}
            type="fill"
            paint={{
              "fill-color": stop.color,
              "fill-opacity": 0.5,
              "fill-outline-color": stop.color
            }}
          />
          <Layer
            id={`${stop.id}-outline`}
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": stop.color,
              "line-opacity": 1,
              "line-width": 4
            }}
          />
        </Source>
      ))}
    </>
  );
};

export default StopsOverlay;

export { DefaultStopMarker, Styled };
