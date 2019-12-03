import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import LocationIcon from ".";

storiesOf("LocationIcon", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      text: "A simple component used to show the from or to location icon"
    }
  })
  .add("From LocationIcon", () => <LocationIcon type="from" size={25} />)
  .add("To LocationIcon", () => <LocationIcon type="to" size={25} />);
