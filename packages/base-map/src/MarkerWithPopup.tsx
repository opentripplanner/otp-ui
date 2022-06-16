import React, { useState } from "react";
import { Marker, MarkerProps, Popup, PopupProps } from "react-map-gl";
import { LeafletStyleMarker } from "./styled";

type Props = {
  position: [number, number];
  markerProps?: MarkerProps;
  popupProps?: PopupProps;
  children?: React.ReactNode;
  popupContents?: React.ReactNode;
  tooltipContents?: React.ReactNode;
};

/**
 * A MapLibre marker with a connected popup or tooltip
 */
const MarkerWithPopup = ({
  position,
  markerProps,
  popupProps,
  popupContents,
  tooltipContents,
  children
}: Props): JSX.Element => {
  const [showPopup, setShowPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Marker
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...markerProps}
      longitude={position[1]}
      latitude={position[0]}
      onClick={() => setShowPopup(true)}
      style={{ cursor: popupContents ? "pointer" : "inherit" }}
    >
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children || <LeafletStyleMarker />}
      </span>
      {/** TODO: adjust tooltip styling? */}
      {showTooltip && tooltipContents && (
        <Popup
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...popupProps}
          anchor="right"
          closeButton={false}
          closeOnClick={false}
          longitude={position[1]}
          latitude={position[0]}
        >
          {tooltipContents}
        </Popup>
      )}
      {showPopup && popupContents && (
        <Popup
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...popupProps}
          onClose={() => setShowPopup(false)}
          maxWidth="100%"
          longitude={position[1]}
          latitude={position[0]}
        >
          {popupContents}
        </Popup>
      )}
    </Marker>
  );
};

export default MarkerWithPopup;
