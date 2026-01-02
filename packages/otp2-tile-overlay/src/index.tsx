import EntityPopup, { Feed } from "@opentripplanner/map-popup";
import {
  ConfiguredCompany,
  MapLocationActionArg,
  Stop,
  StopEventHandler
} from "@opentripplanner/types";
import {
  RentalVehicle,
  VehicleRentalStation
} from "@opentripplanner/types/otp2";
import React, { useCallback, useEffect, useState } from "react";
import { FilterSpecification, MapLayerMouseEvent } from "maplibre-gl";
import { Layer, Popup, Source, useMap } from "react-map-gl/maplibre";

import { generateLayerPaint, ROUTE_COLOR_EXPRESSION } from "./util";

const SOURCE_ID = "otp2-tiles";
const AREA_TYPES = ["areaStops"];
const STOPS_AND_STATIONS_TYPE = "OTP-UI-stopsAndStations";

const OTP2TileLayerWithPopup = ({
  color,
  configCompanies,
  feeds,
  getEntityPrefix,
  id,
  network,
  minZoom = 14,
  onMapClick,
  setLocation,
  setViewedStop,
  stopsWhitelist,
  type
}: {
  color?: string;
  /**
   * Optional configuration item which allows for customizing properties of scooter and
   * bikeshare companies. If this is provided, scooter/bikeshare company names can be rendered in the
   * default scooter/bike popup
   */
  configCompanies?: ConfiguredCompany[];
  /**
   * A list of feeds from the GraphQL query. If specified, the feed publisher name will be used to
   * display the name of the stop in the popup.
   */
  feeds?: Feed[];
  getEntityPrefix?: (
    entity: Stop | VehicleRentalStation | RentalVehicle
  ) => JSX.Element;
  id: string;
  name?: string;
  /**
   * If `network` is specified, the layer will be filtered to only show vehicles from
   * that network
   */
  network?: string;
  /**
   * The minimum zoom to show the layer at. Defaults to 14
   */
  minZoom?: number;
  /**
   * An optional method to override the map click handler. If a method is passed, NO POPUPS
   * WILL APPEAR ON CLICK. The implementer will be responsible for handling all click events
   * in accordance with the MapLibreGL api.
   */
  onMapClick?: (event: MapLayerMouseEvent) => void;
  /**
   * A method fired when a stop is selected as from or to in the default popup. If this method
   * is not passed, the from/to buttons will not be shown.
   */
  setLocation?: (location: MapLocationActionArg) => void;
  /**
   * A method fired when the stop viewer is opened in the default popup. If this method is
   * not passed, the stop viewer link will not be shown.
   */
  setViewedStop?: StopEventHandler;
  /**
   * A list of GTFS stop ids (with agency prepended). If specified, all stops that
   * are NOT in this list will be HIDDEN.
   */
  stopsWhitelist?: string[];
  /**
   * Determines which layer of the OTP2 tile data to display. Also determines icon color.
   */
  type: string;
  visible?: boolean;
}): JSX.Element => {
  const { current: map } = useMap();

  // TODO: handle this complex type: it can be a stop, a station, and some extra fields too
  const [clickedEntity, setClickedEntity] = useState<any>(null);

  const defaultClickHandler = (event: MapLayerMouseEvent) => {
    const { sourceLayer } = event.features?.[0];
    const synthesizedEntity: Record<string, any> = {
      ...event.features?.[0].properties,
      lat: event.lngLat.lat,
      lon: event.lngLat.lng,
      sourceLayer
    };

    // TODO: once the popup converges into a single one that can handle
    // stops, stations, and vehicles, this re-writing will not be needed
    // See: https://github.com/opentripplanner/otp-ui/pull/472#discussion_r1023124055
    if (sourceLayer === "stops" || sourceLayer === "stations") {
      setClickedEntity(synthesizedEntity);
    }

    // For rental vehicles and rental stations, additional fields must be added in order to
    // be compatible with the RentalVehicle and VehicleRentalStation types from OTP2
    synthesizedEntity.name = synthesizedEntity.name ?? "";
    synthesizedEntity.vehicleType =
      sourceLayer === "rentalVehicles" && "formFactor" in synthesizedEntity
        ? { formFactor: synthesizedEntity.formFactor }
        : sourceLayer === "rentalStations" && "formFactors" in synthesizedEntity
        ? { formFactor: synthesizedEntity.formFactors }
        : undefined;
    synthesizedEntity.rentalNetwork =
      "network" in synthesizedEntity
        ? { networkId: synthesizedEntity.network }
        : undefined;
    if (sourceLayer === "rentalStations") {
      synthesizedEntity.availableVehicles = undefined;
      synthesizedEntity.availableSpaces = undefined;
    }

    setClickedEntity(synthesizedEntity);
  };

  const onLayerEnter = useCallback(() => {
    map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const onLayerLeave = useCallback(() => {
    map.getCanvas().style.cursor = "";
  }, [map]);

  useEffect(() => {
    map?.on("mouseenter", id, onLayerEnter);
    map?.on("mouseleave", id, onLayerLeave);
    map?.on("click", id, onMapClick || defaultClickHandler);

    map?.on("mouseenter", `${id}-secondary`, onLayerEnter);
    map?.on("mouseleave", `${id}-secondary`, onLayerLeave);
    map?.on("click", `${id}-secondary`, onMapClick || defaultClickHandler);

    return () => {
      map?.off("mouseenter", id, onLayerEnter);
      map?.off("mouseleave", id, onLayerLeave);
      map?.off("click", id, onMapClick || defaultClickHandler);

      map?.off("mouseenter", `${id}-secondary`, onLayerEnter);
      map?.off("mouseleave", `${id}-secondary`, onLayerLeave);
      map?.off("click", `${id}-secondary`, onMapClick || defaultClickHandler);
    };
  }, [id, map]);

  let filter: FilterSpecification = ["all"];
  if (network) {
    filter = ["all", ["==", "network", network]];
  }
  if (
    type === "stops" ||
    type === "areaStops" ||
    type === STOPS_AND_STATIONS_TYPE
  ) {
    filter = [
      "all",
      ["!", ["has", "parentStation"]],
      ["!=", ["get", "routes"], ["literal", "[]"]]
    ];
  }
  if (stopsWhitelist) {
    filter = ["in", ["get", "gtfsId"], ["literal", stopsWhitelist]];
  }

  const isArea = AREA_TYPES.includes(type);
  const isStopsAndStations = type === STOPS_AND_STATIONS_TYPE;
  return (
    <>
      {isArea && (
        <Layer
          filter={filter}
          id={`${id}-fill`}
          minzoom={stopsWhitelist ? 2 : minZoom}
          paint={{
            "fill-color": ROUTE_COLOR_EXPRESSION,
            "fill-opacity": 0.2
          }}
          source-layer={type}
          source={SOURCE_ID}
          type="fill"
        />
      )}
      {isArea && (
        <Layer
          filter={filter}
          id={`${id}-outline`}
          layout={{ "line-join": "round", "line-cap": "round" }}
          minzoom={stopsWhitelist ? 2 : minZoom}
          paint={{
            "line-color": ROUTE_COLOR_EXPRESSION,
            "line-opacity": 0.8,
            "line-width": 3
          }}
          source-layer={type}
          source={SOURCE_ID}
          type="line"
        />
      )}
      {isStopsAndStations && (
        <Layer
          filter={filter}
          id={id}
          key={`${id}-stops`}
          minzoom={stopsWhitelist ? 2 : minZoom}
          paint={generateLayerPaint(color).stops}
          source={SOURCE_ID}
          source-layer="stops"
          type="circle"
        />
      )}
      {isStopsAndStations && (
        <Layer
          filter={filter}
          id={`${id}-secondary`}
          key={`${id}-stations`}
          minzoom={stopsWhitelist ? 2 : minZoom}
          paint={generateLayerPaint(color).stops}
          source={SOURCE_ID}
          source-layer="stations"
          type="circle"
        />
      )}
      {!isArea && !isStopsAndStations && (
        <Layer
          filter={filter}
          id={id}
          key={id}
          minzoom={stopsWhitelist ? 2 : minZoom}
          paint={generateLayerPaint(color)[type]}
          source={SOURCE_ID}
          source-layer={type}
          type="circle"
        />
      )}
      {clickedEntity && (
        <Popup
          latitude={clickedEntity.lat}
          longitude={clickedEntity.lon}
          maxWidth="100%"
          // TODO: only set null if the x is clicked, not a new stop
          onClose={() => setClickedEntity(null)}
        >
          <EntityPopup
            closePopup={() => setClickedEntity(null)}
            configCompanies={configCompanies}
            entity={{
              ...clickedEntity,
              id: clickedEntity?.id || clickedEntity?.gtfsId
            }}
            feeds={feeds}
            getEntityPrefix={getEntityPrefix}
            setLocation={
              setLocation
                ? location => {
                    setClickedEntity(null);
                    setLocation(location);
                  }
                : null
            }
            setViewedStop={
              setViewedStop
                ? stop => {
                    setClickedEntity(null);
                    setViewedStop(stop);
                  }
                : null
            }
          />
        </Popup>
      )}
    </>
  );
};

/**
 * Generates an array of MapLibreGL Source and Layer components with included popups for
 * rendering OTP2 tile data.
 *
 * @param layers          A list of layers, with some minimal config, matching what is configured on the server.
 *                        This list will be used to craft the tilejson request to OTP.
 * @param endpoint        The OTP endpoint to make the requests to
 * @param setLocation     An optional method to make from/to buttons functional. See component for more detail.
 * @param setViewedStop   An optional method to make stop viewer button functional. See component for more detail.
 * @param stopsWhitelist  An optional list of stops to display singularly. See component for more detail.
 * @param configCompanies An optional list of companies used to prettify network information.
 * @returns               Array of <Source> and <OTP2TileLayerWithPopup> components
 */
const generateOTP2TileLayers = (
  layers: {
    color?: string;
    initiallyVisible?: boolean;
    minZoom?: number;
    name?: string;
    network?: string;
    overrideType?: string;
    type: string;
  }[],
  endpoint: string,
  setLocation?: (location: MapLocationActionArg) => void,
  setViewedStop?: (stop: Stop) => void,
  stopsWhitelist?: string[],
  configCompanies?: ConfiguredCompany[],
  getEntityPrefix?: (entity: Stop | VehicleRentalStation) => JSX.Element,
  feeds?: Feed[]
): JSX.Element[] => {
  const fakeOtpUiLayerIndex = layers.findIndex(
    l => l.type === STOPS_AND_STATIONS_TYPE
  );
  if (fakeOtpUiLayerIndex > -1) {
    layers[fakeOtpUiLayerIndex].overrideType = "stops,stations";
  }

  return [
    <Source
      // @ts-expect-error we use a nonstandard prop
      alwaysShow
      id={SOURCE_ID}
      key={SOURCE_ID}
      type="vector"
      // Only grab the data we need based on layers defined
      url={`${endpoint}/${layers
        .map(l => l.overrideType || l.type)
        .join(",")}/tilejson.json`}
    />,
    ...layers.map(layer => {
      const { color, initiallyVisible, minZoom, name, network, type } = layer;
      const id = `${type}${network ? `-${network}` : ""}`;
      return (
        <OTP2TileLayerWithPopup
          color={color}
          configCompanies={configCompanies}
          feeds={feeds}
          getEntityPrefix={getEntityPrefix}
          id={id}
          key={id}
          name={name || id}
          network={network}
          minZoom={minZoom}
          setLocation={setLocation}
          setViewedStop={setViewedStop}
          stopsWhitelist={stopsWhitelist}
          type={type}
          visible={initiallyVisible}
        />
      );
    })
  ];
};

export default generateOTP2TileLayers;
