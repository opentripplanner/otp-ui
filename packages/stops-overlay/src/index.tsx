import { Popup } from "@opentripplanner/base-map";
import { MapLocationActionArg, Stop } from "@opentripplanner/types";
import { EventData } from "mapbox-gl";
import { Layer, Source, useMap } from "react-map-gl";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import StopPopup from "./default-stop-popup";
import * as Styled from "./styled";

type Props = {
  /**
   * An optional id to override the active stop with
   */
  activeStop?: string;
  /**
   * The list of stops to create stop markers for.
   */
  stops?: Stop[];

  /**
   * Whether or not to display the overlay
   */
  visible?: boolean;
  /**
   * The lowest zoom level the stop markers should be visible at
   */
  minZoom?: number;
  /**
   * A method to be fired when the map is moved
   */
  refreshStops?: () => void;
  /**
   * A method fired when a stop is selected as from or to in the popup
   */
  setLocation?: (location: MapLocationActionArg) => void;
  /**
   * A method fired when the stop viewer is opened in the popup
   */
  setViewedStop?: ({ stopId: string }) => void;
};

/**
 * An overlay to view a collection of stops.
 */
const StopsOverlay = (props: Props): JSX.Element => {
  const { current: map } = useMap();
  const {
    activeStop,
    minZoom,
    refreshStops,
    setLocation,
    setViewedStop,
    stops,
    visible
  } = props;
  const [clickedStop, setClickedStop] = useState(null);

  const onLayerEnter = useCallback(() => {
    map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const onLayerLeave = useCallback(() => {
    map.getCanvas().style.cursor = "";
  }, [map]);

  const onLayerClick = useCallback(
    (event: EventData) => {
      setClickedStop(event.features?.[0].properties);
    },
    [setClickedStop]
  );

  const onZoomEnd = useCallback(
    (event: EventData) => {
      if (event.viewState.zoom < minZoom) setClickedStop(null);
    },
    [setClickedStop, minZoom]
  );

  useEffect(() => {
    setClickedStop(activeStop);
  }, [activeStop]);

  useEffect(() => {
    const STOP_LAYERS = ["stops", "flex-stops"];

    STOP_LAYERS.forEach(stopLayer => {
      map?.on("mouseenter", stopLayer, onLayerEnter);
      map?.on("mouseleave", stopLayer, onLayerLeave);
      map?.on("click", stopLayer, onLayerClick);
    });

    if (visible && refreshStops) refreshStops();

    map?.on("zoomend", onZoomEnd);

    // Remove event handlers when component unmounts
    // (prevents error messages about performing state updates on unmounted component).
    return () => {
      STOP_LAYERS.forEach(stopLayer => {
        map?.off("mouseenter", stopLayer, onLayerEnter);
        map?.off("mouseleave", stopLayer, onLayerLeave);
        map?.off("click", stopLayer, onLayerClick);
      });
      map?.off("zoomend", onZoomEnd);
    };
  }, [map, visible]);

  const setNullStop = useCallback(() => {
    setClickedStop(null);
  }, [clickedStop]);

  const flexStops = useMemo(
    () => stops.filter(stop => stop?.geometries?.geoJson?.type === "Polygon"),
    [stops]
  );

  const stopsGeoJSON: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: stops.map(stop => ({
        type: "Feature",
        properties: {
          ...stop,
          flex: stop?.geometries?.geoJson?.type === "Polygon"
        },
        geometry: { type: "Point", coordinates: [stop.lon, stop.lat] }
      }))
    }),
    [stops]
  );

  // Don't render if no map or no stops are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (visible === false || !stops || stops.length === 0) {
    // Null can't be returned here -- react-map-gl dislikes null values as children
    return <></>;
  }

  return (
    <>
      <Source type="geojson" data={stopsGeoJSON}>
        <Layer
          id="stops"
          minzoom={minZoom || 10}
          paint={{
            "circle-color": "#fff",
            "circle-opacity": 0.9,
            "circle-stroke-color": "#333",
            "circle-stroke-width": 2
          }}
          type="circle"
        />
        <Layer
          filter={["==", "flex", true]}
          id="flex-stops"
          paint={{
            "circle-color": ["get", "color"],
            "circle-opacity": 0.9,
            "circle-stroke-color": "#333",
            "circle-stroke-width": 2
          }}
          type="circle"
        />
      </Source>
      {clickedStop && (
        <Popup
          latitude={clickedStop.lat}
          longitude={clickedStop.lon}
          maxWidth="100%"
          onClose={setNullStop}
        >
          <StopPopup
            setLocation={location => {
              setNullStop();
              setLocation(location);
            }}
            setViewedStop={stop => {
              setNullStop();
              setViewedStop(stop);
            }}
            stop={clickedStop}
          />
        </Popup>
      )}
      {flexStops.map(stop => (
        <Source
          data={(stop.geometries.geoJson as unknown) as GeoJSON.Feature}
          id={stop.id}
          key={stop.id}
          type="geojson"
        >
          {/* TODO:  add support for overriding layer styles */}
          <Layer
            id={stop.id}
            paint={{
              "fill-color": stop.color,
              "fill-opacity": 0.5,
              "fill-outline-color": stop.color
            }}
            type="fill"
          />
          <Layer
            id={`${stop.id}-outline`}
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": stop.color,
              "line-opacity": 1,
              "line-width": 4
            }}
            type="line"
          />
        </Source>
      ))}
    </>
  );
};

export default StopsOverlay;

export { Styled, Props as StopProps, StopPopup };
