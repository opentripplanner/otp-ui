import { Company, Station, Stop } from "@opentripplanner/types";
import { IntlShape } from "react-intl";
import coreUtils from "@opentripplanner/core-utils";

// eslint-disable-next-line import/prefer-default-export
export function makeDefaultGetEntityName(
  intl: IntlShape,
  defaultEnglishMessages: { [key: string]: string }
) {
  return function defaultGetEntityName(
    entity: Station | Stop,
    configCompanies: Company[]
  ): string | null {
    const stationNetworks =
      "networks" in entity &&
      (coreUtils.itinerary.getCompaniesLabelFromNetworks(
        entity?.networks || [],
        configCompanies
      ) ||
        entity?.networks?.[0]);
    let stationName: string | null = entity.name || entity.id;
    // If the station name or id is a giant UUID (with more than 3 "-" characters)
    // best not to show that at all. The company name will still be shown.
    if ((stationName.match(/-/g) || []).length > 3) {
      stationName = null;
    }

    if ("isFloatingBike" in entity && entity.isFloatingBike) {
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingBike"],
          description: "Popup title for a free-floating bike",
          id: "otpUi.MapPopup.floatingBike"
        },
        { name: stationName || stationNetworks }
      );
    } else if ("isFloatingCar" in entity && entity.isFloatingCar) {
      stationName = intl.formatMessage(
        {
          defaultMessage: defaultEnglishMessages["otpUi.MapPopup.floatingCar"],
          description: "Popup title for a free-floating car",
          id: "otpUi.MapPopup.floatingCar"
        },
        {
          company: stationNetworks,
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
        { name: stationName || stationNetworks }
      );
    }
    return stationName;
  };
}
