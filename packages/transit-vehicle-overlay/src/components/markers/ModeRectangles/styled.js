import styled, { css } from "styled-components";
import { Bus, Rail, BusRect, RailRect } from "./images";
import * as utils from "../../../utils";

// const blue = "#08F";
// const defColor = blue;     fill: ${props => props.color || defColor};
const defSelected = "#00bfff";

export const normal = css`
  background-color: transparent;
  :hover {
    background-color: ${props => props.colorselected || defSelected};
  }
`;

export const tracked = css`
  fill: ${props => props.colorselected || defSelected};
`;

export const Shape = styled(BusRect)`
  ${normal}
`;

export const TrackedShape = styled(Shape)`
  ${tracked}
`;

export const LgShape = styled(RailRect)`
  ${normal}
`;

export const LgTrackedShape = styled(LgShape)`
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
