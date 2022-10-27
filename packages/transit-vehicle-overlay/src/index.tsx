import { MarkerWithPopup } from "@opentripplanner/base-map";
import { TransitVehicle } from "@opentripplanner/types";
import React, { FC, ReactNode } from "react";
import CircleWithCaret from "./CircleWithCaret";
import {
  IconContainerProps,
  RotatingCircle,
  withRouteColorBackground,
  withRouteColorBackgroundOnHover
} from "./TransitIcons";
import DefaultVehicleIcon, { VehicleIconProps } from "./VehicleIcon";
import RouteNumberIcon from "./RouteNumberIcon";

import VehicleTooltip, { VehicleTooltipProps } from "./VehicleTooltip";

type Props = {
  /**
   * Whether to always use the fallback route name renderer instead of using
   * a mode icon.
   */
  alwaysRenderText?: boolean;

  /**
   * Whether or not to render all icons in the "ambient" style (no hover effects, color
   * always visible)
   */
  disableHoverEffects?: boolean;

  /**
   * A hex color in the form `#fffFFF` to highlight all vehicles as
   */
  color?: string;

  /**
   * Default mode to assume if not provided in the vehicle data. Defaults to "bus".
   */
  defaultMode?: string;

  /**
   * Containing component in which route icons/numbers are rendered.
   */
  IconContainer?: FC<IconContainerProps>;

  /**
   * Sets the padding between component and icon in IconContainer instances that support it.
   */
  iconPadding?: number;

  /**
   * Sets the size in pixels of the icon in IconContainer instances that support it.
   */
  iconPixels?: number;

  /**
   * Component that renders the icons given transit modes.
   */
  ModeIcon?: FC;

  /**
   * A tooltip JSX to render
   */
  TooltipSlot?: FC<VehicleTooltipProps>;

  /**
   * Component that renders the icons for each transit vehicle.
   */
  VehicleIcon?: FC<VehicleIconProps>;

  /**
   * The list of vehicles to create stop markers for.
   */
  vehicles?: TransitVehicle[];
};

/**
 * An overlay to view a collection of transit vehicles.
 */
const TransitVehicleOverlay = ({
  alwaysRenderText,
  disableHoverEffects,
  color,
  defaultMode = "bus",
  IconContainer = CircleWithCaret,
  iconPadding = 5,
  iconPixels = 15,
  ModeIcon,
  TooltipSlot = VehicleTooltip,
  VehicleIcon = DefaultVehicleIcon,
  vehicles
}: Props): ReactNode => {
  const validVehicles = vehicles?.filter(
    vehicle => !!vehicle?.lat && !!vehicle?.lon
  );
  // Don't render if no map or no vehicles are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (!validVehicles || validVehicles.length === 0) {
    return null;
  }

  console.log(alwaysRenderText, disableHoverEffects, color);

  return validVehicles?.map(vehicle => (
    <MarkerWithPopup
      key={vehicle.vehicleId}
      // @ts-expect-error the prop override doesn't require all props to be present
      popupProps={{ offset: [-iconPixels / 2 - iconPadding, 0] }}
      position={[vehicle.lat, vehicle.lon]}
      tooltipContents={
        vehicle.routeShortName && <TooltipSlot vehicle={vehicle} />
      }
    >
      <IconContainer
        padding={iconPadding}
        pixels={iconPixels}
        vehicle={vehicle}
      >
        <VehicleIcon
          defaultMode={defaultMode}
          ModeIcon={ModeIcon}
          vehicle={vehicle}
        />
      </IconContainer>
    </MarkerWithPopup>
  ));
};

export default TransitVehicleOverlay;

// Export the other subcomponents
export {
  CircleWithCaret,
  DefaultVehicleIcon,
  RotatingCircle,
  RouteNumberIcon,
  withRouteColorBackground,
  withRouteColorBackgroundOnHover
};
