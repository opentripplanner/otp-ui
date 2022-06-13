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
  strokeColor?: string;
  size?: number;
};
export const LeafletStyleMarker = styled.div<LeafletStyleMarkerProps>`
  width: ${props => props?.size || 10}px;
  content: "";
  display: block;
  height: ${props => props?.size || 10}px;
  background: ${props => props?.color || "#0000ff"}50;
  border: ${props => props?.stroke || 2}px solid
    ${props => props?.strokeColor || `${props?.color}f0` || "#0000fffo"};
  border-radius: ${props => props?.size || 10}px;
  cursor: pointer;
`;

export const LayerSelector = styled.nav`
  position: relative;
  right: 0;
  top: 0;
  margin: 1em;

  display: flex;
  justify-content: end;
  .layers-list {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 1em;
    border-radius: 0.5em;
    box-shadow: 0px -1px 15px -3px rgba(0, 0, 0, 0.1);

    label {
      display: block;
    }
  }
`;
