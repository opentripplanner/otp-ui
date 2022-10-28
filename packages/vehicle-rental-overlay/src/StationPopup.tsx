import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import coreUtils from "@opentripplanner/core-utils";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import {
  Company,
  ConfiguredCompany,
  MapLocationActionArg,
  Station
} from "@opentripplanner/types";
import flatten from "flat";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import React from "react";

// Load the default messages.
// @ts-expect-error why is this failing?
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages = flatten(defaultEnglishMessages);

function makeDefaultGetStationName(intl: IntlShape) {
  return function defaultGetStationName(
    configCompanies: Company[],
    station: Station
  ) {
    const stationNetworks =
      coreUtils.itinerary.getCompaniesLabelFromNetworks(
        station?.networks || [],
        configCompanies
      ) || station?.networks?.[0];
    let stationName = station.name || station.id;
    // If the station name or id is a giant UUID (with more than 3 "-" characters)
    // best not to show that at all. The company name will still be shown.
    if ((stationName.match(/-/g) || []).length > 3) {
      stationName = null;
    }

    if (station.isFloatingBike) {
      stationName = intl.formatMessage(
        {
          defaultMessage:
            defaultEnglishMessages["otpUi.VehicleRentalOverlay.floatingBike"],
          description: "Popup title for a free-floating bike",
          id: "otpUi.VehicleRentalOverlay.floatingBike"
        },
        { name: stationName || stationNetworks }
      );
    } else if (station.isFloatingCar) {
      stationName = intl.formatMessage(
        {
          defaultMessage:
            defaultEnglishMessages["otpUi.VehicleRentalOverlay.floatingCar"],
          description: "Popup title for a free-floating car",
          id: "otpUi.VehicleRentalOverlay.floatingCar"
        },
        {
          company: stationNetworks,
          name: stationName
        }
      );
    } else if (station.isFloatingVehicle) {
      // assumes that all floating vehicles are E-scooters
      stationName = intl.formatMessage(
        {
          defaultMessage:
            defaultEnglishMessages[
              "otpUi.VehicleRentalOverlay.floatingEScooter"
            ],
          description: "Popup title for a free-floating e-scooter",
          id: "otpUi.VehicleRentalOverlay.floatingEScooter"
        },
        { name: stationName || stationNetworks }
      );
    }
    return stationName;
  };
}

type Props = {
  configCompanies: ConfiguredCompany[];
  getStationName?: (configCompanies: Company[], station: Station) => string;
  setLocation: (arg: MapLocationActionArg) => void;
  station: Station;
};
/**
 * Render some popup html for a station. This contains custom logic for
 * displaying rental vehicles in the TriMet MOD website that might not be
 * applicable to other regions.
 */
const StationPopup = (props: Props): JSX.Element => {
  const intl = useIntl();
  const { configCompanies, getStationName, setLocation, station } = props;
  const stationIsHub =
    station.bikesAvailable !== undefined && !station.isFloatingBike;
  const getStationNameFunc = getStationName || makeDefaultGetStationName(intl);
  const stationName = getStationNameFunc(configCompanies, station);
  const location = {
    lat: station.y,
    lon: station.x,
    name: stationName
  };
  return (
    <BaseMapStyled.MapOverlayPopup>
      <BaseMapStyled.PopupTitle>{stationName}</BaseMapStyled.PopupTitle>

      {/* render dock info if it is available */}
      {stationIsHub && (
        <BaseMapStyled.PopupRow>
          <div>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.VehicleRentalOverlay.availableBikes"]
              }
              description="Label text for the number of bikes available"
              id="otpUi.VehicleRentalOverlay.availableBikes"
              values={{ value: station.bikesAvailable }}
            />
          </div>
          <div>
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.VehicleRentalOverlay.availableDocks"]
              }
              description="Label text for the number of docks available"
              id="otpUi.VehicleRentalOverlay.availableDocks"
              values={{ value: station.spacesAvailable }}
            />
          </div>
        </BaseMapStyled.PopupRow>
      )}

      {/* Set as from/to toolbar */}
      <BaseMapStyled.PopupRow>
        <FromToLocationPicker
          label
          location={location}
          setLocation={setLocation}
        />
      </BaseMapStyled.PopupRow>
    </BaseMapStyled.MapOverlayPopup>
  );
};

export default StationPopup;
