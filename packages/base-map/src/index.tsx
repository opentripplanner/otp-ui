import React, { useEffect } from "react";

import Map from "react-map-gl";
import maplibregl, { Event } from "maplibre-gl";

import * as Styled from "./styled";
/**
 * The BaseMap component renders a Leaflet map with overlays and other ad-hoc
 * markers that are declared as child elements of the BaseMap element.
 *
 * Overlays are groups of similar React-Leaflet markers, e.g. vehicle location
 * markers, bus stop markers, etc.
 * Overlays are automatically added to the overlay control displayed by the
 * BaseMap. The user uses that control to turn overlays on or off.
 * See the
 * [Two Overlays From TriMet Transit Components](./?path=/story/basemap--with-two-overlays-from-trimet-transit-components)
 * example for more information on overlays.
 */
type Props = {
  maxZoom?: number;
  baseLayer?: string;
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
  center?: [number, number];
  children?: JSX.Element | JSX.Element[];
};
const BaseMap = ({
  maxZoom,
  children,
  baseLayer = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center,
  onContextMenu,
  onViewportChanged,
  onClick,
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
      mapLib={maplibregl}
      longitude={viewState.longitude}
      onContextMenu={onContextMenu}
      onClick={onClick}
      latitude={viewState.latitude}
      zoom={viewState.zoom}
      // TODO: better way to set height and width?
      style={{ display: "block", width: "100%", height: "90vh" }}
      onMove={evt => setViewState(evt.viewState)}
      // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      mapStyle={baseLayer}
      maxZoom={maxZoom}
    >
      {children}
    </Map>
  );
};

export default BaseMap;

export { Styled };
