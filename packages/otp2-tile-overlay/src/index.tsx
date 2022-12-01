import {
  ConfiguredCompany,
  MapLocationActionArg,
} from "@opentripplanner/types"
import { Layer, Popup,  Source, useMap } from "react-map-gl"
// TODO: Once OTP1 support is deprecated, move this into this package and merge
// See: https://github.com/opentripplanner/otp-ui/pull/472#discussion_r1023121840
import { StationPopup } from "@opentripplanner/vehicle-rental-overlay"
// TODO: Once OTP1 support is deprecated, move this into this package and merge
// See: https://github.com/opentripplanner/otp-ui/pull/472#discussion_r1023121840
import { StopPopup } from "@opentripplanner/stops-overlay"
import React, { useEffect, useState } from "react"
// eslint-disable-next-line prettier/prettier
import type { EventData } from "mapbox-gl"
import { LAYER_PAINT } from "./util"

const OTP2TileLayerWithPopup = ({
  configCompanies,
  id,
  network,
  setLocation,
  setViewedStop,
  onMapClick,
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
   * An optional method to override the map click handler. If a method is passed, NO POPUPS
   * WILL APPEAR ON CLICK. The implementer will be responsible for handling all click events
   * in accordance with the MapLibreGL api.
   */
  onMapClick?: (event: EventData) => void
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

  useEffect(() => {
    map?.on("mouseenter", id, () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map?.on("mouseleave", id, () => {
      map.getCanvas().style.cursor = ""
    })
    map?.on("click", id, onMapClick || defaultClickHandler)
  }, [id, map])

  return (
    <>
      <Layer
        filter={network ? ["all", ["==", "network", network]] : ["all"]}
        id={id}
        key={id}
        paint={LAYER_PAINT[type]}
        source="otp2-tiles"
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
          {clickedEntity.sourceLayer.includes("rental") && (
            <StationPopup
              configCompanies={configCompanies}
              setLocation={setLocation ? (location) => {
                setClickedEntity(null)
                setLocation(location)
              } : null}
              station={clickedEntity}
            />
          )}
          {(clickedEntity.sourceLayer.includes("stop") ||
            clickedEntity.sourceLayer.includes("station")) && (
            <StopPopup
                setLocation={setLocation ? (location) => {
                setClickedEntity(null)
                setLocation(location)
              } : null}
                setViewedStop={setViewedStop ? (stop) => {
                setClickedEntity(null)
                setViewedStop(stop)
              } : null}
                stop={{ ...clickedEntity, id: clickedEntity.gtfsId }}
              />
          )}
        </Popup>
      )}
    </>
  )
}

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
      id="otp2-tiles"
      key="otp2-tiles"
      type="vector"
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