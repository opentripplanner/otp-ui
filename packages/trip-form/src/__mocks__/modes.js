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
      // No company required here.
      // If the user selects this, "companies" should default to Biketown.
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Transit + E-scooter"
    },
    {
      mode: "CAR_PARK",
      label: "Park & Ride"
    },
    {
      mode: "CAR_HAIL",
      label: "Transit + Uber",
      company: "Uber" // Optional.
      // If not set and the user selects this, "companies" should default to Uber.
    }
  ],
  exclusiveModes: ["WALK", "BICYCLE", "MICROMOBILITY"],

  bicycleModes: [
    {
      mode: "BICYCLE",
      label: "Own Bike"
    },
    {
      mode: "BICYCLE_RENT",
      label: "Biketown"
    }
  ],
  // Micromobility-only modes are not used with TriMet.
  micromobilityModes: [
    {
      mode: "MICROMOBILITY",
      label: "Own E-scooter"
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Rental E-scooter"
    }
  ]
};

export default commonModes;
