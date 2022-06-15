/* eslint-disable react/button-has-type */
import React, { useRef } from "react";
import { Popup } from "react-map-gl";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import styled from "styled-components";

import BaseMap, { MarkerWithPopup, LayerWrapper } from ".";
import AllVehiclesOverlay from "../__mocks__/AllVehicles";
import ContextMenuDemo from "../__mocks__/ContextMenuDemo";

import "maplibre-gl/dist/maplibre-gl.css";

export const BaseMapContainer = styled.div`
  height: 100vh;
`;

export default {
  title: "BaseMap",
  component: BaseMap
};

const center: [number, number] = [45.522862, -122.667837];

const samplePopup = (
  <div>
    <h1>Popup Title</h1>
    <p>
      Sample <span style={{ color: "purple" }}>popup</span> content.
    </p>
  </div>
);

const sampleMarkers = (
  <MarkerWithPopup
    tooltipContents={samplePopup}
    position={center}
  ></MarkerWithPopup>
);

const onClick = action("onClick");
const onContextMenu = action("onContextMenu");
const onViewportChanged = action("onViewportChanged");
const a11yOverrideParameters = {
  a11y: { config: { rules: [{ id: "color-contrast", reviewOnFail: true }] } }
};

export const clickAndViewportchangedEvents = () => (
  <BaseMapContainer>
    <BaseMap
      center={center}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onViewportChanged={onViewportChanged}
    ></BaseMap>
  </BaseMapContainer>
);

export const zoomed = () => (
  <BaseMapContainer>
    <BaseMap center={center} zoom={17} />
  </BaseMapContainer>
);
export const clickToSetBounds = () => {
  const ref = useRef();
  const bbox = [
    [-79, 43],
    [-73, 45]
  ];

  return (
    <div>
      <button
        onClick={
          () =>
            // @ts-expect-error we know the ref will be a map
            ref.current.fitBounds(bbox, {
              duration: 300,
              padding: { top: 10, bottom: 25, left: 15, right: 5 }
            })
          // eslint-disable-next-line react/jsx-curly-newline
        }
      >
        Set the bounds
      </button>
      <BaseMapContainer>
        <BaseMap passedRef={ref} center={center} zoom={17} />
      </BaseMapContainer>
    </div>
  );
};

export const maxZoom = () => (
  <BaseMapContainer>
    <BaseMap center={center} maxZoom={18} zoom={30} />
  </BaseMapContainer>
);

export const withCustomBaseLayer = () => {
  const maptilerToken = text("Your MapTiler token", "my_token");

  return (
    <BaseMapContainer>
      <BaseMap
        baseLayer={`https://api.maptiler.com/maps/voyager/style.json?key=${maptilerToken}`}
        center={center}
      />
    </BaseMapContainer>
  );
};

export const withSampleMarkers = () => (
  <BaseMapContainer>
    <BaseMap center={center}>{sampleMarkers}</BaseMap>
  </BaseMapContainer>
);

export const overlayWithLargeDataSet = () => (
  <div>
    <div>Do not add Storybook overhead on layers with large dataset...</div>
    <BaseMapContainer>
      <BaseMap center={center}>
        <AllVehiclesOverlay />
      </BaseMap>
    </BaseMapContainer>
  </div>
);

export const customLocationPopupContent = () => (
  <BaseMapContainer>
    <BaseMap center={center}>
      <Popup longitude={center[1]} latitude={center[0]}>
        {samplePopup}
      </Popup>
    </BaseMap>
  </BaseMapContainer>
);
export const optionalLayers = () => (
  <BaseMapContainer>
    <BaseMap center={center}>
      <LayerWrapper
        visible
        name="This layer has a name prop, the second one doesn't"
        id="layer-1"
      >
        <MarkerWithPopup position={[center[0], center[1]]} />
        <MarkerWithPopup position={[center[0] + 0.01, center[1]]} />
      </LayerWrapper>
      <AllVehiclesOverlay id="layer-2" />
    </BaseMap>
  </BaseMapContainer>
);
// Custom styling for this story only, not in production
customLocationPopupContent.parameters = a11yOverrideParameters;

export const onContextMenuPopup = () => <ContextMenuDemo />;
