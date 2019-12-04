/* Since this is a thin wrapper around a set of icons, 
we want to allow prop spreading */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import CircleClockwise from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/CircleClockwise";
import CircleCounterclockwise from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/CircleCounterclockwise";
import Elevator from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/Elevator";
import HardLeft from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/HardLeft";
import HardRight from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/HardRight";
import Left from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/Left";
import Right from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/Right";
import SlightLeft from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/SlightLeft";
import SlightRight from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/SlightRight";
import Straight from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/Straight";
import UTurnLeft from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/UTurnLeft";
import UTurnRight from "~/packages/trip-planner/src/common/components/GeneratedIcons/directions/UTurnRight";

const DirectionIcon = props => {
  const { direction } = props;
  return {
    depart: <Straight {...props} />,
    continue: <Straight {...props} />,
    left: <Left {...props} />,
    right: <Right {...props} />,
    slightlyleft: <SlightLeft {...props} />,
    slightlyright: <SlightRight {...props} />,
    hardleft: <HardLeft {...props} />,
    hardright: <HardRight {...props} />,
    uturnleft: <UTurnLeft {...props} />,
    uturnright: <UTurnRight {...props} />,
    circleclockwise: <CircleClockwise {...props} />,
    circlecounterclockwise: <CircleCounterclockwise {...props} />,
    elevator: <Elevator {...props} />
  }[direction.replace(/_/g, "").toLowerCase()];
};

DirectionIcon.propTypes = {
  /** Describes the direction. This comes directly from the Trip Planner API. */
  direction: PropTypes.string.isRequired
};

export default DirectionIcon;
