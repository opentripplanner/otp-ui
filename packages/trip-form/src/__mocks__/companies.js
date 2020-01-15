const commonCompanies = [
  // The first two should not be displayed (no rent or hail).
  {
    id: "MyBike1",
    label: "MyBike1",
    modes: "BICYCLE"
  },
  {
    id: "MyBike2",
    label: "MyBike2",
    modes: "BICYCLE"
  },
  {
    id: "Biketown",
    label: "Biketown",
    modes: "BICYCLE_RENT"
  },
  {
    id: "Lime",
    label: "Lime",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "Bolt",
    label: "Bolt",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "Razor",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "Uber",
    label: "Uber",
    modes: "CAR_HAIL"
  },
  {
    id: "Lyft",
    label: "Lyft",
    modes: "CAR_HAIL"
  }
];

export default commonCompanies;
