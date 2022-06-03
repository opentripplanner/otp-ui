import styled from "styled-components";

export const MapOverlayPopup = styled.div`
  font-size: 12px;
  line-height: 1.5;
  min-width: 250px;
`;

export const PopupRow = styled.div`
  margin-top: 6px;
`;

export const PopupTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
`;

type LeafletStyleMarkerProps = {
  color?: string;
  stroke?: number;
  size?: number;
};
export const LeafletStyleMarker = styled.div<LeafletStyleMarkerProps>`
  width: ${props => props?.size || 10}px;
  content: "";
  display: block;
  height: 10px;
  background: ${props => props?.color || "#0000ff"}50;
  border: ${props => props?.stroke || 2}px solid
    ${props => props?.color || "#0000ff"}f0;
  border-radius: ${props => props?.size || 10}px;
  cursor: pointer;
`;
