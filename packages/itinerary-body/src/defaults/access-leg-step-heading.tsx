import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

export enum Heading {
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
  heading: Heading;
}

/**
 * Displays text for a compass direction.
 */
export default function AccessLegStepHeading({ heading }: Props): ReactElement {
  // Note that we don't make use of dynamic message ids,
  // so that formatjs CLI tools can pick the strings up for analysis.
  switch (heading) {
    case Heading.east:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction east"
          id="otpUi.AccessLegBody.stepHeading.east"
        />
      );
    case Heading.north:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction north"
          id="otpUi.AccessLegBody.stepHeading.north"
        />
      );
    case Heading.northeast:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction northeast"
          id="otpUi.AccessLegBody.stepHeading.northeast"
        />
      );
    case Heading.northwest:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction northwest"
          id="otpUi.AccessLegBody.stepHeading.northwest"
        />
      );
    case Heading.south:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction south"
          id="otpUi.AccessLegBody.stepHeading.south"
        />
      );
    case Heading.southeast:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction southeast"
          id="otpUi.AccessLegBody.stepHeading.southeast"
        />
      );
    case Heading.southwest:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction southwest"
          id="otpUi.AccessLegBody.stepHeading.southwest"
        />
      );
    case Heading.west:
      return (
        <FormattedMessage
          defaultMessage={heading}
          description="Compass direction west"
          id="otpUi.AccessLegBody.stepHeading.west"
        />
      );
    default:
      throw new Error(`Invalid heading: ${heading}`);
  }
}
