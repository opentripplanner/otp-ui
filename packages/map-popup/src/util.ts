import {
  Agency,
  Company,
  Station,
  Stop,
  TileLayerStation
} from "@opentripplanner/types";
import { IntlShape } from "react-intl";
import coreUtils from "@opentripplanner/core-utils";

export type StopIdAgencyMap = Record<string, Agency>;
export type Entity = Station | Stop | TileLayerStation;

export function getNetwork(entity: Entity, configCompanies: Company[]): string {
  return (
    "network" in entity &&
    (coreUtils.itinerary.getCompaniesLabelFromNetworks(
      [entity.network] || [],
      configCompanies
    ) ||
      entity.network)
  );
}

// eslint-disable-next-line import/prefer-default-export
export function makeDefaultGetEntityName(
  intl: IntlShape,
  defaultEnglishMessages: { [key: string]: string }
) {
  return function defaultGetEntityName(
    entity: Entity,
    configCompanies: Company[],
    feedName?: string
  ): string | null {
    let stationName: string | null = entity.name || entity.id;
    // If the station name or id is a giant UUID (with more than 3 "-" characters)
    // best not to show that at all. The company name will still be shown.
    // Also ignore "Default Vehicle Type"
    if (
      (stationName.match(/-/g) || []).length > 3 ||
      stationName === "Default vehicle type"
    ) {
      stationName = null;
    }

    if ("isFloatingBike" in entity && entity.isFloatingBike) {
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingBike"],
          description: "Popup title for a free-floating bike",
          id: "otpUi.MapPopup.floatingBike"
        },
        { name: stationName }
      );
    } else if ("isFloatingCar" in entity && entity.isFloatingCar) {
      // TODO: Stop generating this / passing it to the car string? Is it needed?
      // In English we say "Car: " instead
      const stationNetwork = getNetwork(entity, configCompanies);
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingCar"],
          description: "Popup title for a free-floating car",
          id: "otpUi.MapPopup.floatingCar"
        },
        {
          company: stationNetwork,
          name: stationName
        }
      );
    } else if ("isFloatingVehicle" in entity && entity.isFloatingVehicle) {
      // assumes that all floating vehicles are E-scooters
      stationName = intl.formatMessage(
        {
          defaultMessage:
            defaultEnglishMessages["otpUi.MapPopup.floatingEScooter"],
          description: "Popup title for a free-floating e-scooter",
          id: "otpUi.MapPopup.floatingEScooter"
        },
        { name: stationName }
      );
    } else if (feedName && "code" in entity) {
      stationName = `${stationName} (${feedName} ${entity.code})`;
    }
    return stationName;
  };
}
