import React, { useEffect, useState } from "react";

import { MapProvider, Map, MapRef } from "react-map-gl";
import maplibregl, { Event } from "maplibre-gl";

import * as Styled from "./styled";
import MarkerWithPopup from "./MarkerWithPopup";
import callIfValid from "./util";
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
  passedRef?: React.Ref<MapRef>;
  zoom?: number;
};
const BaseMap = ({
  baseLayer = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center,
  children,
  maxZoom,
  onClick,
  onContextMenu,
  passedRef,
  onViewportChanged,
  zoom: initZoom = 12
}: Props): JSX.Element => {
  const [viewState, setViewState] = React.useState<{
    latitude: number;
    longitude: number;
    zoom: number;
    fitBoundsOptions?: Record<string, number | string | boolean>;
  }>({
    fitBoundsOptions: {
      animate: true,
      padding: 10,
      duration: 100,
      maxDuration: 300,
      essential: false
    },
    latitude: center?.[0],
    longitude: center?.[1],
    zoom: initZoom
  });

  useEffect(() => {
    callIfValid(onViewportChanged)(viewState);
  }, [viewState]);

  const toggleableLayers = Array.isArray(children)
    ? children
        .filter(child => !!child.props.id)
        .map(child => {
          const { visible, name, id } = child.props;
          return { visible, name, id };
        })
    : [];

  const [hiddenLayers, setHiddenLayers] = useState(
    toggleableLayers.filter(layer => !layer.visible).map(layer => layer.id)
  );

  return (
    <MapProvider>
      <Map
        ref={passedRef}
        id="mainMap"
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
        {toggleableLayers.length > 0 && (
          <Styled.LayerSelector id="filter-group" className="filter-group">
            <div className="layers-list">
              {toggleableLayers.map((layer: LayerProps, index: number) => {
                return (
                  <label htmlFor={layer.id} key={index}>
                    <input
                      onChange={() => {
                        const updatedLayers = [...hiddenLayers];
                        // Delete the layer id if present, add it otherwise
                        updatedLayers.includes(layer.id)
                          ? updatedLayers.splice(
                              updatedLayers.indexOf(layer.id),
                              1
                            )
                          : updatedLayers.push(layer.id);

                        setHiddenLayers(updatedLayers);
                      }}
                      type="checkbox"
                      id={layer.id}
                      checked={!hiddenLayers.includes(layer.id)}
                    />
                    {layer.name || layer.id}
                  </label>
                );
              })}
            </div>
          </Styled.LayerSelector>
        )}
        {Array.isArray(children)
          ? children.filter(child => !hiddenLayers.includes(child.props.id))
          : children}
      </Map>
    </MapProvider>
  );
};

export default BaseMap;

type LayerProps = {
  visible?: boolean;
  name?: string;
  id: string;
  children?: JSX.Element | JSX.Element[];
};
const LayerWrapper = (props: LayerProps): JSX.Element => {
  const { children, visible } = props;
  return <>{visible && children}</>;
};

export { Styled, MarkerWithPopup, LayerWrapper };
