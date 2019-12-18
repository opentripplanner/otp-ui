import React from "react";
import { Marker, CircleMarker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import BaseMap from ".";
import SelectVehicles from "../__mocks__/SelectVehicles";
import AllVehiclesOverlay from "../__mocks__/AllVehicles";

import "../assets/map.css";

export default {
  title: "BaseMap",
  component: BaseMap,
  decorators: [withInfo],
  parameters: {
    info: {
      text: `
      The BaseMap component renders a Leaflet map with overlays and other ad-hoc markers
      that are declared as child elements of the BaseMap element.
      
      Overlays are groups of similar React-Leaflet markers, e.g. vehicle location markers, bus stop markers, etc.
      Overlays are automatically added to the overlay control displayed by the BaseMap. The user uses that control to turn overlays on or off.
      `
    }
  }
};

const twoBaseLayers = [
  {
    name: "Streets",
    url:
      "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
    subdomains: "abcd",
    attribution:
      'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    hasRetinaSupport: true
  },
  {
    name: "Stamen Toner Lite",
    url: "http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }
];

const center = [33.758189, -84.38361];

const sampleMarkers = (
  <CircleMarker center={center} radius={100} interactive={false}>
    <Marker position={center} />
  </CircleMarker>
);

const samplePopup = (
  <div>
    <h1>Popup Title</h1>
    <p>
      Sample <span style={{ color: "purple" }}>popup</span> content.
    </p>
  </div>
);

const onClick = action("onClick");
const onPopupClosed = action("onPopupClosed");
const onOverlayAdded = action("onOverlayAdded");
const onOverlayRemoved = action("onOverlayRemoved");
const onViewportChanged = action("onViewportChanged");

export const clickAndViewportchangedEvents = () => (
  <BaseMap
    center={center}
    onClick={onClick}
    onViewportChanged={onViewportChanged}
  ></BaseMap>
);

export const zoomed = () => <BaseMap center={center} zoom={17} />;

export const maxZoom = () => <BaseMap center={center} maxZoom={18} zoom={30} />;

export const withTwoBaseLayers = () => (
  <BaseMap baseLayers={twoBaseLayers} center={center} />
);

export const withSampleMarkers = () => (
  <BaseMap center={center}>{sampleMarkers}</BaseMap>
);

export const withTwoOverlaysFromTrimetTransitComponents = () => (
  <div>
    <div>
      Click the layers button to toggle layers. Check actions log for overlay
      events.
    </div>
    <BaseMap
      center={center}
      onOverlayAdded={onOverlayAdded}
      onOverlayRemoved={onOverlayRemoved}
    >
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
    </BaseMap>
  </div>
);

export const withOverlaysOverlappingOtherMarkers = () => (
  <div>
    <div>
      You should be able to see the tooltip and interact with the dots inside
      the blue circle.
    </div>
    <BaseMap
      center={center}
      onOverlayAdded={onOverlayAdded}
      onOverlayRemoved={onOverlayRemoved}
    >
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
      {sampleMarkers}
    </BaseMap>
  </div>
);

export const customLocationPopupContent = () => (
  <BaseMap
    center={center}
    popupLocation={center}
    popupContent={samplePopup}
    onPopupClosed={onPopupClosed}
  />
);

export const customLocationPopupNoContent = () => (
  <BaseMap center={center} popupLocation={center} />
);

export const customPopupContentNoLocation = () => (
  <BaseMap center={center} popupContent={samplePopup} />
);
