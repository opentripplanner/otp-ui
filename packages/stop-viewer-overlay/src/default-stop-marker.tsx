import {
  MarkerWithPopup,
  Styled as BaseMapStyled
} from "@opentripplanner/base-map";
import { Stop } from "@opentripplanner/types";
import React from "react";

export default function DefaultStopMarker({
  // leafletPath, TODO Re-add the path settings?
  radius = 9,
  stop
}: {
  radius: number;
  stop: Stop;
}): JSX.Element {
  return (
    <MarkerWithPopup
      key={stop.id}
      popupContents={<div>{stop.name}</div>}
      position={[stop.lat, stop.lon]}
    >
      <BaseMapStyled.LeafletStyleMarker
        color="#00FFFF"
        size={radius * 2}
        stroke={radius / 3}
        strokeColor="#333"
      />
    </MarkerWithPopup>
  );
}
