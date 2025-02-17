import EntityPopup from "@opentripplanner/map-popup"
import {
  ConfiguredCompany,
  MapLocationActionArg,
  Station,
  Stop,
  StopEventHandler,
} from "@opentripplanner/types"
// eslint-disable-next-line prettier/prettier
import type { EventData } from "mapbox-gl"
import React, { useCallback, useEffect, useState } from "react"
import { Layer, Popup, Source, useMap } from "react-map-gl"

// eslint-disable-next-line prettier/prettier
import { generateLayerPaint, ROUTE_COLOR_EXPRESSION } from "./util"

const SOURCE_ID = "otp2-tiles"
const AREA_TYPES = ["areaStops"]
const STOPS_AND_STATIONS_TYPE = "OTP-UI-stopsAndStations"

const OTP2TileLayerWithPopup = ({
  color,
  configCompanies,
  getEntityPrefix,
  id,
  network,
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
   * default scooter/bike popup.
   */
  configCompanies?: ConfiguredCompany[]
  getEntityPrefix?: (entity: Stop | Station) => JSX.Element
  id: string
  name?: string
  /**
   * If `network` is specified, the layer will be filtered to only show vehicles from
   * that network
   */
  network?: string
  /**
   * An optional method to override the map click handler. If a method is passed, NO POPUPS
   * WILL APPEAR ON CLICK. The implementer will be responsible for handling all click events
   * in accordance with the MapLibreGL api.
   */
  onMapClick?: (event: EventData) => void
  /**
   * A method fired when a stop is selected as from or to in the default popup. If this method
   * is not passed, the from/to buttons will not be shown.
   */
  setLocation?: (location: MapLocationActionArg) => void
  /**
   * A method fired when the stop viewer is opened in the default popup. If this method is
   * not passed, the stop viewer link will not be shown.
   */
  setViewedStop?: StopEventHandler
  /**
   * A list of GTFS stop ids (with agency prepended). If specified, all stops that
   * are NOT in this list will be HIDDEN.
   */
  stopsWhitelist?: string[]
  /**
   * Determines which layer of the OTP2 tile data to display. Also determines icon color.
   */
  type: string
  visible?: boolean
}): JSX.Element => {
  const { current: map } = useMap()

  // TODO: handle this complex type: it can be a stop, a station, and some extra fields too
  const [clickedEntity, setClickedEntity] = useState<any>(null)

  const defaultClickHandler = (event: EventData) => {
    const { sourceLayer } = event.features?.[0]
    const synthesizedEntity = {
      ...event.features?.[0].properties,
      lat: event.lngLat.lat,
      lon: event.lngLat.lng,
      sourceLayer
    }

    // TODO: once the popup converges into a single one that can handle
    // stops, stations, and vehicles, this re-writing will not be needed
    // See: https://github.com/opentripplanner/otp-ui/pull/472#discussion_r1023124055
    if (sourceLayer === "stops" || sourceLayer === "stations") {
      setClickedEntity(synthesizedEntity)
    }
    if (
      sourceLayer === "rentalVehicles" ||
      sourceLayer === "rentalStations"
    ) {
      setClickedEntity({
        // GraphQL field not in the tile info, but we can deduce it
        isFloatingBike:
          sourceLayer === "rentalVehicles" &&
          synthesizedEntity.formFactor === "BICYCLE",
        // GraphQL field not in the tile info, but we can deduce it
        isFloatingVehicle:
          sourceLayer === "rentalVehicles" &&
          synthesizedEntity.formFactor === "SCOOTER",
        // OTP1 compatibility -- will get overwritten if possible
        networks: [synthesizedEntity.network],
        ...synthesizedEntity,
        // OTP1 compatibility
        bikesAvailable: synthesizedEntity.vehiclesAvailable,
        // OTP1 compatibility
        x: synthesizedEntity.lon,
        // OTP1 compatibility
        y: synthesizedEntity.lat
      })
    }
  }

  const onLayerEnter = useCallback(() => {
    map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const onLayerLeave = useCallback(() => {
    map.getCanvas().style.cursor = "";
  }, [map]);

  useEffect(() => {
    map?.on("mouseenter", id, onLayerEnter)
    map?.on("mouseleave", id, onLayerLeave)
    map?.on("click", id, onMapClick || defaultClickHandler)

    map?.on("mouseenter", `${id}-secondary`, onLayerEnter)
    map?.on("mouseleave", `${id}-secondary`, onLayerLeave)
    map?.on("click", `${id}-secondary`, onMapClick || defaultClickHandler)

    return () => {
      map?.off("mouseenter", id, onLayerEnter);
      map?.off("mouseleave", id, onLayerLeave);
      map?.off("click", id, onMapClick || defaultClickHandler);

      map?.off("mouseenter", `${id}-secondary`, onLayerEnter);
      map?.off("mouseleave", `${id}-secondary`, onLayerLeave);
      map?.off("click", `${id}-secondary`, onMapClick || defaultClickHandler)
    };
  }, [id, map])

  let filter: any[] = ["all"]
  if (network) {
    filter = ["all", ["==", "network", network]]
  }
  if (type === "stops" || type === "areaStops" || type === STOPS_AND_STATIONS_TYPE) {
    filter = ["all", ["!", ["has", "parentStation"]], ["!=", ["get", "routes"], ["literal", "[]"]]]
  }
  if (stopsWhitelist) {
    filter = ["in", ["get", "gtfsId"], ["literal", stopsWhitelist]]
  }

  const isArea = AREA_TYPES.includes(type)
  const isStopsAndStations = type === STOPS_AND_STATIONS_TYPE
  return (
    <>
      {isArea && <Layer
        filter={filter}
        id={`${id}-fill`}
        paint={{
          "fill-color": ROUTE_COLOR_EXPRESSION,
          "fill-opacity": 0.2,
        }}
        source-layer={type}
        source={SOURCE_ID}
        minzoom={stopsWhitelist ? 2 : 14}
        type="fill"
      />}
      {isArea && <Layer
        filter={filter}
        id={`${id}-outline`}
        layout={{ "line-join": "round", "line-cap": "round" }}
        minzoom={stopsWhitelist ? 2 : 14}
        paint={{
          "line-color": ROUTE_COLOR_EXPRESSION,
          "line-opacity": 0.8,
          "line-width": 3
        }}
        source-layer={type}
        source={SOURCE_ID}
        type="line"
      />}
      {isStopsAndStations && <Layer
        filter={filter}
        id={id}
        key={`${id}-stops`}
        paint={generateLayerPaint(color).stops}
        source={SOURCE_ID}
        minzoom={stopsWhitelist ? 2 : 14}
        source-layer="stops"
        type="circle"
      />}
      {isStopsAndStations && <Layer
        filter={filter}
        id={`${id}-secondary`}
        key={`${id}-stations`}
        paint={generateLayerPaint(color).stops}
        source={SOURCE_ID}
        minzoom={stopsWhitelist ? 2 : 14}
        source-layer="stations"
        type="circle"
      />}
      {!isArea && !isStopsAndStations && <Layer
        filter={filter}
        id={id}
        key={id}
        paint={generateLayerPaint(color)[type]}
        source={SOURCE_ID}
        minzoom={stopsWhitelist ? 2 : 14}
        source-layer={type}
        type="circle"
      />}
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
            entity={{ ...clickedEntity, id: clickedEntity?.id || clickedEntity?.gtfsId }}
            getEntityPrefix={getEntityPrefix}
            setLocation={setLocation ? (location) => { setClickedEntity(null); setLocation(location) } : null}
            setViewedStop={setViewedStop ? (stop) => { setClickedEntity(null);setViewedStop(stop) } : null}
          />

        </Popup>
      )}
    </>
  )
}

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
  layers: { color?: string; name?: string; network?: string; type: string, initiallyVisible?: boolean, overrideType?: string }[],
  endpoint: string,
  setLocation?: (location: MapLocationActionArg) => void,
  setViewedStop?: (stop: Stop) => void,
  stopsWhitelist?: string[],
  configCompanies?: ConfiguredCompany[],
  getEntityPrefix?: (entity: Stop | Station) => JSX.Element
): JSX.Element[] => {
  const fakeOtpUiLayerIndex = layers.findIndex(l=>l.type === STOPS_AND_STATIONS_TYPE)
  if (fakeOtpUiLayerIndex > -1) {
    layers[fakeOtpUiLayerIndex].overrideType = "stops,stations"
  }

  return [
    <Source
      // @ts-expect-error we use a nonstandard prop
      alwaysShow
      id={SOURCE_ID}
      key={SOURCE_ID}
      type="vector"
      // Only grab the data we need based on layers defined
      url={`${endpoint}/${layers.map((l) => l.overrideType || l.type).join(",")}/tilejson.json`}
    />,
    ...layers.map((layer) => {
      const { color, name, network, type, initiallyVisible } = layer

      const id = `${type}${network ? `-${network}` : ""}`
      return (
        <OTP2TileLayerWithPopup
          color={color}
          configCompanies={configCompanies}
          getEntityPrefix={getEntityPrefix}
          id={id}
          key={id}
          name={name || id}
          network={network}
          setLocation={setLocation}
          setViewedStop={setViewedStop}
          stopsWhitelist={stopsWhitelist}
          type={type}
          visible={initiallyVisible}
        />
      )
    })
  ]
}

export default generateOTP2TileLayers