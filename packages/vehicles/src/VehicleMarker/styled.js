/* eslint-disable no-unused-vars */
/* stylelint-disable property-no-vendor-prefix */
/* stylelint-disable CssSyntaxError */
import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import L from "leaflet";

import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";
import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";

// note: want to make these props of styled, so props.colorSelected
// BTW, 'props.color' works, since that's an established prop of styled
// https://stackoverflow.com/questions/52321539/react-passing-props-with-styled-components
const color = "#000";
const colorSelected = "#00bfff";
const colorHighlight = "#ccee77";

export const VehicleCircle = styled(Circle)`
  color: ${props => props.color || color};
  background-color: ${props => props.color || color};
  border: 1px solid ${props => props.color || color};
  :hover {
    color: ${props => props.colorSelected || colorSelected};
    background-color: ${props => props.colorSelected || colorSelected};
    border: 1px solid ${props => props.colorHighlight || colorHighlight};
  }
  border-radius: 50%;
`;

export const TrackedVehicleCircle = styled(VehicleCircle)`
  color: ${props => props.colorSelected || colorSelected};
  background-color: ${props => props.colorSelected || colorSelected};
`;

// popup button
export const Button = styled.button`
  color: navy;
  border: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
