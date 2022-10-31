import coreUtils from "@opentripplanner/core-utils";
import { Config, Leg } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as S from "../styled";
import { defaultMessages, getVehicleType } from "../util";

interface Props {
  config: Config;
  leg: Leg;
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
  const intl = useIntl();
  const configCompanies = config.companies || [];
  const { from, mode, rentedBike, walkingBike } = leg;
  const { name: legName, networks, vertexType } = from;
  // in OTP2 scooters are BIKERENTALs, so we need to override this
  const modeType = mode === "SCOOTER" ? "VEHICLERENTAL" : vertexType;

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
  if (networks || rentedBike) {
    // Add company and vehicle labels.
    const company = coreUtils.itinerary.getCompaniesLabelFromNetworks(
      networks || [],
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
          vehicleType: getVehicleType(modeType, intl)
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
