import React from "react";

import CircleClockwise from "./CircleClockwise";
import CircleCounterclockwise from "./CircleCounterclockwise";
import Elevator from "./Elevator";
import HardLeft from "./HardLeft";
import HardRight from "./HardRight";
import Left from "./Left";
import Right from "./Right";
import SlightLeft from "./SlightLeft";
import SlightRight from "./SlightRight";
import Straight from "./Straight";
import UTurnLeft from "./UTurnLeft";
import UTurnRight from "./UTurnRight";

/**
 * Renders the appropriate direction icon given the OTP relative turn direction
 */
function DirectionIcon({ relativeDirection }) {
  if (!relativeDirection) return null;
  switch (relativeDirection.toUpperCase()) {
    case "DEPART":
    case "CONTINUE":
      return <Straight />;
    case "LEFT":
      return <Left />;
    case "RIGHT":
      return <Right />;
    case "SLIGHTLY_LEFT":
      return <SlightLeft />;
    case "SLIGHTLY_RIGHT":
      return <SlightRight />;
    case "HARD_LEFT":
      return <HardLeft />;
    case "HARD_RIGHT":
      return <HardRight />;
    case "UTURN_LEFT":
      return <UTurnLeft />;
    case "UTURN_RIGHT":
      return <UTurnRight />;
    case "CIRCLE_CLOCKWISE":
      return <CircleClockwise />;
    case "CIRCLE_COUNTERCLOCKWISE":
      return <CircleCounterclockwise />;
    case "ELEVATOR":
      return <Elevator />;
    default:
      return null;
  }
}

export {
  CircleClockwise,
  CircleCounterclockwise,
  DirectionIcon,
  Elevator,
  HardLeft,
  HardRight,
  Left,
  Right,
  SlightLeft,
  SlightRight,
  Straight,
  UTurnLeft,
  UTurnRight
};
