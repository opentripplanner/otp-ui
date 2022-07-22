import { MapLocationActionArg, Stop } from "@opentripplanner/types";
import { EventData } from "mapbox-gl";
import { Layer, Popup, Source, useMap } from "react-map-gl";
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

  useEffect(() => {
    setClickedStop(activeStop);
  }, [activeStop]);

  useEffect(() => {
    const STOP_LAYERS = ["stops", "flex-stops"];
    STOP_LAYERS.forEach(stopLayer => {
      map?.on("mouseenter", stopLayer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map?.on("mouseleave", stopLayer, () => {
        map.getCanvas().style.cursor = "";
      });
      map?.on("click", stopLayer, (event: EventData) => {
        setClickedStop(event.features?.[0].properties);
      });
    });

    if (refreshStops) refreshStops();

    map?.on("zoomend", event => {
      if (event.viewState.zoom < minZoom) setClickedStop(null);
    });
  }, [map]);

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

  const setNullStop = useCallback(() => {
    setClickedStop(null);
  }, [clickedStop]);

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

export { Styled, Props as StopProps };
