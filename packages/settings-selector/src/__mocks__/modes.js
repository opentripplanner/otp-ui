const commonModes = {
  transitModes: [
    {
      mode: "BUS",
      label: "Bus"
    },
    {
      mode: "TRAM",
      label: "MAX & Streetcar"
    },
    {
      mode: "RAIL",
      label: "WES"
    },
    {
      mode: "GONDOLA",
      label: "Aerial Tram"
    }
  ],
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

export default commonModes;
