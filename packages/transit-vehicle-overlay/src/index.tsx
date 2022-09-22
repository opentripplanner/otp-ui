import { MarkerWithPopup } from "@opentripplanner/base-map";
import { TransitVehicle } from "@opentripplanner/types";
import React from "react";

import { getTransitIcon } from "./TransitIcons";
import getContrastYIQ from "./utils/get-contrast-color";
import VehicleTooltip from "./VehicleTooltip";

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
   * A tooltip JSX to render
   */
  TooltipSlot?: JSX.Element;

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
  TooltipSlot,
  vehicles
}: Props): JSX.Element => {
  const validVehicles = vehicles?.filter(
    vehicle => !!vehicle?.lat && !!vehicle?.lon
  );
  // Don't render if no map or no vehicles are defined.
  // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
  if (!validVehicles || validVehicles.length === 0) {
    return null;
  }

  const Tooltip = TooltipSlot || VehicleTooltip;

  return (
    <>
      {validVehicles.map(vehicle => {
        const Icon = getTransitIcon(vehicle.routeType, alwaysRenderText);

        return (
          <MarkerWithPopup
            key={vehicle.vehicleId}
            position={[vehicle.lat, vehicle.lon]}
            // @ts-expect-error the prop override doesn't require all props to be present
            popupProps={{ offset: [-15, 0] }}
            tooltipContents={
              // @ts-expect-error TODO FIX
              vehicle.routeShortName && <Tooltip vehicle={vehicle} />
            }
          >
            {/* @ts-expect-error We know the icon is set dynamically */}
            <Icon
              disableHoverEffects={disableHoverEffects}
              // Don't rotate if all the icons are text! It looks weird
              rotate={!alwaysRenderText && vehicle.heading}
              routeColor={vehicle?.routeColor || color}
            >
              {/* If there is no route type, draw the route name, or a generic bullet */}
              <span
                style={{ color: getContrastYIQ(vehicle?.routeColor || color) }}
              >
                {(!vehicle.routeType || alwaysRenderText) &&
                  (vehicle?.routeShortName || "🚌")}
              </span>
            </Icon>
          </MarkerWithPopup>
        );
      })}
    </>
  );
};

export default TransitVehicleOverlay;
