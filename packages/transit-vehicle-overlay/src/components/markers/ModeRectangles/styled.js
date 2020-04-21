import styled, { css } from "styled-components";
import { Bus, Rail, BusRect, RailRect } from "./images";
import * as utils from "../../../utils";

const blue = "#28639c";
const defColor = blue;
const defSelected = "#00bfff";

export const tracked = css`
  .rail_blue,
  .bus_blue {
    fill: ${props => props.colorselected || defSelected};
  }
`;

export const normal = css`
  .rail_blue,
  .bus_blue {
    fill: ${props => props.color || defColor};
  }

  background-color: transparent;

  :hover {
    .rail_blue,
    .bus_blue {
      fill: ${props => props.colorselected || defSelected};
    }
  }
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
