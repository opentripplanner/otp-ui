import React from "react";
import { action } from "@storybook/addon-actions";
import MapPopupContents from "./index";

export default {
  title: "Map Popup"
};

const STOP = {
  flex: false,
  id: "9526",
  lat: 45.523009,
  lon: -122.672529,
  name: "W Burnside & SW 2nd"
};

const STATION = {
  "stroke-width": 2,
  allowDropoff: true,
  allowPickup: true,
  bikesAvailable: 6,
  color: "#f00",
  id: '"hub_1580"',
  isCarStation: false,
  isFloatingBike: false,
  name: "SW Morrison at 18th",
  networks: ["BIKETOWN"],
  realTimeData: true,
  spacesAvailable: 11,
  x: -122.6896771788597,
  y: 45.5219604810172
};

const FLOATING_VEHICLE = {
  "stroke-width": 1,
  allowDropoff: false,
  allowPickup: true,
  bikesAvailable: 1,
  color: "#f00",
  id: '"bike_6861"',
  isCarStation: false,
  isFloatingBike: true,
  name: "0541 BIKETOWN",
  networks: ["BIKETOWN"],
  realTimeData: true,
  spacesAvailable: 0,
  x: -122.70486,
  y: 45.525486666666666
};

export const StopEntity = (): JSX.Element => {
  return (
    <MapPopupContents
      entity={STOP}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
    />
  );
};

export const StopEntityNoHandlers = (): JSX.Element => {
  return <MapPopupContents entity={STOP} />;
};

export const StationEntity = (): JSX.Element => {
  return (
    <MapPopupContents
      entity={STATION}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
    />
  );
};

export const FloatingVehicleEntity = (): JSX.Element => {
  return (
    <MapPopupContents
      entity={FLOATING_VEHICLE}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
    />
  );
};
