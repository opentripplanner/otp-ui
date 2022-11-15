import { MarkerWithPopup } from "@opentripplanner/base-map";
import { TransitVehicle } from "@opentripplanner/types";
import React from "react";

import { getTransitIcon } from "./TransitIcons";
import VehicleTooltip from "./VehicleTooltip";

type Props = {
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

  // Check if possibleColor is a string in format `#000` or `#000000`
  const isValidColor = possibleColor => {
    if (typeof possibleColor !== "string") {
      return false;
    }

    return /^#[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?$/.test(possibleColor);
  };

  return (
    <>
      {validVehicles.map(vehicle => {
        const Icon = getTransitIcon(vehicle.routeType);

        return (
          <MarkerWithPopup
            key={vehicle.vehicleId}
            position={[vehicle.lat, vehicle.lon]}
            // @ts-expect-error the prop override doesn't require all props to be present
            popupProps={{ offset: [-15, 0] }}
            // @ts-expect-error TODO FIX
            tooltipContents={<Tooltip vehicle={vehicle} />}
          >
            {/* @ts-expect-error We know the icon is set dynamically */}
            <Icon
              highlightColor={
                isValidColor(vehicle.highlightColor)
                  ? vehicle.highlightColor
                  : null
              }
              rotate={vehicle.heading}
              routeColor={
                isValidColor(vehicle.routeColor) ? vehicle.routeColor : color
              }
            />
          </MarkerWithPopup>
        );
      })}
    </>
  );
};

export default TransitVehicleOverlay;
