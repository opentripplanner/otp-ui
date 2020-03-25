import { configType, legType } from "@opentripplanner/core-utils/lib/types";
import {
  getCompaniesLabelFromNetworks,
  getModeForPlace
} from "@opentripplanner/core-utils/lib/itinerary";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

/**
 * A component to display vehicle rental data. The word "Vehicle" has been used
 * because a future refactor is intended to combine car rental, bike rental
 * and micromobility rental all within this component. The future refactor is
 * assuming that the leg.rentedCar and leg.rentedBike response elements from OTP
 * will eventually be merged into the leg.rentedVehicle element.
 */
export default function RentedVehicleSubheader({
  config,
  leg,
  LegIcon,
  showLegIcon
}) {
  const configCompanies = config.companies || [];

  // Sometimes rented vehicles can be walked over things like stairs or other
  // ways that forbid the main mode of travel.
  if (leg.mode === "WALK") {
    return (
      <Styled.PlaceSubheader>
        {showLegIcon && <LegIcon leg={leg} />}
        <span>Walk vehicle along {leg.from.name}</span>
      </Styled.PlaceSubheader>
    );
  }

  let rentalDescription = "Pick up";
  if (leg.rentedBike) {
    // TODO: Special case for TriMet may need to be refactored.
    rentalDescription += ` shared bike`;
  } else {
    // Add company and vehicle labels.
    let vehicleName = "";
    // TODO allow more flexibility in customizing these mode strings
    let modeString = leg.rentedVehicle
      ? "E-scooter"
      : leg.rentedBike
      ? "bike"
      : "car";

    // The networks attribute of the from data will only appear at the very
    // beginning of the rental. It is possible that there will be some forced
    // walking that occurs in the middle of the rental, so once the main mode
    // resumes there won't be any network info. In that case we simply return
    // that the rental is continuing.
    if (leg.from.networks) {
      const companiesLabel = getCompaniesLabelFromNetworks(
        leg.from.networks,
        configCompanies
      );
      rentalDescription += ` ${companiesLabel}`;
      // Only show vehicle name for car rentals. For bikes and E-scooters, these
      // IDs/names tend to be less relevant (or entirely useless) in this context.
      if (leg.rentedCar && leg.from.name) {
        vehicleName = leg.from.name;
      }
      modeString = getModeForPlace(leg.from);
    } else {
      rentalDescription = "Continue using rental";
    }

    rentalDescription += ` ${modeString} ${vehicleName}`;
  }
  // e.g., Pick up REACHNOW rented car XYZNDB OR
  //       Pick up SPIN E-scooter
  //       Pick up shared bike
  return (
    <Styled.PlaceSubheader>
      {showLegIcon && <LegIcon leg={leg} />}
      <span>{rentalDescription}</span>
    </Styled.PlaceSubheader>
  );
}

RentedVehicleSubheader.propTypes = {
  config: configType.isRequired,
  leg: legType.isRequired,
  /** A component class used to render the icon for a leg */
  LegIcon: PropTypes.elementType.isRequired,
  /** Whether or not to show the leg icon next to the */
  showLegIcon: PropTypes.bool.isRequired
};
