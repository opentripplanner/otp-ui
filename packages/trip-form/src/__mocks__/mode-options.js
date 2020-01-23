import React from "react";
import * as Icons from "@opentripplanner/icons";

const modeOptions = {
  primary: {
    id: "PRIMARY",
    title: "Primary Choice",
    text: (
      <span>
        <Icons.Max />
        <Icons.Bus /> Primary Choice
      </span>
    )
  },
  secondary: [
    {
      id: "SECONDARY1",
      title: "Secondary 1",
      text: (
        <span>
          <Icons.Bike /> Sec. #1
        </span>
      )
    },
    {
      id: "SECONDARY2",
      title: "Secondary 2",
      selected: true,
      showTitle: false,
      text: (
        <span>
          Sec. #2 <Icons.Micromobility />
        </span>
      )
    }
  ],
  tertiary: [
    {
      id: "OTHER",
      title: "Other Mode",
      text: <span>Tertiary Mode</span>
    }
  ]
};

export default modeOptions;
