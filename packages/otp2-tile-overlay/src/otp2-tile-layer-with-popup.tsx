import EntityPopup, { Feed } from "@opentripplanner/map-popup";
import {
  ConfiguredCompany,
  MapLocationActionArg,
  Stop,
  StopEventHandler
} from "@opentripplanner/types";
import {
  FormFactor,
  RentalVehicle,
  VehicleRentalStation
} from "@opentripplanner/types/otp2";
import React, { useCallback, useEffect, useState } from "react";
import { FilterSpecification, MapLayerMouseEvent } from "maplibre-gl";
import { Layer, Popup, useMap } from "react-map-gl/maplibre";

import { generateLayerPaint, ROUTE_COLOR_EXPRESSION } from "./util";

const AREA_TYPES = ["areaStops"];
export const STOPS_AND_STATIONS_TYPE = "OTP-UI-stopsAndStations";

interface VehicleTypeFromTile {
  formFactor?: FormFactor;
  formFactors?: FormFactor;
  network?: string;
}

export type ClickedEntity = (
  | Stop
  | Omit<Partial<VehicleRentalStation>, "rentalNetwork">
  | Omit<RentalVehicle, "rentalNetwork">
) &
  VehicleTypeFromTile & {
    closed: boolean;
    lat: number;
    lon: number;
    sourceLayer?: string;
    rentalNetwork?: {
      networkId?: string;
      url?: string;
    };
    vehicleType?: {
      formFactor?: FormFactor;
    };
  };

function composeEntity(
  event: MapLayerMouseEvent,
  closedStops: Set<string> | undefined
): ClickedEntity {
  const sourceLayer = event.features?.[0]?.sourceLayer;
  const properties = event.features?.[0]?.properties;
  const stopGtfsId = sourceLayer === "stops" ? properties?.gtfsId : "";

  const synthesizedEntity: ClickedEntity = {
    ...properties,
    closed: stopGtfsId && closedStops?.has(stopGtfsId),
    lat: event.lngLat.lat,
    lon: event.lngLat.lng,
    sourceLayer
  };

  if (
    sourceLayer !== "stops" &&
    sourceLayer !== "stations" &&
    sourceLayer !== "areaStops"
  ) {
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
  }

  return synthesizedEntity;
}

// Not a great way to maintain shared state across multiple layers,
// but because generateOtp2TileLayers is not a component, we can't store the state there.
const clickedEntityByGroup: Record<string, ClickedEntity | null> = {};

const OTP2TileLayerWithPopup = ({
  closedStops,
  color,
  configCompanies,
  feeds,
  getEntityPrefix,
  id,
  network,
  minZoom = 14,
  setLocation,
  setViewedStop,
  sourceId,
  stopsWhitelist,
  type
}: {
  /** A set of gtfsIds for stops that are closed. When provided, the map popup for a closed stop will
   * display a note indicating the cancellation
   */
  closedStops?: Set<string>;
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
   * ID of the <Source> element for this layer.
   */
  sourceId: string;
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
}): JSX.Element | undefined => {
  const { current: map } = useMap();

  // TODO: handle this complex type: it can be a stop, a station, and some extra fields too
  const [clickedEntity, setClickedEntity] = useState<ClickedEntity | null>(
    null
  );

  const defaultClickHandler = useCallback(
    (event: MapLayerMouseEvent) => {
      const synthesizedEntity = composeEntity(event, closedStops);
      if (
        !clickedEntityByGroup[sourceId] ||
        type === "stops" ||
        clickedEntityByGroup[sourceId].sourceLayer !== "stops"
      ) {
        clickedEntityByGroup[sourceId] = synthesizedEntity;
        setClickedEntity(synthesizedEntity);
      }
    },
    [setClickedEntity, closedStops]
  );

  const clearClickedEntity = useCallback(() => {
    clickedEntityByGroup[sourceId] = null;
    setClickedEntity(null);
  }, [setClickedEntity]);

  const onLayerEnter = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "pointer";
    }
  }, [map]);

  const onLayerLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "";
    }
  }, [map]);

  const attachLayerClick = (layerId: string) => {
    if (map) {
      map.on("click", layerId, defaultClickHandler);
    }
  };

  const detachLayerClick = (layerId: string) => {
    if (map) {
      map.off("click", layerId, defaultClickHandler);
    }
  };

  const attachLayerEvents = (layerId: string) => {
    if (map) {
      map.on("mouseenter", layerId, onLayerEnter);
      map.on("mouseleave", layerId, onLayerLeave);
      attachLayerClick(layerId);
    }
  };

  const detachLayerEvents = (layerId: string) => {
    if (map) {
      map.off("mouseenter", layerId, onLayerEnter);
      map.off("mouseleave", layerId, onLayerLeave);
      detachLayerClick(layerId);
    }
  };

  useEffect(() => {
    attachLayerEvents(id);
    attachLayerEvents(`${id}-secondary`);
    attachLayerEvents(`${id}-fill`);
    attachLayerClick(`${id}-outline`);

    return () => {
      detachLayerEvents(id);
      detachLayerEvents(`${id}-secondary`);
      detachLayerEvents(`${id}-fill`);
      detachLayerClick(`${id}-outline`);
    };
  }, [closedStops, id, map]);

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

  const layerMinZoom = stopsWhitelist ? 2 : minZoom;
  const isArea = AREA_TYPES.includes(type);
  const isStopsAndStations = type === STOPS_AND_STATIONS_TYPE;
  return (
    <>
      {isArea && (
        <Layer
          filter={filter}
          id={`${id}-fill`}
          minzoom={layerMinZoom}
          paint={{
            "fill-color": ROUTE_COLOR_EXPRESSION,
            "fill-opacity": 0.2
          }}
          source-layer={type}
          source={sourceId}
          type="fill"
        />
      )}
      {isArea && (
        <Layer
          filter={filter}
          id={`${id}-outline`}
          layout={{ "line-join": "round", "line-cap": "round" }}
          minzoom={layerMinZoom}
          paint={{
            "line-color": ROUTE_COLOR_EXPRESSION,
            "line-opacity": 0.8,
            "line-width": 3
          }}
          source-layer={type}
          source={sourceId}
          type="line"
        />
      )}
      {isStopsAndStations && (
        <Layer
          filter={filter}
          id={id}
          key={`${id}-stops`}
          minzoom={layerMinZoom}
          paint={generateLayerPaint(color).stops}
          source={sourceId}
          source-layer="stops"
          type="circle"
        />
      )}
      {isStopsAndStations && (
        <Layer
          filter={filter}
          id={`${id}-secondary`}
          key={`${id}-stations`}
          minzoom={layerMinZoom}
          paint={generateLayerPaint(color).stops}
          source={sourceId}
          source-layer="stations"
          type="circle"
        />
      )}
      {!isArea && !isStopsAndStations && (
        <Layer
          filter={filter}
          id={id}
          key={id}
          minzoom={layerMinZoom}
          paint={generateLayerPaint(color)[type]}
          source={sourceId}
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
          onClose={clearClickedEntity}
        >
          <EntityPopup
            closePopup={clearClickedEntity}
            configCompanies={configCompanies}
            // @ts-expect-error More type tightening needed.
            entity={{
              ...clickedEntity,
              // @ts-expect-error More type tightening needed.
              id: clickedEntity?.id || clickedEntity?.gtfsId
            }}
            feeds={feeds}
            getEntityPrefix={getEntityPrefix}
            setLocation={
              setLocation
                ? location => {
                    clearClickedEntity();
                    setLocation(location);
                  }
                : undefined
            }
            setViewedStop={
              setViewedStop
                ? stop => {
                    clearClickedEntity();
                    setViewedStop(stop);
                  }
                : undefined
            }
          />
        </Popup>
      )}
    </>
  );
};

export default OTP2TileLayerWithPopup;
