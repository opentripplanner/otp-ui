import { TransitVehicle } from "@opentripplanner/types";
import React from "react";

import { MarkerWithPopup } from "@opentripplanner/base-map";
import { getTransitIcon } from "./TransitIcons";
import VehicleTooltip from "./VehicleTooltip";

type Props = {
  /**
   * The list of vehicles to create stop markers for.
   */
  vehicles?: TransitVehicle[];
  /**
   * A tooltip JSX to render
   */
  TooltipSlot?: JSX.Element;
  /**
   * A hex color in the form `#fffFFF` to highlight all vehicles as
   */
  color?: string;
};

/**
 * An overlay to view a collection of transit vehicles.
 */
const TransitVehicleOverlay = (props: Props): JSX.Element => {
  const { color, TooltipSlot, vehicles } = props;
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
        const Icon = getTransitIcon(vehicle.routeType);

        return (
          <MarkerWithPopup
            key={vehicle.vehicleId}
            position={[vehicle.lat, vehicle.lon]}
            // @ts-expect-error TODO FIX
            tooltipContents={<Tooltip vehicle={vehicle} />}
            // @ts-expect-error the prop override doesn't require all props to be present
            popupProps={{ offset: [-15, 0] }}
          >
            {/* @ts-expect-error We know the icon is set dynamically */}
            <Icon rotate={vehicle.heading} routeColor={color} />
          </MarkerWithPopup>
        );
      })}
    </>
  );
};

export default TransitVehicleOverlay;
