import {
  leafletPathType,
  stopLayerStopType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { Popup, CircleMarker } from "react-leaflet";

export default function DefaultStopMarker({ leafletPath, radius, stopData }) {
  return (
    <CircleMarker
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...leafletPath}
      center={[stopData.lat, stopData.lon]}
      key={stopData.id}
      radius={radius}
    >
      <Popup>
        <div>{stopData.name}</div>
      </Popup>
    </CircleMarker>
  );
}

DefaultStopMarker.propTypes = {
  leafletPath: leafletPathType,
  radius: PropTypes.number,
  stopData: stopLayerStopType.isRequired
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
