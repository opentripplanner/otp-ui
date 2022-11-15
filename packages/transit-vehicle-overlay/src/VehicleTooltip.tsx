import { TransitVehicle } from "@opentripplanner/types";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import defaultMessages from "./utils/default-messages";
import FormattedDurationWithSeconds from "./utils/formatted-duration-with-seconds";

const Title = styled.span`
  font-size: 110%;
  font-weight: bold;
  &::after {
    content: "";
    margin: 0 0.125em;
  }
`;

type Props = {
  vehicle: TransitVehicle;
};

export default function VehicleTooltip({ vehicle }: Props): JSX.Element {
  const { routeShortName, routeType, seconds } = vehicle;

  let name: JSX.Element = <>{routeShortName}</>;
  // This condition avoids processing long route names such as "Portland Streetcar".
  if (routeShortName?.length <= 5) {
    name = routeType ? (
      // This produces text such as "MAX Green", so don't localize.
      <>
        {routeType} {routeShortName}
      </>
    ) : (
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.genericRouteFormat"]
        }
        description="Formats a route label"
        id="otpUi.TransitVehicleOverlay.genericRouteFormat"
        values={{
          route: routeShortName
        }}
      />
    );
  }

  if (!seconds) return name;

  return (
    <>
      <Title>
        <FormattedMessage
          defaultMessage={
            defaultMessages["otpUi.TransitVehicleOverlay.tooltipRouteLabel"]
          }
          description="Displays a route label in a tooltip"
          id="otpUi.TransitVehicleOverlay.tooltipRouteLabel"
          values={{
            routeLabel: name
          }}
        />
      </Title>
      <FormattedMessage
        defaultMessage={
          defaultMessages["otpUi.TransitVehicleOverlay.durationAgo"]
        }
        description="Text describing a past duration"
        id="otpUi.TransitVehicleOverlay.durationAgo"
        values={{
          duration: <FormattedDurationWithSeconds seconds={seconds} />
        }}
      />
    </>
  );
}
