/* Since this is a thin wrapper around a set of icons, 
we want to allow prop spreading */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import BusIcon from "../../common/components/GeneratedIcons/trimet/Bus";
import WalkIcon from "../../common/components/GeneratedIcons/trimet/Walk";
import AerialTramIcon from "../../common/components/GeneratedIcons/trimet/AerialTram";
import BicycleIcon from "../../common/components/GeneratedIcons/trimet/Bicycle";
import CarIcon from "../../common/components/GeneratedIcons/trimet/Car";
import MaxIcon from "../../common/components/GeneratedIcons/trimet/Max";
import StreetcarIcon from "../../common/components/GeneratedIcons/trimet/Streetcar";
import MicromobilityIcon from "../../common/components/GeneratedIcons/trimet/Micromobility";
import FerryIcon from "../../common/components/GeneratedIcons/trimet/Ferry";

const ModeIcon = props => {
  const { mode } = props;
  return {
    bus: <BusIcon {...props} />,
    // TODO: Is there a difference between streetcar and max rail here -- are we using the correct icon?
    tram: <StreetcarIcon {...props} />,
    rail: <MaxIcon {...props} />,
    subway: <MaxIcon {...props} />,
    walk: <WalkIcon {...props} />,
    bicycle: <BicycleIcon {...props} />,
    bicycle_rent: <BicycleIcon {...props} />,
    ferry: <FerryIcon {...props} />,
    gondola: <AerialTramIcon {...props} />,
    car: <CarIcon {...props} />,
    micromobility: <MicromobilityIcon {...props} />,
    micromobility_rent: <MicromobilityIcon {...props} />
  }[mode.toLowerCase()];
};

ModeIcon.propTypes = {
  /** Describes the mode of transportation. This comes directly from the Trip Planner API. */
  mode: PropTypes.string.isRequired
};

export default ModeIcon;
