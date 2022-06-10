import { Source, Layer, useMap, Popup } from "react-map-gl";
import { EventData } from "mapbox-gl";
import React, { useEffect, useState } from "react";
import {
  Company,
  Station,
  MapLocationActionArg,
  ConfiguredCompany
} from "@opentripplanner/types";
import StationPopup from "./StationPopup";

const getColorForStation = (v: Station) => {
  if (v.isFloatingCar) return "#009cde";
  if (v.isFloatingVehicle) return "#f5a729";
  // TODO: nicer color to match transitive
  if (v.bikesAvailable !== undefined || v.isFloatingBike) return "#f00";
  return "gray";
};

type Props = {
  /**
   * The entire companies config array.
   */
  configCompanies: ConfiguredCompany[];
  /**
   * A list of companies that are applicable to just this instance of the
   * overlay.
   */
  companies?: string[];
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
};

/**
 * This vehicle rental overlay can be used to render vehicle rentals of various
 * types. This layer can be configured to show different styles of markers at
 * different zoom levels.
 */
const VehicleRentalOverlay = (props: Props): JSX.Element => {
  const { mainMap } = useMap();
  const {
    visible,
    setLocation,
    refreshVehicles,
    stations,
    configCompanies,
    getStationName
  } = props;
  const [clickedVehicle, setClickedVehicle] = useState(null);

  useEffect(() => {
    // TODO: Make 30s configurable?
    setInterval(refreshVehicles, 30_000);
  }, [refreshVehicles]);

  useEffect(() => {
    const VEHICLE_LAYERS = ["rental-vehicles"];
    VEHICLE_LAYERS.forEach(stopLayer => {
      mainMap?.on("mouseenter", stopLayer, () => {
        mainMap.getCanvas().style.cursor = "pointer";
      });
      mainMap?.on("mouseleave", stopLayer, () => {
        mainMap.getCanvas().style.cursor = "";
      });
      mainMap?.on("click", stopLayer, (event: EventData) => {
        setClickedVehicle(event.features?.[0].properties);
      });
    });
  }, [mainMap]);

  // Don't render if no map or no stops are defined.
  if (visible === false || !stations || stations.length === 0) {
    return <></>;
  }

  const bounds = mainMap?.getBounds();
  if (!bounds) return null;

  const vehiclesGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: stations.map(vehicle => ({
      type: "Feature",
      properties: {
        ...vehicle,
        networks: JSON.stringify(vehicle.networks),
        "stroke-width":
          vehicle.isFloatingBike || vehicle.isFloatingVehicle ? 1 : 2,
        color: getColorForStation(vehicle)
      },
      geometry: { type: "Point", coordinates: [vehicle.x, vehicle.y] }
    }))
  };

  return (
    <>
      <Source type="geojson" data={vehiclesGeoJSON}>
        <Layer
          id="rental-vehicles"
          type="circle"
          paint={{
            "circle-color": ["get", "color"],
            "circle-opacity": 0.9,
            "circle-stroke-width": ["get", "stroke-width"],
            "circle-stroke-color": "#333"
          }}
        />
        {/* this is where we add the symbols layer. add a second layer that gets swapped in and out dynamically */}
      </Source>
      {clickedVehicle && (
        <Popup
          closeOnClick={false}
          longitude={clickedVehicle.x}
          latitude={clickedVehicle.y}
          maxWidth="100%"
        >
          <StationPopup
            configCompanies={configCompanies}
            setLocation={setLocation}
            getStationName={getStationName}
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
