import styled from "styled-components";

export const MapOverlayPopup = styled.div`
  font-size: 12px;
  line-height: 1.5;
  min-width: 250px;
`;

export const PopupRow = styled.p`
  margin-top: 6px;
`;

export const PopupTitle = styled.header`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
`;

type LeafletStyleMarkerProps = {
  color?: string;
  size?: number;
  stroke?: number;
  strokeColor?: string;
};
/**
 * @deprecated this marker was created to make the transition from Leaflet more manageable,
 * but in most cases this marker should not be used -- use a MapLibreGL Circle instead
 *
 * https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#circle
 */
export const LeafletStyleMarker = styled.div<LeafletStyleMarkerProps>`
  background: ${props => props?.color || "#0000ff"}50;
  border-radius: ${props => props?.size || 10}px;
  border: ${props => props?.stroke || 2}px solid
    ${props => props?.strokeColor || `${props?.color}f0` || "#0000fffo"};
  content: "";
  cursor: pointer;
  display: block;
  height: ${props => props?.size || 10}px;
  width: ${props => props?.size || 10}px;
`;

export const LayerSelector = styled.div`
  display: flex;
  justify-content: end;
  margin: 1em;
  position: relative;
  right: 0;
  top: 0;

  .layers-list {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.5em;
    box-shadow: 0px -1px 15px -3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 1em;
    position: absolute;
    right: 0;

    /* There are some situations when using MapLibreGL's \`reuseMap\` where 
  a map re-render can cause the layer selector to be rendered multiple times. 
  This is a bit of a hack, but the most all-encompassing way to ensure that this is
  not a usability issue. */
    &:not(:last-of-type) {
      display: none;
    }

    label {
      display: none;

      input {
        margin-right: 1ch;
      }
    }

    &::after {
      display: block;
      content: "🌐";
      cursor: pointer;
    }

    &:hover,
    &.fake-mobile-hover {
      label {
        display: block;
      }
      &::after {
        display: none;
      }
    }
  }
`;
