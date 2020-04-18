import styled, { css } from "styled-components";
import { Bus, Rail, Rect } from "./images";
import * as utils from "../../../utils";

const white = "#fff";
const black = "#000";
const defColor = black;
const defSelected = "#00bfff";

export const normal = css`
  fill: ${props => props.color || defColor};
  background-color: transparent;
  :hover {
    background-color: ${props => props.colorselected || defSelected};
  }
`;

export const tracked = css`
  fill: ${props => props.colorselected || defSelected};
`;

export const Shape = styled(Rect)`
  ${normal}
`;

export const TrackedShape = styled(Rect)`
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
] = utils.makeModeStyles(normal, tracked, Bus, Rail);
