import { MarkerWithPopup } from "@opentripplanner/base-map";
import { TransitVehicle } from "@opentripplanner/types";
import React, { FC, ReactNode } from "react";

import withCaret from "./WithCaret";
import {
  Circle,
  getStyledContainer,
  RotatingCircle,
  withRouteColorBackground
} from "./styled";
import { VehicleComponentProps } from "./types";
import DefaultVehicleIcon, {
  ModeIconProps,
  RouteNumberIcon,
  VehicleIconProps
} from "./VehicleIcon";
import VehicleTooltip from "./VehicleTooltip";

type Props = {
  /**
   * Default mode to assume if not provided in the vehicle data. Defaults to "bus".
   */
  defaultMode?: string;

  /**
   * Containing component in which route icons/numbers are rendered.
   * Can optionally support a vehicle prop.
   */
  IconContainer?: FC;

  /**
   * Sets the padding between component and icon in IconContainer instances that support it.
   */
  iconPadding?: number;

  /**
   * Sets the size in pixels of the icon in IconContainer instances that support it.
   */
  iconPixels?: number;

  /**
   * This number of seconds is used to determine the cutoff for ignoring a realtime vehicle
   * update. This is helpful to remove vehicles that have stopped broadcasting their location
   * from the map.
   */
  maxVehicleAge: number;

  /**
   * Component that renders the icons given transit modes.
   */
  ModeIcon: FC<ModeIconProps>;

  /**
   * A tooltip JSX to render
   */
  TooltipSlot?: FC<VehicleComponentProps>;

  /**
   * Component that renders the icons or other content such as route number for each transit vehicle.
   */
  VehicleIcon?: FC<VehicleIconProps>;

  /**
   * The list of vehicles to create stop markers for.
   */
  vehicles?: TransitVehicle[];
};

const DefaultIconContainer = withCaret(Circle, { offset: 3.75 });

/**
 * An overlay to view a collection of transit vehicles.
 */
const TransitVehicleOverlay = ({
  defaultMode = "bus",
  IconContainer = DefaultIconContainer,
  iconPadding = 2,
  iconPixels = 20,
  maxVehicleAge = Infinity,
  ModeIcon,
  TooltipSlot = VehicleTooltip,
  VehicleIcon = DefaultVehicleIcon,
  vehicles
}: Props): ReactNode => {
  const dateSeconds = Date.now() / 1000;
  const validVehicles = vehicles?.filter(
    vehicle =>
      !!vehicle?.lat &&
      !!vehicle?.lon &&
      dateSeconds - (vehicle?.lastUpdated || dateSeconds) < maxVehicleAge
  );
  // Don't render if no map or no vehicles are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (!validVehicles || validVehicles.length === 0) {
    return null;
  }

  const StyledContainer = getStyledContainer(
    IconContainer,
    iconPadding,
    iconPixels
  );

  return validVehicles?.map(vehicle => (
    <MarkerWithPopup
      key={vehicle.vehicleId}
      // @ts-expect-error the prop override doesn't require all props to be present
      popupProps={{ offset: [-iconPixels / 2 - iconPadding, 0] }}
      position={[vehicle.lat, vehicle.lon]}
      tooltipContents={
        (vehicle.routeShortName || vehicle.routeLongName) && (
          <TooltipSlot vehicle={vehicle} />
        )
      }
    >
      <StyledContainer vehicle={vehicle}>
        <VehicleIcon
          defaultMode={defaultMode}
          ModeIcon={ModeIcon}
          vehicle={vehicle}
        />
      </StyledContainer>
    </MarkerWithPopup>
  ));
};

export default TransitVehicleOverlay;

// Export the other subcomponents.
export {
  Circle,
  DefaultIconContainer,
  DefaultVehicleIcon,
  RotatingCircle,
  RouteNumberIcon,
  withCaret,
  withRouteColorBackground
};
