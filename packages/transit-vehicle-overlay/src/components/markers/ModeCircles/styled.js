import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";

import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";

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

export const VehicleCircle = styled(Circle)`
  ${normal}
  background-color: ${props => props.color || defColor};
`;

export const TrackedVehicleCircle = styled(VehicleCircle)`
  ${tracked}
`;

export const NormBus = styled(Bus)`
  ${normal}
`;

export const TrackedBus = styled(NormBus)`
  ${tracked}
`;

export const NormTram = styled(Max)`
  ${normal}
`;

export const TrackedTram = styled(NormTram)`
  ${tracked}
`;

export const NormSC = styled(Streetcar)`
  ${normal}
`;

export const TrackedSC = styled(NormSC)`
  ${tracked}
`;

export const NormGond = styled(AerialTram)`
  ${normal}
`;

export const TrackedGond = styled(NormGond)`
  ${tracked}
`;

export const NormRail = styled(Wes)`
  ${normal}
`;

export const TrackedRail = styled(NormRail)`
  ${tracked}
`;
