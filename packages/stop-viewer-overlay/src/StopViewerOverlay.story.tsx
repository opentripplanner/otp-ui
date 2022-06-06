import BaseMap from "@opentripplanner/base-map";
import React from "react";
import { Stop } from "@opentripplanner/types";

import { Marker } from "react-map-gl";
import DefaultStopMarker from "./default-stop-marker";
import StopViewerOverlay from ".";

import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [45.518092, -122.671202];
const zoom = 13;

const fakeStop = {
  id: "stop-id",
  lat: 45.518,
  lon: -122.671,
  name: "Fake Stop"
};

function CustomMarker({ stop }: { stop: Stop }) {
  return <Marker longitude={stop.lon} latitude={stop.lat} key={stop.id} />;
}

export default {
  title: "StopViewerOverlay",
  component: StopViewerOverlay
};

export const Default = (): JSX.Element => (
  <BaseMap center={center} zoom={zoom}>
    <StopViewerOverlay stop={fakeStop} StopMarker={DefaultStopMarker} visible />
  </BaseMap>
);

export const WithCustomMarker = (): JSX.Element => (
  <BaseMap center={center} zoom={zoom}>
    <StopViewerOverlay stop={fakeStop} StopMarker={CustomMarker} visible />
  </BaseMap>
);
