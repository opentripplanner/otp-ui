import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
// import { action } from "@storybook/addon-actions";
import LocationField from ".";

storiesOf("LocationField", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("LocationField in mobile context", () => <LocationField type="from" />)
  .add("LocationField in desktop context", () => <LocationField type="from" />);
