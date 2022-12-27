import EntityPopup from "@opentripplanner/map-popup"
import {
  ConfiguredCompany,
  MapLocationActionArg,
} from "@opentripplanner/types"
// eslint-disable-next-line prettier/prettier
import type { EventData } from "mapbox-gl"
import React, { useCallback, useEffect, useState } from "react"
import { Layer, Popup, Source, useMap } from "react-map-gl"

// eslint-disable-next-line prettier/prettier
import { LAYER_PAINT } from "./util"

const SOURCE_ID = "otp2-tiles"

const OTP2TileLayerWithPopup = ({
  configCompanies,
  id,
  network,
  onMapClick,
  setLocation,
  setViewedStop,
  type
}: {
  /**
   * Optional configuration item which allows for customizing properties of scooter and
   * bikeshare companies. If this is provided, scooter/bikeshare company names can be rendered in the
   * default scooter/bike popup.
   */
  configCompanies?: ConfiguredCompany[]
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
  setViewedStop?: ({ stopId }: { stopId: string }) => void
  /**
   * Determines which layer of the OTP2 tile data to display. Also determines icon color.
   */
  type: string
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
    // stops, stations, and vehicles, this re-writing will not be needed.
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

    return () => {
        map?.off("mouseenter", id, onLayerEnter);
        map?.off("mouseleave", id, onLayerLeave);
        map?.off("click", id, onMapClick || defaultClickHandler);
      };
  }, [id, map])

  return (
    <>
      <Layer
        filter={network ? ["all", ["==", "network", network]] : ["all"]}
        id={id}
        key={id}
        paint={LAYER_PAINT[type]}
        source={SOURCE_ID}
        source-layer={type}
        type="circle"
      />
      {clickedEntity && (
        <Popup
          latitude={clickedEntity.lat}
          longitude={clickedEntity.lon}
          maxWidth="100%"
          // TODO: only set null if the x is clicked, not a new stop
          onClose={() => setClickedEntity(null)}
        >
            <EntityPopup
              configCompanies={configCompanies}
              entity={{ ...clickedEntity, id: clickedEntity?.id || clickedEntity?.gtfsId }}
              setLocation={setLocation ? (location) => { setClickedEntity(null); setLocation(location) } : null}
              setViewedStop={setViewedStop}
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
 * @param configCompanies An optional list of companies used to prettify network information.
 * @returns               Array of <Source> and <OTP2TileLayerWithPopup> components
 */
const generateOTP2TileLayers = (
  layers: { name?: string; network?: string; type: string }[],
  endpoint: string,
  setLocation?: (location: MapLocationActionArg) => void,
  setViewedStop?: ({ stopId }: { stopId: string }) => void,
  configCompanies?: ConfiguredCompany[]
): JSX.Element[] => {
  return [
    <Source
      // @ts-expect-error we use a nonstandard prop
      alwaysShow
      id={SOURCE_ID}
      key={SOURCE_ID}
      type="vector"
      // Only grab the data we need based on layers defined
      url={`${endpoint}/${layers.map((l) => l.type).join(",")}/tilejson.json`}
    />,
    ...layers.map((layer) => {
      const { name, network, type } = layer

      const id = `${type}${network ? `-${network}` : ""}`
      return (
        <OTP2TileLayerWithPopup
          configCompanies={configCompanies}
          id={id}
          key={id}
          name={name || id}
          network={network}
          setLocation={setLocation}
          setViewedStop={setViewedStop}
          type={type}
        />
      )
    })
  ]
}

export default generateOTP2TileLayers