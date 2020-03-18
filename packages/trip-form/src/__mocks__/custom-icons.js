import React from "react";
import * as Icons from "@opentripplanner/icons";

/**
 * The custom icons you pass to the SettingsSelectorPanel icons prop
 * is a custom map between standard OTP mode IDs and icons you wish to use for these IDs.
 * This map doesn't have to be complete, and, for missing modes,
 * an icon from OTP-UI icons package will be used when necessary.
 */
const customIcons = {
  TRANSIT: <Icons.Ferry />,
  RAIL: <Icons.Max />,
  TRAM: <Icons.AerialTram />,
  BUS: <Icons.Car />,
  BICYCLE: <Icons.Accessible />
};

export default customIcons;
