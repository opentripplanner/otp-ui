import BaseMap from "@opentripplanner/base-map";
import React from "react";
import PropTypes from "prop-types";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import Vehicles from './vehicles';

import "@opentripplanner/base-map/assets/map.css";

function Example(props) {
  const { center } = props;
  return <BaseMap center={center}>
    <Vehicles name="Real-Time Buses and Trains" visible />
  </BaseMap>;
}

Example.propTypes = {
  center: PropTypes.arrayOf(PropTypes.float).isRequired
};

storiesOf("Realtime Vehicles", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("by Route", () => <Example center={[45.523, -122.671]} />)
  .add("all Routes", () => <Example center={[45.523092, -122.671202]} />);
