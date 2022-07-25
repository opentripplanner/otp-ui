/* eslint-disable react/button-has-type */
import React from "react";
import {
  AttributionControl,
  MapProvider,
  NavigationControl,
  Popup,
  ScaleControl,
  useMap
} from "react-map-gl";
import { action } from "@storybook/addon-actions";
import { ComponentStory } from "@storybook/react";

import AllVehiclesOverlay from "../__mocks__/AllVehicles";
import ContextMenuDemo from "../__mocks__/ContextMenuDemo";

import { StoryMapContainer } from "./styled";
import BaseMap, { MarkerWithPopup, LayerWrapper } from ".";

import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [45.522862, -122.667837];

const mapDecorator = (
  Story: ComponentStory<typeof EndpointsOverlay>
): ReactElement => (
  <StoryMapContainer>
    {/* For some reason, <Story /> does not work with snapshots,
        so use the function syntax instead. */}
    {Story()}
  </StoryMapContainer>
);

export default {
  args: { center },
  component: BaseMap,
  decorators: [mapDecorator],
  title: "BaseMap"
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = args => <BaseMap {...args} />;

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

export const clickAndViewportchangedEvents = Template.bind({});
clickAndViewportchangedEvents.args = {
  center,
  onClick,
  onContextMenu,
  onViewportChanged
};

export const zoomed = Template.bind({});
zoomed.args = {
  center,
  zoom: 17
};

const SetBoundsButton = () => {
  const { mapWithBounds } = useMap();
  const bbox = [-79, 43, -73, 45];

  return (
    <button
      onClick={
        () =>
          mapWithBounds?.fitBounds(bbox, {
            duration: 300,
            padding: {
              bottom: 25,
              left: 15,
              right: 5,
              top: 10
            }
          })
        // eslint-disable-next-line react/jsx-curly-newline
      }
    >
      Set the bounds
    </button>
  );
};

export const clickToSetBounds = (): ComponentStory<BaseMap> => (
  <MapProvider>
    <SetBoundsButton />
    <BaseMap center={center} id="mapWithBounds" />
  </MapProvider>
);

export const maxZoom = Template.bind({});
maxZoom.args = {
  maxZoom: 18,
  zoom: 30
};

export const withCustomBaseLayer = Template.bind({});

withCustomBaseLayer.args = {
  baseLayer: `https://api.maptiler.com/maps/voyager/style.json?key=<PASTE YOUR MAPTILER TOKEN HERE>`,
  center
};

export const withSampleMarkers = () => (
  <BaseMap center={center}>{sampleMarkers}</BaseMap>
);

export const overlayWithLargeDataSet = () => (
  <>
    <div>Do not add Storybook overhead on layers with large dataset...</div>
    <BaseMap center={center}>
      <AllVehiclesOverlay />
    </BaseMap>
  </>
);

export const customLocationPopupContent = () => (
  <BaseMap center={center}>
    <Popup longitude={center[1]} latitude={center[0]}>
      {samplePopup}
    </Popup>
  </BaseMap>
);
export const optionalLayers = () => (
  <BaseMap center={center}>
    <LayerWrapper
      id="layer-1"
      name="This layer has a name prop, the second one doesn't"
      visible
    >
      <MarkerWithPopup position={[center[0], center[1]]} />
      <MarkerWithPopup position={[center[0] + 0.01, center[1]]} />
    </LayerWrapper>
    <AllVehiclesOverlay id="layer-2" />
  </BaseMap>
);
// Custom styling for this story only, not in production
customLocationPopupContent.parameters = a11yOverrideParameters;

export const onContextMenuPopup = () => <ContextMenuDemo />;

/**
 * See https://visgl.github.io/react-map-gl/docs/api-reference/attribution-control
 * See https://visgl.github.io/react-map-gl/docs/api-reference/navigation-control
 * See https://visgl.github.io/react-map-gl/docs/api-reference/scale-control
 *
 * Any control which is added as a child of a react-map-gl map is supported
 */
export const withOptionalControls = () => (
  <BaseMap
    center={center}
    // We supply our own AttributionControl, so disable the default one
    // See https://visgl.github.io/react-map-gl/docs/api-reference/attribution-control
    mapLibreProps={{ attributionControl: false }}
  >
    <AttributionControl customAttribution="This adds to the attribution information supplied by the map style json" />
    <NavigationControl position="bottom-right" />
    <ScaleControl />
  </BaseMap>
);
