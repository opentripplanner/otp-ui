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
      mode: "WALK",
      showWheelchairSetting: true,
      label: "Saunter"
    },
    {
      mode: "BICYCLE",
      showWheelchairSetting: true,
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
      showWheelchairSetting: true,
      label: "Park & Ride"
    },
    {
      mode: "CAR_HAIL",
      showWheelchairSetting: true,
      label: "Transit + Uber",
      company: "Uber" // Optional.
      // If not set and the user selects this, "companies" should default to Uber.
    },
    {
      mode: "CAR_RENT",
      showWheelchairSetting: true,
      label: "Transit + ReachNow",
      company: "ReachNow"
    },
    {
      mode: "CAR_RENT",
      showWheelchairSetting: true,
      label: "Transit + Car2Go",
      company: "Car2Go"
    }
  ],
  exclusiveModes: ["WALK", "BICYCLE", "MICROMOBILITY"],

  bicycleModes: [
    {
      mode: "BICYCLE",
      showWheelchairSetting: true,
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
