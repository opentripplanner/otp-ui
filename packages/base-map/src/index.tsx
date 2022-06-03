import React, { useEffect } from "react";

import Map from "react-map-gl";
import maplibregl, { Event } from "maplibre-gl";

import * as Styled from "./styled";
/**
 * The BaseMap component renders a MapLibre map
 * markers that are declared as child elements of the BaseMap element.
 *
 * Overlays are groups of similar MapLibre markers, e.g. vehicle location
 * markers, bus stop markers, etc.
 *
 * TODO:
 * Overlays are automatically added to the overlay control displayed by the
 * BaseMap. The user uses that control to turn overlays on or off.
 */
type Props = {
  baseLayer?: string;
  center?: [number, number];
  children?: JSX.Element | JSX.Element[];
  maxZoom?: number;
  onClick?: (evt: Event) => void;
  // Unknown is used here becuase of a maplibre/mapbox issue with the true type, MapLayerMouseEvent
  onContextMenu?: (e: unknown) => void;
  onViewportChanged?: ({
    latitude,
    longitude,
    zoom
  }: {
    latitude: number;
    longitude: number;
    zoom: number;
  }) => void;
  zoom?: number;
};
const BaseMap = ({
  baseLayer = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center,
  children,
  maxZoom,
  onClick,
  onContextMenu,
  onViewportChanged,
  zoom: initZoom = 12
}: Props): JSX.Element => {
  const [viewState, setViewState] = React.useState({
    latitude: center?.[0],
    longitude: center?.[1],
    zoom: initZoom
  });

  useEffect(() => {
    if (typeof onViewportChanged === "function") {
      onViewportChanged(viewState);
    }
  }, [viewState]);

  return (
    <Map
      latitude={viewState.latitude}
      longitude={viewState.longitude}
      mapLib={maplibregl}
      mapStyle={baseLayer}
      maxZoom={maxZoom}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMove={evt => setViewState(evt.viewState)}
      // TODO: better way to set height and width?
      style={{ display: "block", width: "100%", height: "90vh" }}
      zoom={viewState.zoom}
    >
      {children}
    </Map>
  );
};

export default BaseMap;

export { Styled };
