import { Stop } from "@opentripplanner/types";
import React, { useState } from "react";

import { Layer, Popup, Source, useMap } from "react-map-gl";
import { EventData } from "mapbox-gl";
import * as Styled from "./styled";
import StopPopup from "./default-stop-popup";

const checkIfPositionInViewport = (
  bounds: mapboxgl.LngLatBounds,
  lat: number,
  lng: number
): boolean => {
  const PADDING = 0.004;
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
  stops?: Stop[];

  /**
   * Whether or not to dispaly the overlay
   */
  visible?: boolean;
  /**
   * The lowest zoom level the stop markers should be visible at
   */
  minZoom?: number;
  /**
   * A method fired when a stop is selected as from or to in the popup
   */
  setLocation?: ({ location: Location, locationType: string }) => void;
  /**
   * A method fired when the stop viewer is opened in the popup
   */
  setViewedStop?: ({ stopId: string }) => void;
};

/**
 * An overlay to view a collection of stops.
 */
const StopsOverlay = (props: Props): JSX.Element => {
  const { mainMap } = useMap();
  const { stops, minZoom, visible, setLocation, setViewedStop } = props;
  const [clickedStop, setClickedStop] = useState(null);

  // Don't render if no map or no stops are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (visible === false || !stops || stops.length === 0) {
    return <></>;
  }
  const flexStops = stops.filter(
    stop => stop?.geometries?.geoJson?.type === "Polygon"
  );

  const bounds = mainMap?.getBounds();
  if (!bounds) return null;
  const visibleStops = stops.filter(stop =>
    checkIfPositionInViewport(bounds, stop.lat, stop.lon)
  );
  const visibleStopsGeojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: visibleStops.map(stop => ({
      type: "Feature",
      properties: {
        ...stop,
        flex: stop?.geometries?.geoJson?.type === "Polygon"
      },
      geometry: { type: "Point", coordinates: [stop.lon, stop.lat] }
    }))
  };

  const STOP_LAYERS = ["stops", "flex-stops"];
  STOP_LAYERS.forEach(stopLayer => {
    mainMap?.on("mouseenter", stopLayer, () => {
      mainMap.getCanvas().style.cursor = "pointer";
    });
    mainMap?.on("mouseleave", stopLayer, () => {
      mainMap.getCanvas().style.cursor = "";
    });
    mainMap?.on("click", stopLayer, (event: EventData) => {
      setClickedStop(event.features?.[0].properties);
    });
  });

  return (
    <>
      <Source type="geojson" data={visibleStopsGeojson}>
        <Layer
          id="stops"
          type="circle"
          minzoom={minZoom || 10}
          paint={{
            "circle-color": "#fff",
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#333"
          }}
        />
        <Layer
          id="flex-stops"
          type="circle"
          filter={["==", "flex", true]}
          paint={{
            "circle-color": ["get", "color"],
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#333"
          }}
        />
      </Source>
      {clickedStop && (
        <Popup
          closeOnClick={false}
          longitude={clickedStop.lon}
          latitude={clickedStop.lat}
        >
          <StopPopup
            setLocation={setLocation}
            setViewedStop={setViewedStop}
            stop={clickedStop}
          />
        </Popup>
      )}
      {flexStops.map(stop => (
        <Source
          key={stop.id}
          id={stop.id}
          type="geojson"
          data={(stop.geometries.geoJson as unknown) as GeoJSON.Feature}
        >
          {/* TODO:  add support for overriding layer styles */}
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

export { Styled, Props as StopProps };
