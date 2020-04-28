import { legType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import Biketown from "./companies/biketown-icon";
import Bird from "./companies/bird-icon";
// import Bolt from "./companies/bolt-icon";
// import Car2go from "./companies/car2go-icon";
import Gruv from "./companies/gruv-icon";
import Lime from "./companies/lime-icon";
// import Lyft from "./companies/lyft-icon";
import Razor from "./companies/razor-icon";
import Shared from "./companies/shared-icon";
import Spin from "./companies/spin-icon";
import Uber from "./companies/uber-icon";

const companyLookup = {
  biketown: Biketown,
  bird: Bird,
  // bolt: Bolt,
  // car2go: Car2go,
  gruv: Gruv,
  lime: Lime,
  // lyft: Lyft,
  razor: Razor,
  shared: Shared,
  spin: Spin,
  uber: Uber
};

function getCompanyIcon(name) {
  return companyLookup[name.toLowerCase()];
}

const LegIconCore = ({ leg, ModeIcon, ...props }) => {
  let iconStr = leg.mode;
  if (iconStr === "CAR" && leg.rentedCar) {
    iconStr = leg.from.networks[0];
  } else if (iconStr === "CAR" && leg.tncData) {
    iconStr = leg.tncData.company;
  } else if (iconStr === "BICYCLE" && leg.rentedBike && leg.from.networks) {
    iconStr = leg.from.networks[0];
  } else if (
    iconStr === "MICROMOBILITY" &&
    leg.rentedVehicle &&
    leg.from.networks
  ) {
    iconStr = leg.from.networks[0];
  }

  // this if / else if block is specific to TriMet
  if (leg.routeLongName && leg.routeLongName.startsWith("Portland Streetcar")) {
    iconStr = "STREETCAR";
  } else if (leg.rentedBike) {
    if (leg.from.networks && leg.from.networks[0] === "GBFS") {
      iconStr = "BIKETOWN";
    } else {
      iconStr = "BICYCLE";
    }
  }

  // try to see if the iconStr has a matching company icon. If so, return that.
  const CompanyIcon = getCompanyIcon(iconStr);
  if (CompanyIcon) return <CompanyIcon {...props} />;

  // Do this for P&R, K&R and TNC trips without company icon
  if (iconStr && iconStr.startsWith("CAR")) iconStr = "CAR";

  return <ModeIcon label={iconStr} {...props} />;
};

LegIconCore.propTypes = {
  leg: legType.isRequired,
  ModeIcon: PropTypes.elementType.isRequired
};

export default LegIconCore;
