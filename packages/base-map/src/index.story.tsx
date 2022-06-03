import React from "react";
import { Popup } from "react-map-gl";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";

import BaseMap, { MarkerWithPopup } from ".";
import AllVehiclesOverlay from "../__mocks__/AllVehicles";
import ContextMenuDemo from "../__mocks__/ContextMenuDemo";

import "maplibre-gl/dist/maplibre-gl.css";

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
  <BaseMap
    center={center}
    onClick={onClick}
    onContextMenu={onContextMenu}
    onViewportChanged={onViewportChanged}
  ></BaseMap>
);

export const zoomed = () => <BaseMap center={center} zoom={17} />;

export const maxZoom = () => <BaseMap center={center} maxZoom={18} zoom={30} />;

export const withCustomBaseLayer = () => {
  const maptilerToken = text("Your MapTiler token", "my_token");

  return (
    <BaseMap
      baseLayer={`https://api.maptiler.com/maps/voyager/style.json?key=${maptilerToken}`}
      center={center}
    />
  );
};

export const withSampleMarkers = () => (
  <BaseMap center={center}>{sampleMarkers}</BaseMap>
);

export const overlayWithLargeDataSet = () => (
  <div>
    <div>Do not add Storybook overhead on layers with large dataset...</div>
    <BaseMap center={center}>
      <AllVehiclesOverlay />
    </BaseMap>
  </div>
);

export const customLocationPopupContent = () => (
  <BaseMap center={center}>
    <Popup longitude={center[1]} latitude={center[0]}>
      {samplePopup}
    </Popup>
  </BaseMap>
);
// Custom styling for this story only, not in production
customLocationPopupContent.parameters = a11yOverrideParameters;

export const onContextMenuPopup = () => <ContextMenuDemo />;
