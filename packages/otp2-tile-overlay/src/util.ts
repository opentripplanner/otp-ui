const generateFloatingVehicleColor = (formFactor: string) => [
  "case",
  ["==", ["get", formFactor], "SCOOTER"],
  "#f5a729",
  ["==", ["get", formFactor], "BICYCLE"],
  "#f00",
  "#333"
];

// eslint-disable-next-line import/prefer-default-export
export const LAYER_PAINT = {
  rentalStations: {
    "circle-color": generateFloatingVehicleColor("formFactors"),
    "circle-opacity": 0.9,
    "circle-stroke-color": "#333",
    "circle-stroke-width": 3
  },
  rentalVehicles: {
    "circle-color": generateFloatingVehicleColor("formFactor"),
    "circle-opacity": 0.9,
    "circle-stroke-color": "#333",
    "circle-stroke-width": 2
  },
  stations: {
    "circle-color": "pink",
    "circle-opacity": 0.9,
    "circle-radius": 10,
    "circle-stroke-color": "#333",
    "circle-stroke-width": 3
  },
  stops: {
    "circle-color": "pink",
    "circle-opacity": 0.9,
    "circle-stroke-color": "#333",
    "circle-stroke-width": 2
  },
  vehicleParking: {
    "circle-color": "black",
    "circle-opacity": 0.9,
    "circle-radius": 10,
    "circle-stroke-color": "#333",
    "circle-stroke-width": 3
  }
};
