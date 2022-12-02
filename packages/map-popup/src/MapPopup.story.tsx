import React from "react";
import { action } from "@storybook/addon-actions";
import MapPopupContents from "./index";

export default {
  title: "Map Popup"
};

const STOP = {
  id: "9526",
  name: "W Burnside & SW 2nd",
  lat: 45.523009,
  lon: -122.672529,
  flex: false
};

const STATION = {
  id: '"hub_1580"',
  name: "SW Morrison at 18th",
  x: -122.6896771788597,
  y: 45.5219604810172,
  allowDropoff: true,
  allowPickup: true,
  networks: ["BIKETOWN"],
  bikesAvailable: 6,
  spacesAvailable: 11,
  isFloatingBike: false,
  isCarStation: false,
  realTimeData: true,
  "stroke-width": 2,
  color: "#f00"
};

const SCOOTER = {
  id: '"bike_6861"',
  name: "0541 BIKETOWN",
  x: -122.70486,
  y: 45.525486666666666,
  allowDropoff: false,
  allowPickup: true,
  networks: ["BIKETOWN"],
  bikesAvailable: 1,
  spacesAvailable: 0,
  isFloatingBike: true,
  isCarStation: false,
  realTimeData: true,
  "stroke-width": 1,
  color: "#f00"
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

export const StationEntity = (): JSX.Element => {
  return (
    <MapPopupContents
      entity={STATION}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
    />
  );
};

export const ScooterEntity = (): JSX.Element => {
  return (
    <MapPopupContents
      entity={SCOOTER}
      setLocation={action("setLocation")}
      setViewedStop={action("setViewedStop")}
    />
  );
};
