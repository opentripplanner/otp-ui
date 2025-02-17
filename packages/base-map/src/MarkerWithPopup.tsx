/* eslint-disable react/jsx-props-no-spreading */
import { FocusTrapWrapper } from "@opentripplanner/building-blocks";
import React, { useState } from "react";
import { Marker, PopupProps } from "react-map-gl";
import { LeafletStyleMarker, Popup } from "./styled";

type Props = React.ComponentPropsWithoutRef<React.ElementType> & {
  popupContents?: React.ReactNode;
  popupProps?: PopupProps;
  position: [number, number];
  tooltipContents?: React.ReactNode;
};

/**
 * A MapLibre marker with a connected popup or tooltip
 */
const MarkerWithPopup = ({
  children,
  popupContents,
  popupProps,
  position,
  tooltipContents
}: Props): JSX.Element => {
  const [showPopup, setShowPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Marker
      latitude={position[0]}
      longitude={position[1]}
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
          latitude={position[0]}
          longitude={position[1]}
        >
          {tooltipContents}
        </Popup>
      )}
      {showPopup && popupContents && (
        <Popup
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...popupProps}
          latitude={position[0]}
          longitude={position[1]}
          maxWidth="100%"
          onClose={() => setShowPopup(false)}
        >
          <FocusTrapWrapper
            closePopup={() => setShowPopup(false)}
            id="map-popup"
          >
            {popupContents}
          </FocusTrapWrapper>
        </Popup>
      )}
    </Marker>
  );
};

export default MarkerWithPopup;
