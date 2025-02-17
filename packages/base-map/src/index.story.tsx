/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import {
  AttributionControl,
  MapProvider,
  NavigationControl,
  ScaleControl,
  useMap
} from "react-map-gl";
import { action } from "@storybook/addon-actions";
import { ComponentStory } from "@storybook/react";

import AllVehiclesOverlay from "../__mocks__/AllVehicles";
import ContextMenuDemo from "../__mocks__/ContextMenuDemo";

import { withMap } from "../../../.storybook/base-map-wrapper";

import BaseMap, { MarkerWithPopup, LayerWrapper, Popup, Styled } from ".";

import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [45.522862, -122.667837];

export default {
  args: { center },
  component: BaseMap,
  title: "BaseMap",
  parameters: { storyshots: { disable: true } }
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
clickAndViewportchangedEvents.decorators = [withMap()];

export const zoomed = Template.bind({});
zoomed.args = {
  center,
  zoom: 17
};
zoomed.decorators = [withMap()];

const SetBoundsButton = () => {
  const { mapWithBounds } = useMap();
  const bbox = [-79, 43, -73, 45];

  return (
    <button
      style={{ position: "relative", zIndex: 1000 }}
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

// This story causes the map to be rendered twice
// This is a storybook bug: https://github.com/storybookjs/storybook/issues/12670
export const clickToSetBounds = (): ComponentStory<typeof BaseMap> => (
  <Styled.StoryMapContainer>
    <MapProvider>
      <SetBoundsButton />
      <BaseMap center={center} id="mapWithBounds" />
    </MapProvider>
  </Styled.StoryMapContainer>
);

export const maxZoom = Template.bind({});
maxZoom.args = {
  maxZoom: 18,
  zoom: 30
};
maxZoom.decorators = [withMap()];

export const withSampleMarkers = () => (
  <Styled.StoryMapContainer>
    <BaseMap center={center}>{sampleMarkers}</BaseMap>{" "}
  </Styled.StoryMapContainer>
);

export const overlayWithLargeDataSet = () => (
  <>
    <div style={{ position: "relative", zIndex: 1000 }}>
      Do not add Storybook overhead on layers with large dataset...
    </div>
    <AllVehiclesOverlay />
  </>
);
overlayWithLargeDataSet.decorators = [withMap()];

export const customLocationPopupContent = () => (
  <Styled.StoryMapContainer>
    <BaseMap center={center}>
      <Popup longitude={center[1]} latitude={center[0]}>
        {samplePopup}
      </Popup>
    </BaseMap>
  </Styled.StoryMapContainer>
);

export const optionalLayers = {
  args: { showEverything: false },
  // eslint-disable-next-line react/display-name
  render: (props: any): JSX.Element => (
    <Styled.StoryMapContainer>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <BaseMap {...props}>
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
    </Styled.StoryMapContainer>
  )
};
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
withOptionalControls.decorators = [withMap()];

export const withMultipleBaseLayers = () => {
  const [mapTilerKey, setMapTilerKey] = useState("");
  return (
    <Styled.StoryMapContainer>
      <input
        onChange={e => setMapTilerKey(e.target.value)}
        placeholder="MapTiler API Key"
        type="text"
        value={mapTilerKey}
      />
      {mapTilerKey && (
        <BaseMap
          baseLayer={[
            `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`,
            `https://api.maptiler.com/maps/ocean/style.json?key=${mapTilerKey}`,
            `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`
          ]}
          baseLayerNames={["Streets", "Ocean", "Hybrid"]}
          center={center}
        />
      )}
    </Styled.StoryMapContainer>
  );
};

export const withMultipleBaseLayersAndOptionalLayers = () => {
  const [mapTilerKey, setMapTilerKey] = useState("");
  return (
    <Styled.StoryMapContainer>
      <input
        onChange={e => setMapTilerKey(e.target.value)}
        placeholder="MapTiler API Key"
        type="text"
        value={mapTilerKey}
      />
      {mapTilerKey && (
        <BaseMap
          baseLayer={[
            `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`,
            `https://api.maptiler.com/maps/ocean/style.json?key=${mapTilerKey}`,
            `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`
          ]}
          baseLayerNames={["Streets", "Ocean", "Hybrid"]}
          center={center}
        >
          <AllVehiclesOverlay id="layer-1" />
          <LayerWrapper id="layer-2">
            <MarkerWithPopup position={[center[0], center[1]]} />
          </LayerWrapper>
        </BaseMap>
      )}
    </Styled.StoryMapContainer>
  );
};
