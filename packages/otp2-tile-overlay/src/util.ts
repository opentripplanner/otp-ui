const generateFloatingVehicleColor = (formFactor: string) => [
  "case",
  ["==", ["get", formFactor], "SCOOTER"],
  "#f5a729",
  ["==", ["get", formFactor], "BICYCLE"],
  "#f00",
  "#333"
];

// eslint-disable-next-line import/prefer-default-export
export const generateLayerPaint = (color?: string): any => {
  return {
    rentalStations: {
      "circle-color": color || generateFloatingVehicleColor("formFactors"),
      "circle-opacity": 0.9,
      "circle-stroke-color": "#333",
      "circle-stroke-width": 3
    },
    rentalVehicles: {
      "circle-color": color || generateFloatingVehicleColor("formFactor"),
      "circle-opacity": 0.9,
      "circle-stroke-color": "#333",
      "circle-stroke-width": 2
    },
    stations: {
      "circle-color": color || "#fff",
      "circle-opacity": 0.9,
      "circle-radius": 10,
      "circle-stroke-color": "#333",
      "circle-stroke-width": 3
    },
    stops: {
      "circle-color": color || "#fff",
      "circle-opacity": 0.9,
      "circle-stroke-color": "#333",
      "circle-stroke-width": 2
    },
    vehicleParking: {
      "circle-color": color || "black",
      "circle-opacity": 0.9,
      "circle-radius": 10,
      "circle-stroke-color": "#333",
      "circle-stroke-width": 3
    }
  };
};
