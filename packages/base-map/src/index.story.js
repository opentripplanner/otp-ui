import React from "react";
import { Marker, CircleMarker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";
import { text, withKnobs } from "@storybook/addon-knobs";

import BaseMap from ".";
import SelectVehicles from "../__mocks__/SelectVehicles";
import AllVehiclesOverlay from "../__mocks__/AllVehicles";
import ContextMenuDemo from "../__mocks__/ContextMenuDemo";

import "../../../node_modules/leaflet/dist/leaflet.css";

export default {
  title: "BaseMap",
  component: BaseMap,
  decorators: [withInfo, withKnobs],
  parameters: {
    info: {
      text: `
      The BaseMap component renders a Leaflet map with overlays and other ad-hoc markers
      that are declared as child elements of the BaseMap element.

      Overlays are groups of similar React-Leaflet markers, e.g. vehicle location markers, bus stop markers, etc.
      Overlays are automatically added to the overlay control displayed by the BaseMap. The user uses that control to turn overlays on or off.
      See the [Two Overlays From TriMet Transit Components](./?path=/story/basemap--with-two-overlays-from-trimet-transit-components) example for more information on overlays.
      `
    }
  }
};

const center = [45.522862, -122.667837];

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
const onContextMenu = action("onContextMenu");
const onPopupClosed = action("onPopupClosed");
const onOverlayAdded = action("onOverlayAdded");
const onOverlayRemoved = action("onOverlayRemoved");
const onViewportChanged = action("onViewportChanged");

const layerOnOverlayAdded = action("Layer::onOverlayAdded");
const layerOnOverlayRemoved = action("Layer::onOverlayRemoved");
const layerOnViewportChanged = action("Layer::onViewportChanged");

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

export const withExampleBaseLayers = () => {
  const mapboxToken = text("Your Mapbox token", "my_token");
  const exampleBaseLayers = [
    {
      name: "Streets",
      url:
        "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{retina}.png",
      attribution:
        'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
      retina: "@2x",
      detectRetina: true
    },
    {
      name: "TriMet",
      url:
        "//tile{s}.trimet.org/tilecache/tilecache.py/1.0.0/currentOSM/{z}/{x}/{y}",
      subdomains: "abcd",
      attribution:
        '&copy; <a target="#" href="https://www.oregonmetro.gov/rlis-live">Metro</a> | &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
      detectRetina: true
    },
    {
      name: "Mapbox (Bring your own token)",
      url: `//api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}{retina}?access_token=${mapboxToken}`,
      attribution:
        'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
      retina: "@2x"
    },
    {
      name: "Stamen Toner Lite",
      url: "http://tile.stamen.com/toner-lite/{z}/{x}/{y}{retina}.png",
      retina: "@2x",
      detectRetina: true,
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }
  ];

  return <BaseMap baseLayers={exampleBaseLayers} center={center} />;
};

export const withSampleMarkers = () => (
  <BaseMap center={center}>{sampleMarkers}</BaseMap>
);

export const withTwoOverlaysFromTrimetTransitComponents = () => (
  <div>
    <div>
      Click the layers button to toggle overlays. Overlays manage their own
      tooltips and popups. Check actions log for overlay events.
    </div>
    <BaseMap
      center={center}
      onOverlayAdded={onOverlayAdded}
      onOverlayRemoved={onOverlayRemoved}
      onViewportChanged={onViewportChanged}
    >
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles
        name="Fancier vehicle layer"
        onOverlayAdded={layerOnOverlayAdded}
        onOverlayRemoved={layerOnOverlayRemoved}
        onViewportChanged={layerOnViewportChanged}
        visible
      />
    </BaseMap>
  </div>
);

export const overlayWithLargeDataSet = () => (
  <div>
    <div>Do not add Storybook overhead on layers with large dataset...</div>
    <BaseMap center={center}>
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" limit={500} visible />
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
    popup={{ location: center, contents: samplePopup }}
    onPopupClosed={onPopupClosed}
  />
);

export const onContextMenuPopup = () => <ContextMenuDemo />;
