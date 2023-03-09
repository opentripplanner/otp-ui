import React, { useEffect, useState } from "react";
import { Map, MapProps } from "react-map-gl";
import maplibregl, { Event } from "maplibre-gl";

import * as Styled from "./styled";
import * as util from "./util";
import MarkerWithPopup from "./MarkerWithPopup";

/**
 * The BaseMap component renders a MapLibre map
 * as well as markers that are declared as child elements of the BaseMap element.
 *
 * As BaseMap wraps a react-map-gl Map component, any control which can be added as a child of a react-map-gl map is supported.
 * See https://visgl.github.io/react-map-gl/docs/api-reference/map to see which react-map-gl
 * children are shipped by default. Others are also supported.
 *
 * Overlays are groups of similar MapLibre markers, e.g. vehicle location
 * markers, bus stop markers, etc.
 *
 * Overlays are automatically added to the overlay control displayed by the
 * BaseMap. The user uses that control to turn overlays on or off. Only overlays
 * with an id are added to the control.
 */
type Props = React.ComponentPropsWithoutRef<React.ElementType> & {
  /** A URL, or list of URLs pointing to the vector tile specification which should be used as the main map.  */
  baseLayer?: string | string[];
  /** A list of names to match onto the base layers. Used only if there are multiple entries defined for `BaseLayer` */
  baseLayerNames?: string[];
  /** A [lat, lon] position to center the map at. */
  center?: [number, number];
  /** A unique identifier for the map (useful when using MapProvider) */
  id?: string;
  /** An object of props which should be passed down to MapLibre */
  mapLibreProps?: MapProps;
  /** The maximum zoom level the map should allow */
  maxZoom?: number;
  /** A callback method which is fired when the map is clicked with the left mouse button/tapped */
  onClick?: (evt: Event) => void;
  /** A callback method which is fired when the map is clicked with the right mouse button/long tapped */
  // Unknown is used here because of a maplibre/mapbox issue with the true type, MapLayerMouseEvent
  onContextMenu?: (e: unknown) => void;
  /** A callback method which is fired when the map zoom or map bounds change */
  onViewportChanged?: (e: State) => void;
  /** An initial zoom value for the map */
  zoom?: number;
};
type State = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const BaseMap = ({
  // These tiles are free to use, but not in production
  baseLayer = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  baseLayerNames,
  center,
  children,
  id,
  mapLibreProps,
  maxZoom,
  onClick,
  onContextMenu,
  onViewportChanged,
  style,
  zoom: initZoom = 12
}: Props): JSX.Element => {
  const [viewState, setViewState] = React.useState<State>({
    latitude: center?.[0],
    longitude: center?.[1],
    zoom: initZoom
  });

  // On mobile hover is unavailable, so we use this variable to use a two tap process
  // to simulate a hover
  const [fakeMobileHover, setFakeHover] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);

  useEffect(() => {
    if (typeof onViewportChanged === "function") {
      onViewportChanged(viewState);
    }
  }, [viewState]);

  useEffect(() => {
    if (center?.[0] === null || center?.[1] === null) return;

    setViewState({
      ...viewState,
      latitude: center?.[0],
      longitude: center?.[1]
    });
  }, [center]);

  const toggleableLayers = Array.isArray(children)
    ? children
        .flat(10)
        .filter(
          child =>
            child?.props?.id !== undefined &&
            // Some sources will not have layers as children, and should be ignored
            // from the list.
            child?.props?.alwaysShow !== true
        )
        .map(child => {
          const { id: layerId, name, visible } = child.props;
          return { id: layerId, name, visible };
        })
    : [];

  const [hiddenLayers, setHiddenLayers] = useState(
    toggleableLayers.filter(layer => !layer?.visible).map(layer => layer.id)
  );
  const [activeBaseLayer, setActiveBaseLayer] = useState(
    typeof baseLayer === "object" ? baseLayer?.[0] : baseLayer
  );

  return (
    <Map
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...mapLibreProps}
      id={id}
      latitude={viewState.latitude}
      longitude={viewState.longitude}
      mapLib={maplibregl}
      mapStyle={activeBaseLayer}
      maxZoom={maxZoom}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMove={evt => {
        setViewState(evt.viewState);
        clearTimeout(longPressTimer);
      }}
      onTouchStart={e => {
        setFakeHover(false);
        setLongPressTimer(setTimeout(() => onContextMenu(e), 600));
      }}
      onTouchCancel={() => {
        clearTimeout(longPressTimer);
      }}
      onTouchEnd={() => {
        clearTimeout(longPressTimer);
      }}
      style={style}
      zoom={viewState.zoom}
    >
      {(toggleableLayers.length > 0 ||
        (!!baseLayer &&
          typeof baseLayer === "object" &&
          baseLayer.length > 1)) && (
        <Styled.LayerSelector
          className="filter-group"
          id="filter-group"
          onBlur={() => setFakeHover(false)}
          onFocus={() => setFakeHover(true)}
          onTouchEnd={() => setFakeHover(true)}
        >
          <ul
            className={`layers-list ${fakeMobileHover && "fake-mobile-hover"}`}
          >
            {!!baseLayer &&
              typeof baseLayer === "object" &&
              baseLayer.map((layer: string, index: number) => {
                return (
                  <li key={index}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label>
                      <input
                        checked={activeBaseLayer === layer}
                        id={layer}
                        name="base-layer"
                        onChange={() => setActiveBaseLayer(layer)}
                        type="radio"
                      />
                      {baseLayerNames?.[index] || layer}
                    </label>
                  </li>
                );
              })}

            {toggleableLayers.map((layer: LayerProps, index: number) => {
              return (
                <li key={index}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label>
                    <input
                      checked={!hiddenLayers.includes(layer.id)}
                      id={layer.id}
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
                    />
                    {layer.name || layer.id}
                  </label>
                </li>
              );
            })}
          </ul>
        </Styled.LayerSelector>
      )}
      {Array.isArray(children)
        ? children
            .flat(10)
            .filter(child => !hiddenLayers.includes(child?.props?.id))
        : children}
    </Map>
  );
};

export default BaseMap;

type LayerProps = React.ComponentPropsWithoutRef<React.ElementType> & {
  id: string;
  name?: string;
  visible?: boolean;
};
const LayerWrapper = (props: LayerProps): JSX.Element => {
  const { children, visible } = props;
  return <>{visible && children}</>;
};

export const Popup = Styled.Popup;

export { LayerWrapper, MarkerWithPopup, Styled, util };
