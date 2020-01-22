import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import EndpointsOverlay from ".";

import "@opentripplanner/base-map/assets/map.css";

// BaseMap props
const center = [45.5215, -122.686202];
const zoom = 16;

// EndpointsOverlay props
const clearLocation = action("clearLocation");
const forgetPlace = action("forgetPlace");
const fromLocation = {
  lat: 45.522497,
  lon: -122.676029,
  name: "Portland City Grill",
  type: "work"
};
const rememberPlace = action("rememberPlace");
const setLocation = action("setLocation");
const toLocation = {
  lat: 45.521049,
  lon: -122.693724,
  name: "Portland Towers",
  type: "home"
};
const locations = [fromLocation, toLocation];

storiesOf("EndpointsOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("EndpointsOverlay", () => (
    <BaseMap center={center} zoom={zoom}>
      <EndpointsOverlay
        fromLocation={fromLocation}
        setLocation={setLocation}
        toLocation={toLocation}
        visible
      />
    </BaseMap>
  ))
  .add("EndpointsOverlay with user settings", () => (
    <BaseMap center={center} zoom={zoom}>
      <EndpointsOverlay
        clearLocation={clearLocation}
        forgetPlace={forgetPlace}
        fromLocation={fromLocation}
        locations={locations}
        rememberPlace={rememberPlace}
        setLocation={setLocation}
        showUserSettings
        toLocation={toLocation}
        visible
      />
    </BaseMap>
  ));
