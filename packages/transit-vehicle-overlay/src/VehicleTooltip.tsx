import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { VehicleComponentProps } from "./types";
import defaultMessages from "./utils/default-messages";
import FormattedDurationWithSeconds from "./utils/formatted-duration-with-seconds";

const Title = styled.span`
  font-size: 110%;
  font-weight: bold;
`;

export default function VehicleTooltip({
  vehicle
}: VehicleComponentProps): JSX.Element {
  const { routeShortName, routeType, seconds } = vehicle;

  let name: JSX.Element = <>{routeShortName}</>;
  // This condition avoids processing long route names such as "Portland Streetcar".
  if (routeShortName?.length <= 5) {
    // This produces text such as "MAX Green", "BUS 157",
    // or "Line A" if no routeType is provided.
    name = (
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.routeTitle"]
        }
        description="Formats a route title"
        id="otpUi.TransitVehicleOverlay.routeTitle"
        values={{
          name: routeShortName,
          type: routeType || (
            <FormattedMessage
              defaultMessage={
                defaultMessages["otpUi.TransitVehicleOverlay.transitLine"]
              }
              description="Generic transit line"
              id="otpUi.TransitVehicleOverlay.transitLine"
            />
          )
        }}
      />
    );
  }

  if (!seconds) return name;

  return (
    <FormattedMessage
      defaultMessage={
        defaultMessages["otpUi.TransitVehicleOverlay.defaultTooltip"]
      }
      description="Realtime vehicle info shown in a tooltip"
      id="otpUi.TransitVehicleOverlay.defaultTooltip"
      values={{
        duration: <FormattedDurationWithSeconds seconds={seconds} />,
        route: <Title>{name}</Title>
      }}
    />
  );
}
