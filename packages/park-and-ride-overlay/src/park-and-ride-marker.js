import { divIcon } from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";

const StyledParkAndRideIcon = styled.div`
  background: #000;
  border-radius: 17px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  height: 12px;
  line-height: 0px;
  padding-left: 7px;
  padding-top: 12px;
  width: 17px;
`;

export default divIcon({
  iconSize: [20, 20],
  popupAnchor: [0, -10],
  html: ReactDOMServer.renderToStaticMarkup(
    <StyledParkAndRideIcon>P</StyledParkAndRideIcon>
  ),
  className: ""
});
