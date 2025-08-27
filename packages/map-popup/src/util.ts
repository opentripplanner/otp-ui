import {
  RentalVehicle,
  VehicleRentalStation
} from "@opentripplanner/types/otp2";
import { Agency, Company, Stop } from "@opentripplanner/types";
import { IntlShape } from "react-intl";
import coreUtils from "@opentripplanner/core-utils";

export type StopIdAgencyMap = Record<string, Agency>;
export type Entity = VehicleRentalStation | Stop | RentalVehicle;

export function getNetwork(entity: Entity, configCompanies: Company[]): string {
  return (
    "rentalNetwork" in entity &&
    (coreUtils.itinerary.getCompaniesLabelFromNetworks(
      entity.rentalNetwork.networkId,
      configCompanies
    ) ||
      entity.rentalNetwork.networkId)
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
    feedName?: string,
    includeParenthetical = true
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

    if (
      "vehicleType" in entity &&
      !("availableVehicles" in entity) &&
      entity.vehicleType?.formFactor === "BICYCLE"
    ) {
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingBike"],
          description: "Popup title for a free-floating bike",
          id: "otpUi.MapPopup.floatingBike"
        },
        { name: stationName }
      );
    } else if (
      "vehicleType" in entity &&
      entity.vehicleType?.formFactor === "CAR"
    ) {
      // TODO: Stop generating this / passing it to the car string? Is it needed?
      // In English we say "Car: " instead
      const network = getNetwork(entity, configCompanies);
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingCar"],
          description: "Popup title for a free-floating car",
          id: "otpUi.MapPopup.floatingCar"
        },
        {
          company: network,
          name: stationName
        }
      );
    } else if (
      "vehicleType" in entity &&
      !("availableVehicles" in entity) &&
      entity.vehicleType?.formFactor.startsWith("SCOOTER")
    ) {
      stationName = intl.formatMessage(
        {
          defaultMessage:
            defaultEnglishMessages["otpUi.MapPopup.floatingEScooter"],
          description: "Popup title for a free-floating e-scooter",
          id: "otpUi.MapPopup.floatingEScooter"
        },
        { name: stationName }
      );
    } else if (includeParenthetical && feedName && "code" in entity) {
      stationName = `${stationName} (${feedName} ${entity.code})`;
    }
    return stationName;
  };
}
