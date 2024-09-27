import React from "react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import { Station, Stop } from "@opentripplanner/types";
import MapPopupContents from "./index";

export default {
  title: "Map Popup"
};

const STOP = {
  flex: false,
  gtfsId: "9526",
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
  name: "0541",
  networks: ["BIKETOWN"],
  realTimeData: true,
  spacesAvailable: 0,
  x: -122.70486,
  y: 45.525486666666666
};

const FLOATING_CAR = {
  "stroke-width": 1,
  allowDropoff: false,
  allowPickup: true,
  color: "#333",
  id: "car_6861",
  isCarStation: false,
  isFloatingCar: true,
  name: "0541",
  networks: ["MILES"], // https://miles-mobility.com
  realTimeData: true,
  spacesAvailable: 0,
  x: 13.405,
  y: 52.52
};

const getEntityPrefixExample = (entity: Stop | Station) => {
  const DemoIcon = styled.span`
    background-color: blue;
    border-radius: 50px;
    color: white;
    margin-right: 0.5ch;
    padding: 2px;
  `;

  return <DemoIcon>{entity.name?.charAt(0)}</DemoIcon>;
};

export const StopEntity = (): JSX.Element => (
  <MapPopupContents
    entity={STOP}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);
export const StopEntitywithEntityPrefix = (): JSX.Element => (
  <MapPopupContents
    entity={STOP}
    getEntityPrefix={getEntityPrefixExample}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);

export const StopEntityNoHandlers = (): JSX.Element => (
  <MapPopupContents entity={STOP} />
);

export const StationEntity = (): JSX.Element => (
  <MapPopupContents
    entity={STATION}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);

export const FloatingCarEntity = (): JSX.Element => (
  <MapPopupContents entity={FLOATING_CAR} setLocation={action("setLocation")} />
);

export const FloatingVehicleEntity = (): JSX.Element => (
  <MapPopupContents
    entity={FLOATING_VEHICLE}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);
