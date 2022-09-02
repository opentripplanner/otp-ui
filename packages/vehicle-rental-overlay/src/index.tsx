import { MarkerWithPopup } from "@opentripplanner/base-map";
import {
  Company,
  ConfiguredCompany,
  MapLocationActionArg,
  Station
} from "@opentripplanner/types";
import { EventData } from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { Layer, Popup, Source, useMap } from "react-map-gl";

import StationPopup from "./StationPopup";
import { BaseBikeRentalIcon, StationMarker } from "./styled";

// TODO: Make configurable?
const DETAILED_MARKER_CUTOFF = 16;

const getColorForStation = (v: Station) => {
  if (v.isFloatingCar) return "#009cde";
  if (v.isFloatingVehicle) return "#f5a729";
  // TODO: nicer color to match transitive
  if (v.bikesAvailable !== undefined || v.isFloatingBike) return "#f00";
  return "gray";
};

const checkIfPositionInViewport = (
  bounds: mapboxgl.LngLatBounds,
  lat: number,
  lng: number
): boolean => {
  const PADDING = 0.001;
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
   * A list of companies that are applicable to just this instance of the
   * overlay.
   */
  companies?: string[];
  /**
   * The entire companies config array.
   */
  configCompanies: ConfiguredCompany[];
  /**
   * An id, used to make this layer uniquely identifiable
   */
  id: string;
  /**
   * An optional custom function to create a string name of a particular vehicle
   * rental station. This function takes two arguments of the configCompanies
   * prop and a vehicle rental station. The function must return a string.
   */
  getStationName?: (configCompanies: Company[], station: Station) => string;
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
   * A list of the vehicle rental stations specific to this overlay instance.
   */
  stations: Station[];
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
  getStationName,
  id,
  refreshVehicles,
  setLocation,
  stations,
  visible
}: Props): JSX.Element => {
  const { current: map } = useMap();
  const zoom = map?.getZoom();
  const bounds = map?.getBounds();

  const layerId = `rental-vehicles-${id}`;
  const [clickedVehicle, setClickedVehicle] = useState(null);

  useEffect(() => {
    // TODO: Make 30s configurable?
    if (!refreshVehicles || typeof refreshVehicles !== "function") {
      return;
    }

    refreshVehicles();
    setInterval(refreshVehicles, 30_000);
  }, [refreshVehicles]);

  useEffect(() => {
    const VEHICLE_LAYERS = [layerId];
    VEHICLE_LAYERS.forEach(stopLayer => {
      map?.on("mouseenter", stopLayer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map?.on("mouseleave", stopLayer, () => {
        map.getCanvas().style.cursor = "";
      });
      map?.on("click", stopLayer, (event: EventData) => {
        setClickedVehicle(event.features?.[0].properties);
      });
    });
  }, [map]);

  // Don't render if no map or no stops are defined.
  if (visible === false || !stations || stations.length === 0) {
    // Null can't be returned here -- react-map-gl dislikes null values as children
    return <></>;
  }

  const vehiclesGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: stations
      .filter(
        vehicle =>
          // Include specified companies only if companies is specified and network info is available
          !companies ||
          !vehicle.networks ||
          companies.includes(vehicle.networks[0])
      )
      .map(vehicle => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [vehicle.x, vehicle.y] },
        properties: {
          ...vehicle,
          networks: JSON.stringify(vehicle.networks),
          "stroke-width":
            vehicle.isFloatingBike || vehicle.isFloatingVehicle ? 1 : 2,
          color: getColorForStation(vehicle)
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
        stations
          .filter(station =>
            checkIfPositionInViewport(bounds, station.y, station.x)
          )
          .map(station => (
            <MarkerWithPopup
              key={station.id}
              popupContents={
                <StationPopup
                  configCompanies={configCompanies}
                  setLocation={location => {
                    setClickedVehicle(null);
                    setLocation(location);
                  }}
                  getStationName={getStationName}
                  station={station}
                />
              }
              position={[station.y, station.x]}
            >
              {station.bikesAvailable !== undefined &&
              !station.isFloatingBike &&
              !station.isFloatingVehicle &&
              station.spacesAvailable !== undefined ? (
                <BaseBikeRentalIcon
                  percent={
                    station?.bikesAvailable /
                    (station?.bikesAvailable + station?.spacesAvailable)
                  }
                />
              ) : (
                <StationMarker width={12} color={getColorForStation(station)} />
              )}
            </MarkerWithPopup>
          ))}
      {clickedVehicle && (
        <Popup
          latitude={clickedVehicle.y}
          longitude={clickedVehicle.x}
          maxWidth="100%"
          onClose={() => {
            setClickedVehicle(null);
          }}
        >
          <StationPopup
            configCompanies={configCompanies}
            getStationName={getStationName}
            setLocation={location => {
              setClickedVehicle(null);
              setLocation(location);
            }}
            station={{
              ...clickedVehicle,
              networks: JSON.parse(clickedVehicle.networks)
            }}
          />
        </Popup>
      )}
    </>
  );
};
export default VehicleRentalOverlay;
