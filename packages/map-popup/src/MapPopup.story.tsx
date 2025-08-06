import React from "react";
import { action } from "storybook/actions";
import styled from "styled-components";
import { Station, Stop } from "@opentripplanner/types";
import { IntlProvider } from "react-intl";
import { Meta } from "@storybook/react-vite";
import MapPopupContents, { Feed } from "./index";

// HOC to wrap components with IntlProvider
const withIntl = (Story: () => JSX.Element) => (
  <IntlProvider messages={{}} locale="en">
    <Story />
  </IntlProvider>
);

export default {
  title: "Map Popup",
  decorators: [withIntl]
} as Meta;

const STOP_NO_CODE = {
  flex: false,
  gtfsId: "9526",
  id: "9526",
  lat: 45.523009,
  lon: -122.672529,
  name: "W Burnside & SW 2nd"
};

const STOP_WITH_CODE = {
  flex: false,
  code: "9526",
  gtfsId: "9526",
  id: "9526",
  lat: 45.523009,
  lon: -122.672529,
  name: "W Burnside & SW 2nd"
};

const STOP_WITH_FEED_ID = {
  flex: false,
  code: "9526",
  gtfsId: "trimet:9526",
  id: "trimet:9526",
  lat: 45.523009,
  lon: -122.672529,
  name: "W Burnside & SW 2nd"
};

const SAMPLE_FEEDS: Feed[] = [
  {
    feedId: "trimet",
    publisher: {
      name: "TriMet"
    }
  },
  {
    feedId: "c-tran",
    publisher: {
      name: "C-TRAN"
    }
  },
  {
    feedId: "portland-streetcar",
    publisher: {
      name: "Portland Streetcar"
    }
  }
];

const STATION = {
  "stroke-width": 2,
  allowDropoff: true,
  allowPickup: true,
  color: "#f00",
  id: '"hub_1580"',
  isCarStation: false,
  isFloatingBike: false,
  lat: 45.5219604810172,
  lon: -122.6896771788597,
  name: "SW Morrison at 18th",
  network: "BIKETOWN",
  realTimeData: true,
  spacesAvailable: 11,
  vehiclesAvailable: 6
};

const FLOATING_VEHICLE = {
  "stroke-width": 1,
  allowDropoff: false,
  allowPickup: true,
  color: "#f00",
  id: '"bike_6861"',
  isCarStation: false,
  isFloatingBike: true,
  lat: 45.525486666666666,
  lon: -122.70486,
  name: "0541",
  network: "BIKETOWN",
  realTimeData: true,
  spacesAvailable: 0,
  vehiclesAvailable: 1
};

const FLOATING_CAR = {
  "stroke-width": 1,
  allowDropoff: false,
  allowPickup: true,
  color: "#333",
  id: "car_6861",
  isCarStation: false,
  isFloatingCar: true,
  lat: 52.52,
  lon: 13.405,
  name: "0541",
  network: "MILES", // https://miles-mobility.com
  realTimeData: true,
  spacesAvailable: 0
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
    entity={STOP_WITH_CODE}
    feeds={SAMPLE_FEEDS}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);

export const StopEntityWithFeedName = (): JSX.Element => (
  <MapPopupContents
    entity={STOP_WITH_FEED_ID}
    feeds={SAMPLE_FEEDS}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);

export const StopEntityWithEntityPrefix = (): JSX.Element => (
  <MapPopupContents
    entity={STOP_WITH_CODE}
    getEntityPrefix={getEntityPrefixExample}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
);

export const StopEntityNoHandlers = (): JSX.Element => (
  <MapPopupContents entity={STOP_WITH_CODE} />
);

export const StopEntityNoStopCode = (): JSX.Element => (
  <MapPopupContents
    entity={STOP_NO_CODE}
    setLocation={action("setLocation")}
    setViewedStop={action("setViewedStop")}
  />
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
