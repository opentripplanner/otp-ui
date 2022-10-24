import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

enum Direction {
  east = "EAST",
  north = "NORTH",
  northeast = "NORTHEAST",
  northwest = "NORTHWEST",
  south = "SOUTH",
  southeast = "SOUTHEAST",
  southwest = "SOUTHWEST",
  west = "WEST"
}

interface Props {
  direction: Direction;
}

/**
 * Displays text for a compass direction.
 */
export default function CompassDirection({ direction }: Props): ReactElement {
  // Note that we don't make use of dynamic message ids,
  // so that formatjs CLI tools can pick the strings up for analysis.
  switch (direction) {
    case Direction.east:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction east"
          id="otpUi.AccessLegBody.compass.east"
        />
      );
    case Direction.north:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction north"
          id="otpUi.AccessLegBody.compass.north"
        />
      );
    case Direction.northeast:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction northeast"
          id="otpUi.AccessLegBody.compass.northeast"
        />
      );
    case Direction.northwest:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction northwest"
          id="otpUi.AccessLegBody.compass.northwest"
        />
      );
    case Direction.south:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction south"
          id="otpUi.AccessLegBody.compass.south"
        />
      );
    case Direction.southeast:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction southeast"
          id="otpUi.AccessLegBody.compass.southeast"
        />
      );
    case Direction.southwest:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction southwest"
          id="otpUi.AccessLegBody.compass.southwest"
        />
      );
    case Direction.west:
      return (
        <FormattedMessage
          defaultMessage={direction}
          description="Compass direction west"
          id="otpUi.AccessLegBody.compass.west"
        />
      );
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}
