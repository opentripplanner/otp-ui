import styled, { keyframes } from "styled-components";

const styleMap = {
  color: props => props.inputColor || "#62bd19",
  size: props => props.size || "25px"
};

const pulsate = keyframes`
    0% {transform: scale(0.1, 0.1); opacity: 0.0;}
    50% {opacity: 1.0;}
    70% {transform: scale(1.8, 1.8); opacity: 0.0;}
`;

const PulseDot = styled.span`
  position: relative;
`;

const PulseCircle = styled.span`
  border: 3px solid ${styleMap.color};
  width: ${styleMap.size};
  height: ${styleMap.size};
  background-color: ${styleMap.color};
  border-radius: 50%;
  position: absolute;
  top: ${styleMap.size};
  left: ${styleMap.size};
`;

const PulseRing = styled.span`
  border: 3px solid ${styleMap.color};
  width: ${styleMap.size};
  height: ${styleMap.size};
  border-color: ${styleMap.color};
  border-radius: 50%;
  position: absolute;
  top: ${styleMap.size};
  left: ${styleMap.size};
  animation: ${pulsate} 1.5s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
`;

export { PulseDot, PulseCircle, PulseRing };
