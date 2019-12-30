export const supportedExclusiveModes = [
  {
    mode: "WALK",
    label: "Walk Only"
  },
  {
    mode: "BICYCLE",
    label: "Bike Only"
  },
  {
    mode: "MICROMOBILITY",
    label: "E-Scooter Only"
  }
];

export const commonModes = {
  accessModes: [
    {
      mode: "BICYCLE",
      label: "Transit + Personal Bike"
    },
    {
      mode: "BICYCLE_RENT",
      label: "Transit + Biketown"
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Transit + E-Scooter"
    },
    {
      mode: "CAR_PARK",
      label: "Park & Ride"
    },
    {
      mode: "CAR_HAIL",
      label: "Transit + Uber"
    }
  ],
  exclusiveModes: ["WALK", "BICYCLE"]
};
