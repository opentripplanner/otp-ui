import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore FIXME: Create TypeScript types for the icons package.
import * as Icons from "@opentripplanner/icons";

const submodeOptions = [
  {
    id: "BUS",
    title: "Use the bus",
    text: (
      <span>
        <Icons.Bus /> Bus
      </span>
    )
  },
  {
    id: "TRAM",
    selected: true,
    title: "Use the streetcar",
    text: (
      <span>
        <Icons.Streetcar /> Streetcar
      </span>
    )
  },
  {
    id: "UBER",
    selected: true,
    title: "Uber",
    text: (
      <span>
        <Icons.Uber /> Uber
      </span>
    )
  }
];

export default submodeOptions;
