import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { defaultMessages } from "../util";

interface Props {
  rawStreetName: string;
}

/**
 * Returns the street name, or "Unnamed path/street" in the correct language if applicable.
 */
export default function StreetName({ rawStreetName }: Props): ReactElement {
  switch (rawStreetName) {
    case "road":
      return (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.unnamedRoad"]}
          description="Text for an unnamed road"
          id="otpUi.AccessLegBody.unnamedRoad"
        />
      );
    case "path":
      return (
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.AccessLegBody.unnamedPath"]}
          description="Text for an unnamed path"
          id="otpUi.AccessLegBody.unnamedPath"
        />
      );
    default:
      return <>{rawStreetName}</>;
  }
}
