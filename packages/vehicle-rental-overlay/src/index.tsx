import { MarkerWithPopup, Popup } from "@opentripplanner/base-map";
import {
  Company,
  ConfiguredCompany,
  MapLocationActionArg
} from "@opentripplanner/types";
import {
  RentalVehicle,
  VehicleRentalStation
} from "@opentripplanner/types/otp2";
import { EventData } from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import { Geometry } from "geojson";

import StationPopup from "@opentripplanner/map-popup";
import { BaseBikeRentalIcon, StationMarker } from "./styled";

// TODO: Make configurable?
const DETAILED_MARKER_CUTOFF = 16;

function entityIsStation(
  entity: VehicleRentalStation | RentalVehicle
): entity is VehicleRentalStation {
  return "availableVehicles" in entity;
}

const getColorForEntity = (entity: VehicleRentalStation | RentalVehicle) => {
  if (entityIsStation(entity)) {
    if (entity.availableVehicles && entity.availableVehicles.total > 0)
      return "#f00";
  } else {
    if (entity.vehicleType.formFactor.startsWith("SCOOTER")) return "#f5a729";
    if (entity.vehicleType.formFactor === "BICYCLE") return "#009cde";
  }
  return "gray";
};

type Props = {
  /**
   * A list of companies that are applicable to just this instance of the
   * overlay.
   */
  companies?: string[];
  /**
   * The entire companies config array.
   */
  configCompanies: ConfiguredCompany[];
  /**
   * The entities to be represented in the overlay. They can be a combination of VehicleRentalStation type
   * (for stationary stations) and RentalVehicle type (for floating vehicles)
   */
  entities?: (VehicleRentalStation | RentalVehicle)[];
  /**
   * An id, used to make this layer uniquely identifiable
   */
  id: string;
  /**
   * An optional custom function to create a string name of a particular vehicle
   * rental station. This function takes two arguments of the configCompanies
   * prop and a vehicle rental station. The function must return a string.
   */
  getStationName?: (
    configCompanies: Company[],
    station: VehicleRentalStation
  ) => string;
  /**
   * If specified, a function that will be triggered every 30 seconds whenever this layer is
   * visible.
   */
  refreshVehicles?: () => void;
  /**
   * A callback for when a user clicks on setting this stop as either the from
   * or to location of a new search.
   *
   * This will be dispatched with the following argument:
   *
   * ```js
   *  {
   *    location: {
   *      lat: number,
   *      lon: number,
   *      name: string
   *    },
   *    locationType: "from" or "to"
   *  }
   * ```
   */
  setLocation?: (arg: MapLocationActionArg) => void;
  /**
   * Whether the overlay is currently visible.
   */
  visible?: boolean;
  /**
   * TODO: Add props for overriding symbols?
   */
};

/**
 * This vehicle rental overlay can be used to render vehicle rentals of various
 * types. This layer can be configured to show different styles of markers at
 * different zoom levels.
 */
const VehicleRentalOverlay = ({
  companies,
  configCompanies,
  entities,
  getStationName,
  id,
  refreshVehicles,
  setLocation,
  visible
}: Props): JSX.Element => {
  const { current: map } = useMap();
  const [zoom, setZoom] = useState(map?.getZoom());

  const layerId = `rental-vehicles-${id}`;
  const [clickedVehicle, setClickedVehicle] = useState<
    RentalVehicle | VehicleRentalStation | undefined
  >();

  useEffect(() => {
    // TODO: Make 30s configurable?
    if (!refreshVehicles || typeof refreshVehicles !== "function") {
      return;
    }

    refreshVehicles();
    setInterval(refreshVehicles, 30_000);
  }, [refreshVehicles]);

  useEffect(() => {
    const mouseEnterFunc = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const mouseLeaveFunc = () => {
      map.getCanvas().style.cursor = "";
    };
    const clickFunc = (event: EventData) => {
      const p = event.features?.[0].properties;
      setClickedVehicle({
        ...p,
        // the properties field of the GeoJSON Feature object serializes these
        // two objects into JSON strings, so we need to parse them back into objects
        availableSpaces: JSON.parse(p.availableSpaces),
        availableVehicles: JSON.parse(p.availableVehicles)
      } as RentalVehicle | VehicleRentalStation);
    };
    const zoomFunc = e => {
      // Avoid too many re-renders by only updating state if we are a whole number value different
      const { zoom: newZoom } = e.viewState; // this is undefined, causing error on zoom
      if (Math.floor(zoom / 2) !== Math.floor(newZoom / 2)) {
        setZoom(newZoom);
      }
    };

    map?.on("mouseenter", layerId, mouseEnterFunc);
    map?.on("mouseleave", layerId, mouseLeaveFunc);
    map?.on("click", layerId, clickFunc);
    map?.on("zoom", zoomFunc);

    return () => {
      map?.off("mouseenter", layerId, mouseEnterFunc);
      map?.off("mouseleave", layerId, mouseLeaveFunc);
      map?.off("click", layerId, clickFunc);
      map?.off("zoom", zoomFunc);
    };
  }, [map]);

  // Don't render if no map or no stops are defined.
  if (visible === false || entities.length === 0) {
    // Null can't be returned here -- react-map-gl dislikes null values as children
    return <></>;
  }

  const vehiclesGeoJSON: GeoJSON.FeatureCollection<
    Geometry,
    VehicleRentalStation | RentalVehicle
  > = {
    type: "FeatureCollection",
    features: entities
      .filter(
        entity =>
          // Include specified companies only if companies is specified and network info is available
          !companies ||
          !entity.rentalNetwork.networkId ||
          companies.includes(entity.rentalNetwork.networkId)
      )
      .map(entity => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [entity.lon, entity.lat] },
        properties: {
          ...entity,
          networks: entity.rentalNetwork.networkId,
          "stroke-width": entityIsStation(entity) ? 1 : 2,
          color: getColorForEntity(entity)
        }
      }))
  };

  return (
    <>
      {zoom < DETAILED_MARKER_CUTOFF && (
        <Source type="geojson" data={vehiclesGeoJSON}>
          <Layer
            id={layerId}
            paint={{
              "circle-color": ["get", "color"],
              "circle-opacity": 0.9,
              "circle-stroke-color": "#333",
              "circle-stroke-width": ["get", "stroke-width"]
            }}
            type="circle"
          />
          {/* this is where we add the symbols layer. add a second layer that gets swapped in and out dynamically */}
        </Source>
      )}
      {zoom >= DETAILED_MARKER_CUTOFF &&
        entities.map(entity => (
          <MarkerWithPopup
            key={entity.id}
            popupContents={
              <StationPopup
                configCompanies={configCompanies}
                setLocation={location => {
                  setClickedVehicle(undefined);
                  setLocation(location);
                }}
                getEntityName={
                  // @ts-expect-error no stop support. Avoid a breaking change
                  getStationName && ((s, cc) => getStationName(cc, s))
                }
                entity={entity}
              />
            }
            position={[entity.lat, entity.lon]}
          >
            {"availableVehicles" in entity &&
            entity.availableVehicles.total > 0 &&
            entity.availableSpaces !== undefined ? (
              <BaseBikeRentalIcon
                percent={
                  entity?.availableVehicles.total /
                  (entity?.availableVehicles.total +
                    entity?.availableSpaces.total)
                }
              />
            ) : (
              <StationMarker width={12} color={getColorForEntity(entity)} />
            )}
          </MarkerWithPopup>
        ))}
      {clickedVehicle && (
        <Popup
          latitude={clickedVehicle.lat}
          longitude={clickedVehicle.lon}
          maxWidth="100%"
          onClose={() => {
            setClickedVehicle(undefined);
          }}
        >
          <StationPopup
            configCompanies={configCompanies}
            getEntityName={
              // @ts-expect-error no stop support. Avoid a breaking change
              getStationName && ((s, cc) => getStationName(cc, s))
            }
            setLocation={location => {
              setClickedVehicle(undefined);
              setLocation(location);
            }}
            entity={clickedVehicle}
          />
        </Popup>
      )}
    </>
  );
};
export default VehicleRentalOverlay;
export { StationPopup };
