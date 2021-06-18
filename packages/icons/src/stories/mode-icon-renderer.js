import React from "react";

import IconRenderer from "./icon-renderer";

const exampleModes = [
  "BICYCLE",
  "BICYCLE_RENT",
  "BUS",
  "CAR",
  "CAR_PARK",
  "FERRY",
  "GONDOLA",
  "MICROMOBILITY",
  "MICROMOBILITY_RENT",
  "RAIL",
  "STREETCAR",
  "SUBWAY",
  "TRAM",
  "TRANSIT",
  "WALK",
  "NONE_OF_THE_ABOVE"
];

export default function ModeIconRenderer({ component: Component }) {
  return (
    <IconRenderer
      examples={exampleModes}
      renderComponentFn={example => <Component mode={example} />}
      typeTitle="Mode Type"
    />
  );
}
