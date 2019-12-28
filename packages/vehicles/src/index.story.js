import BaseMap from "@opentripplanner/base-map";
import React, { Component } from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import "@opentripplanner/base-map/assets/map.css";

const center = [45.523092, -122.671202];

class Example extends Component {
  constructor() {
    super();
    this.state = {
      stops: []
    };
  }

  render() {
    return (
      <BaseMap center={center}>
      </BaseMap>
    );
  }
}

storiesOf("Realtime Vehicles", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("by Route", () => <Example />);
