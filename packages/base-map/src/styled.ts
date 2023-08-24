import { Popup as MapGlPopup } from "react-map-gl";
import styled from "styled-components";

/**
 * Adds a box shadow and tweaks border radius to make popups easier to read.
 */
export const Popup = styled(MapGlPopup)`
  & > .maplibregl-popup-content,
  & > .mapboxgl-popup-content {
    border-radius: 10px;
    box-shadow: 0 3px 14px 4px rgb(0 0 0 / 20%);
  }
`;

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

export const LayerSelector = styled.aside`
  display: flex;
  justify-content: end;
  margin: 10px;
  position: relative;
  right: 0;
  top: 0;

  /* 
  There are some situations when using MapLibreGL's \`reuseMap\` where 
  a map re-render can cause the layer selector to be rendered multiple times. 
  This is a bit of a hack, but the most all-encompassing way to ensure that this is
  not a usability issue.

  This hack *only* works if the LayerSelector is *not* a \`div\`. I'm not sure why...
  */
  &:not(:last-of-type) {
    display: none;
  }

  .layers-list {
    background: rgba(255, 255, 255, 0.95);
    list-style-type: none;
    padding: 1em;
    position: absolute;
    right: 0;
    z-index: 1000;

    label {
      display: block;
      height: 0;
      overflow: hidden;
      width: 0;

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
      box-shadow: 0px -1px 15px -3px rgba(0, 0, 0, 0.1);
      label {
        height: unset;
        overflow: unset;
        width: unset;
      }
      li:first-child {
        /* Prevent most accidental toggling of the first selectable layer on touch screens.
           Toggling is still possible if you touch the left-most area of the globe "button". */
        margin-right: 2em;
      }
      &::after {
        display: none;
      }
    }
  }
`;

/**
 * Map container for use with storybook across various packages in this repo.
 */
export const StoryMapContainer = styled.div`
  height: 90vh;
`;
