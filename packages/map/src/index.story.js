import React from "react";

import BaseMap from ".";

import "../assets/map.css";

export default { title: "Map" };

const state = {
  lat: 33.84,
  lng: -84.1,
  zoom: 13
};

const center = {
  position: [state.lat, state.lng],
  zoom: state.zoom,
  showBeacon: false
}



export const noBeacon = () => <BaseMap center={center} />;
export const withBeacon = () => (
  <BaseMap center={{ ...center, showBeacon: true }} />
);
