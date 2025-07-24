import coreUtils from "@opentripplanner/core-utils";
import { Config, FormFactor, Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import * as S from "../styled";
import { defaultMessages } from "../util";

interface Props {
  config: Config;
  leg: Leg;
}

/**
 * Although similar to utils/getVehicleType, this version accommodates gendered articles
 * for Spanish and French, so sentences literally read like "Pickup the scooter ABC".
 */
function VehicleType({ type }: { type: FormFactor }) {
  switch (type) {
    case "BICYCLE":
    case "CARGO_BICYCLE":
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages[
              "otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.bikeshare"
            ]
          }
          description="Bike vehicle type"
          id="otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.bikeshare"
        />
      );
    case "CAR":
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages[
              "otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.car"
            ]
          }
          description="Bike vehicle type"
          id="otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.car"
        />
      );
    case "SCOOTER_SEATED":
    case "SCOOTER_STANDING":
    case "SCOOTER":
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages[
              "otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.escooter"
            ]
          }
          description="Bike vehicle type"
          id="otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.escooter"
        />
      );
    default:
      return (
        <FormattedMessage
          defaultMessage={
            defaultMessages[
              "otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.vehicle"
            ]
          }
          description="Bike vehicle type"
          id="otpUi.AccessLegBody.RentedVehicleSubheader.vehicleType.vehicle"
        />
      );
  }
}

/**
 * A component to display vehicle rental instructions, such as
 *   Pick up REACHNOW rented car XYZNDB OR
 *   Pick up SPIN E-scooter
 *   Pick up shared bike
 *
 * The word "Vehicle" has been used
 * because a future refactor is intended to combine car rental, bike rental
 * and micromobility rental all within this component. The future refactor is
 * assuming that the leg.rentedCar and leg.rentedBike response elements from OTP
 * will eventually be merged into the leg.rentedVehicle element.
 */
export default function RentedVehicleSubheader({
  config,
  leg
}: Props): ReactElement {
  const configCompanies = config.companies || [];
  const { from, mode, rentedBike, walkingBike } = leg;
  const { name: legName, networks, rentalVehicle } = from;
  const modeType = rentalVehicle?.vehicleType?.formFactor;

  // Sometimes rented vehicles can be walked over things like stairs or other
  // ways that forbid the main mode of travel.
  if (mode === "WALK" || walkingBike) {
    return (
      <S.PlaceSubheader>
        <FormattedMessage
          defaultMessage={
            defaultMessages[
              "otpUi.AccessLegBody.RentedVehicleSubheader.walkVehicle"
            ]
          }
          description="Instructs to walk with a bike or scooter along a place."
          id="otpUi.AccessLegBody.RentedVehicleSubheader.walkVehicle"
          values={{
            place: legName
          }}
        />
      </S.PlaceSubheader>
    );
  }

  let rentalDescription;
  // The networks attribute of the from data will only appear at the very
  // beginning of the rental. It is possible that there will be some forced
  // walking that occurs in the middle of the rental, so once the main mode
  // resumes there won't be any network info. In that case we simply return
  // that the rental is continuing.
  if (networks || rentedBike || rentalVehicle) {
    // Add company and vehicle labels.
    const company = coreUtils.itinerary.getCompaniesLabelFromNetworks(
      networks || rentalVehicle?.rentalNetwork?.networkId || [],
      configCompanies
    );
    // Only show vehicle name for car rentals. For bikes and E-scooters, these
    // IDs/names tend to be less relevant (or entirely useless) in this context.
    const vehicleName = leg.rentedCar && legName ? legName : "";

    rentalDescription = (
      <FormattedMessage
        defaultMessage={
          defaultMessages[
            "otpUi.AccessLegBody.RentedVehicleSubheader.pickupRental"
          ]
        }
        description="Instructs to pick up a rental vehicle"
        id="otpUi.AccessLegBody.RentedVehicleSubheader.pickupRental"
        values={{
          company,
          vehicleName,
          vehicleType: <VehicleType type={modeType} />
        }}
      />
    );
  } else {
    rentalDescription = (
      <FormattedMessage
        defaultMessage={
          defaultMessages[
            "otpUi.AccessLegBody.RentedVehicleSubheader.resumeRentalRide"
          ]
        }
        description="Instructs to continue riding with a rental vehicle"
        id="otpUi.AccessLegBody.RentedVehicleSubheader.resumeRentalRide"
      />
    );
  }
  return <S.PlaceSubheader>{rentalDescription}</S.PlaceSubheader>;
}
