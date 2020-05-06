import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";
import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";
import * as utils from "../../../utils";

// note: want to make these props of styled, so props.colorselected
// BTW, 'props.color' works, since that's an established prop of styled
// https://stackoverflow.com/questions/52321539/react-passing-props-with-styled-components
const white = "#fff";
const black = "#000";
const defColor = black;
const defSelected = "#00bfff";

export const normal = css`
  color: ${props => props.color || defColor};
  fill: ${props => props.color || defColor};
  border: 1px solid ${props => props.color || defColor};
  background-color: ${white};
  :hover {
    fill: ${black} !important;
    color: ${props => props.colorselected || defSelected};
    background-color: ${props => props.colorselected || defSelected};
    border: 1px solid ${black};
  }
  border-radius: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const tracked = css`
  fill: ${black} !important;
  color: ${props => props.colorselected || defSelected};
  border: 1px solid ${black};
  background-color: ${props => props.colorselected || defSelected};
`;

export const Shape = styled(Circle)`
  ${normal}
  background-color: ${props => props.color || defColor};
`;

export const TrackedShape = styled(Shape)`
  ${tracked}
`;

export const [
  NormBus,
  TrackedBus,
  NormRail,
  TrackedRail,
  NormTram,
  TrackedTram,
  NormSC,
  TrackedSC,
  NormGond,
  TrackedGond
] = utils.makeModeStyles(normal, tracked, Bus, Wes, Max, Streetcar, AerialTram);
