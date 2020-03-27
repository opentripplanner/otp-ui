import {
  leafletPathType,
  stopLayerStopType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { Popup, CircleMarker } from "react-leaflet";

export default function DefaultStopMarker({ leafletPath, radius, stop }) {
  return (
    <CircleMarker
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...leafletPath}
      center={[stop.lat, stop.lon]}
      key={stop.id}
      radius={radius}
    >
      <Popup>
        <div>{stop.name}</div>
      </Popup>
    </CircleMarker>
  );
}

DefaultStopMarker.propTypes = {
  leafletPath: leafletPathType,
  radius: PropTypes.number,
  stop: stopLayerStopType.isRequired
};

DefaultStopMarker.defaultProps = {
  leafletPath: {
    color: "#000",
    fillColor: "cyan",
    fillOpacity: 1,
    weight: 3
  },
  radius: 9
};
