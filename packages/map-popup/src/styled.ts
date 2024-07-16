import styled from "styled-components";

import { Popup as MapGlPopup } from "react-map-gl";

/* eslint-disable-next-line import/prefer-default-export */
export const ViewStopButton = styled.button`
  background: none;
  border-bottom: none;
  border-left: 1px solid #000;
  border-right: none;
  border-top: none;
  color: #008;
  font-family: inherit;
  margin-left: 5px;
  padding-top: 0;
`;

/**
 * Adds a box shadow and tweaks border radius to make popups easier to read.
 */
export const Popup = styled(MapGlPopup)`
  & > .maplibregl-popup-content,
  & > .mapboxgl-popup-content {
    border-radius: 10px;
    box-shadow: 0 3px 14px 4px rgb(0 0 0 / 20%);
  }
`;

export const MapOverlayPopup = styled.div`
  font-size: 12px;
  line-height: 1.5;
  min-width: 250px;
`;

export const PopupRow = styled.p`
  margin-top: 6px;
`;

export const PopupTitle = styled.header`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
`;
